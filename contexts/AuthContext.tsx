"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { fbAuth } from "@/lib/firebase";
import type { MongoUserData } from "@/lib/services/auth";
import type { UserRole, OwnerStatus } from "@/lib/models/User";

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

interface AuthState {
  firebaseUser: FirebaseUser | null;
  mongoUser: MongoUserData | null;
  loading: boolean;
  isOwner: boolean;
  role: UserRole | null;
  ownerStatus: OwnerStatus | null;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshMongoUser: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  applyForOwnership: (businessData: {
    businessName: string;
    businessAddress: string;
    businessCategory: string;
    gstNumber?: string;
    businessRegNumber?: string;
    aadharNumber?: string;
    panNumber?: string;
  }) => Promise<void>;
}

const initialState: AuthState = {
  firebaseUser: null,
  mongoUser: null,
  loading: true,
  isOwner: false,
  role: null,
  ownerStatus: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signOut: async () => {},
  refreshMongoUser: async () => {},
  updateName: async () => {},
  applyForOwnership: async () => {},
});

function deriveRoleState(mongoUser: MongoUserData | null) {
  return {
    isOwner:
      mongoUser?.role === "OWNER" &&
      mongoUser?.ownerStatus === "VERIFIED" &&
      mongoUser?.status === "ACTIVE",
    role: (mongoUser?.role as UserRole) || null,
    ownerStatus: (mongoUser?.ownerStatus as OwnerStatus) || null,
  };
}

async function syncMongoUser(fbUser: FirebaseUser): Promise<MongoUserData | null> {
  try {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: fbUser.uid,
        phone: fbUser.phoneNumber || "",
        name: fbUser.displayName || "",
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[Auth] POST /api/user failed:", res.status, text);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error("[Auth] syncMongoUser error:", err);
    return null;
  }
}

async function fetchMongoUser(uid: string): Promise<MongoUserData | null> {
  try {
    const res = await fetch(`/api/user?uid=${uid}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, async (fbUser) => {
      if (fbUser) {
        setCookie("uid", fbUser.uid);
        const token = await fbUser.getIdToken().catch(() => null);
        if (token) setCookie("__session", token);

        setState((prev) => ({
          ...prev,
          firebaseUser: fbUser,
          loading: false,
        }));

        syncMongoUser(fbUser).then((mongoUser) => {
          if (mongoUser) {
            setState((prev) => ({
              ...prev,
              mongoUser,
              ...deriveRoleState(mongoUser),
            }));
          }
        });
      } else {
        removeCookie("__session");
        removeCookie("uid");
        setState({
          firebaseUser: null,
          mongoUser: null,
          loading: false,
          isOwner: false,
          role: null,
          ownerStatus: null,
        });
      }
    });

    return unsub;
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(fbAuth);
    removeCookie("__session");
    removeCookie("uid");
    setState({
      firebaseUser: null,
      mongoUser: null,
      loading: false,
      isOwner: false,
      role: null,
      ownerStatus: null,
    });
  }, []);

  const refreshMongoUser = useCallback(async () => {
    const uid = state.firebaseUser?.uid;
    if (!uid) return;
    const mongoUser = await fetchMongoUser(uid);
    if (mongoUser) {
      setState((prev) => ({
        ...prev,
        mongoUser,
        ...deriveRoleState(mongoUser),
      }));
    }
  }, [state.firebaseUser?.uid]);

  const updateName = useCallback(
    async (name: string) => {
      const uid = state.firebaseUser?.uid;
      if (!uid) return;
      const res = await fetch(`/api/user?uid=${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) await refreshMongoUser();
    },
    [state.firebaseUser?.uid, refreshMongoUser]
  );

  const applyForOwnership = useCallback(
    async (businessData: {
      businessName: string;
      businessAddress: string;
      businessCategory: string;
      gstNumber?: string;
      businessRegNumber?: string;
      aadharNumber?: string;
      panNumber?: string;
    }) => {
      const uid = state.firebaseUser?.uid;
      if (!uid) return;
      const res = await fetch(`/api/user?uid=${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "apply-owner", ...businessData }),
      });
      if (res.ok) {
        await refreshMongoUser();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit owner application");
      }
    },
    [state.firebaseUser?.uid, refreshMongoUser]
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signOut,
        refreshMongoUser,
        updateName,
        applyForOwnership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
