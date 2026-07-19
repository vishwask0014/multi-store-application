"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRightIcon,
  Tick01Icon,
  SmartPhoneIcon,
} from "@hugeicons/core-free-icons";
import { fbAuth, RecaptchaVerifier } from "@/lib/firebase";
import {
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [phone, setPhone] = useState("");

  const handleSent = (c: ConfirmationResult, p: string) => {
    setConfirmation(c);
    setPhone(p);
    setStep("otp");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base px-4">
      <Background />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-surface-raised/40" />
      <div className="relative z-10 w-full max-w-sm">
        <GlowOrbs />
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-xl font-medium text-white shadow-lg shadow-primary/25 ring-1 ring-white/10">
            M
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-text-primary">
            {step === "phone" ? "Welcome back" : "Check your phone"}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
            {step === "phone"
              ? "Enter your phone number to continue"
              : "We sent a 6-digit code to your phone"}
          </p>
        </div>
        <div className="group relative">
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-primary/20 via-transparent to-surface-raised/50 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative rounded-2xl border border-border/50 bg-surface/60 p-7 backdrop-blur-xl transition-all duration-500 group-hover:border-primary/20 group-hover:bg-surface/80">
            {step === "phone" ? (
              <PhoneStep onSent={handleSent} />
            ) : (
              <OtpStep confirmation={confirmation} phone={phone} onBack={() => setStep("phone")} />
            )}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/30 to-transparent" />
          <p className="text-[11px] text-text-muted">
            Secured with end-to-end encryption
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/30 to-transparent" />
        </div>
      </div>
      <div id="recaptcha-container" />
    </div>
  );
}

function Background() {
  return (
    <div className="absolute inset-0 opacity-25" style={{
      backgroundImage: `
        radial-gradient(1.5px 1.5px at 12% 18%, rgba(255,255,255,0.6), transparent),
        radial-gradient(1px 1px at 28% 42%, rgba(255,255,255,0.4), transparent),
        radial-gradient(2px 2px at 42% 8%, rgba(255,255,255,0.5), transparent),
        radial-gradient(1px 1px at 58% 55%, rgba(255,255,255,0.3), transparent),
        radial-gradient(1.5px 1.5px at 72% 22%, rgba(255,255,255,0.5), transparent),
        radial-gradient(1px 1px at 88% 48%, rgba(255,255,255,0.4), transparent),
        radial-gradient(1px 1px at 18% 72%, rgba(255,255,255,0.3), transparent),
        radial-gradient(1.5px 1.5px at 62% 82%, rgba(255,255,255,0.4), transparent),
        radial-gradient(1px 1px at 92% 12%, rgba(255,255,255,0.35), transparent),
        radial-gradient(1px 1px at 38% 88%, rgba(255,255,255,0.3), transparent),
        radial-gradient(2.5px 2.5px at 52% 32%, rgba(255,255,255,0.6), transparent),
        radial-gradient(1px 1px at 8% 52%, rgba(255,255,255,0.25), transparent),
        radial-gradient(1.5px 1.5px at 78% 68%, rgba(255,255,255,0.35), transparent),
        radial-gradient(1px 1px at 48% 12%, rgba(255,255,255,0.4), transparent),
        radial-gradient(1px 1px at 22% 78%, rgba(255,255,255,0.3), transparent),
        radial-gradient(2px 2px at 96% 38%, rgba(255,255,255,0.5), transparent),
        radial-gradient(1px 1px at 32% 28%, rgba(255,255,255,0.45), transparent),
        radial-gradient(1px 1px at 68% 4%, rgba(255,255,255,0.3), transparent),
        radial-gradient(1.5px 1.5px at 82% 88%, rgba(255,255,255,0.4), transparent),
        radial-gradient(1px 1px at 14% 92%, rgba(255,255,255,0.25), transparent)
      `,
    }} />
  );
}

function GlowOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full opacity-10 blur-[80px]"
        style={{ background: "var(--color-primary)" }}
      />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-36 w-36 rounded-full opacity-8 blur-[60px]"
        style={{ background: "var(--color-accent)" }}
      />
    </>
  );
}

function PhoneStep({ onSent }: { onSent: (c: ConfirmationResult, phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const valid = phone.replace(/\D/g, "").length === 10;

  useEffect(() => {
    inputRef.current?.focus();
    verifierRef.current = new RecaptchaVerifier(fbAuth, "recaptcha-container", {
      size: "invisible",
    });
    return () => {
      verifierRef.current?.clear();
    };
  }, []);

  const handleSend = async () => {
    if (!valid || sending) return;
    setSending(true);
    setError("");
    try {
      const verifier = verifierRef.current!;
      const fullPhone = "+91" + phone.replace(/\D/g, "");
      const c = await signInWithPhoneNumber(fbAuth, fullPhone, verifier);
      verifierRef.current = null;
      onSent(c, fullPhone);
    } catch (e: any) {
      setError(e?.message || "Failed to send code. Try again.");
      verifierRef.current?.clear();
      verifierRef.current = new RecaptchaVerifier(fbAuth, "recaptcha-container", {
        size: "invisible",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-medium tracking-wide text-text-secondary">
          Phone number
        </label>
        <div
          className={`flex items-center gap-3 rounded-xl border bg-base px-4 py-3 transition-all duration-300 ${
            focused
              ? "border-primary/40 shadow-sm shadow-primary/10"
              : "border-border/50"
          }`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={SmartPhoneIcon} size={16} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">+91</span>
            <div className="h-4 w-px bg-border/30" />
          </div>
          <input
            ref={inputRef}
            type="tel"
            value={phone}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            onKeyDown={(e) => e.key === "Enter" && valid && handleSend()}
            placeholder="Enter your number"
            className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted tracking-wider"
          />
          {valid && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
              <HugeiconsIcon icon={Tick01Icon} size={14} className="text-success" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}
      </div>

      <button
        disabled={!valid || sending}
        onClick={handleSend}
        className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
        <span className="relative flex items-center justify-center gap-2">
          {sending ? "Sending..." : "Continue"}
          {!sending && (
            <HugeiconsIcon
              icon={ArrowRightIcon}
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          )}
        </span>
      </button>
    </div>
  );
}

function OtpStep({
  confirmation,
  phone,
  onBack,
}: {
  confirmation: ConfirmationResult | null;
  phone: string;
  onBack: () => void;
}) {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const isComplete = otp.every((d) => d);

  const handleVerify = async () => {
    if (!isComplete || verifying || !confirmation) return;
    setVerifying(true);
    setError("");
    try {
      await confirmation.confirm(otp.join(""));
      router.replace("/shop");
    } catch (e: any) {
      setError(e?.message || "Invalid code. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = () => {
    setResending(true);
    setCooldown(30);
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setResending(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="group flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        >
          <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
        </svg>
        Change number
      </button>

      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`flex h-13 w-11 items-center justify-center rounded-lg border bg-base text-center text-base text-text-primary outline-none transition-all duration-200 ${
              d
                ? "border-primary/40 shadow-sm shadow-primary/10"
                : "border-border/50"
            } focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-xs text-danger">{error}</p>
      )}

      <button
        disabled={!isComplete || verifying}
        onClick={handleVerify}
        className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        <span className="absolute inset-0 translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
        <span className="relative flex items-center justify-center gap-2">
          {verifying ? "Verifying..." : "Verify OTP"}
          {!verifying && (
            <HugeiconsIcon
              icon={ArrowRightIcon}
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          )}
        </span>
      </button>

      <p className="text-center text-xs text-text-muted">
        {cooldown > 0 ? (
          <>Resend in {cooldown}s</>
        ) : (
          <>
            Didn&apos;t receive?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary-hover disabled:opacity-40"
            >
              Resend code
            </button>
          </>
        )}
      </p>
    </div>
  );
}