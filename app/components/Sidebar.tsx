"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  HomeIcon,
  StoreIcon,
  ShoppingCartIcon,
  CalendarIcon,
  UserIcon,
  SettingsIcon,
  LogoutIcon,
  ArrowLeftIcon,
} from "@hugeicons/core-free-icons";
import { useSidebar } from "@/app/providers";

const navItems = [
  { label: "Home", icon: HomeIcon },
  { label: "Stores", icon: StoreIcon },
  { label: "Cart", icon: ShoppingCartIcon },
  { label: "Bookings", icon: CalendarIcon },
  { label: "Profile", icon: UserIcon },
];

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border/50 bg-base/90 backdrop-blur-xl lg:flex"
      style={{
        width: collapsed ? 64 : 240,
        transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="flex h-16 items-center border-b border-border/50 overflow-hidden px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-sm font-medium shadow-lg shadow-primary/20">
          M
        </div>
        <div
          className="overflow-hidden whitespace-nowrap"
          style={{
            maxWidth: collapsed ? 0 : 160,
            opacity: collapsed ? 0 : 1,
            marginLeft: collapsed ? 0 : 10,
            transition:
              "max-width 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), margin-left 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <span className="text-base font-medium tracking-tight text-text-primary">
            Marketplace
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-2 py-4">
        <nav className="flex w-full flex-col items-center gap-1">
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href="#"
              className={`group relative flex items-center rounded-xl ${collapsed ? "justify-center" : "w-full"
                } ${i === 0
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-surface-raised/40 hover:text-text-primary"
                }`}
              style={{
                height: collapsed ? 40 : 40,
                padding: "10px 12px",
                gap: collapsed ? 0 : 12,
                transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <span className="flex shrink-0 items-center justify-center w-5">
                <HugeiconsIcon icon={item.icon} size={i === 0 ? 20 : 18} />
              </span>
              <span
                className="overflow-hidden whitespace-nowrap text-sm font-medium"
                style={{
                  maxWidth: collapsed ? 0 : 120,
                  opacity: collapsed ? 0 : 1,
                  transition: "max-width 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {item.label}
              </span>

              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-3 z-50 rounded-lg border border-border/50 bg-surface px-3 py-1.5 text-sm text-text-primary opacity-0 shadow-xl whitespace-nowrap group-hover:opacity-100"
                  style={{ transition: "opacity 200ms ease" }}>
                  {item.label}
                </span>
              )}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center border-t border-border/50 px-2 py-3">
        <a
          href="#"
          className="group relative flex items-center rounded-xl text-text-secondary hover:bg-surface-raised/40 hover:text-text-primary"
          style={{
            height: 40,
            width: collapsed ? 40 : "100%",
            padding: "10px 12px",
            gap: collapsed ? 0 : 12,
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <span className="flex shrink-0 items-center justify-center w-5">
            <HugeiconsIcon icon={SettingsIcon} size={18} />
          </span>
          <span
            className="overflow-hidden whitespace-nowrap text-sm"
            style={{
              maxWidth: collapsed ? 0 : 120,
              opacity: collapsed ? 0 : 1,
              transition: "max-width 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Settings
          </span>
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 rounded-lg border border-border/50 bg-surface px-3 py-1.5 text-sm text-text opacity-0 shadow-xl whitespace-nowrap group-hover:opacity-100"
              style={{ transition: "opacity 200ms ease" }}>
              Settings
            </span>
          )}
        </a>
        <a
          href="#"
          className="group relative flex items-center rounded-xl text-text-secondary hover:bg-surface-raised/40 hover:text-text-primary"
          style={{
            height: 40,
            width: collapsed ? 40 : "100%",
            padding: "10px 12px",
            gap: collapsed ? 0 : 12,
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <span className="flex shrink-0 items-center justify-center w-5">
            <HugeiconsIcon icon={LogoutIcon} size={18} />
          </span>
          <span
            className="overflow-hidden whitespace-nowrap text-sm"
            style={{
              maxWidth: collapsed ? 0 : 120,
              opacity: collapsed ? 0 : 1,
              transition: "max-width 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Log out
          </span>
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 rounded-lg border border-border/50 bg-surface px-3 py-1.5 text-sm text-text shadow-xl whitespace-nowrap group-hover:opacity-100"
              style={{ transition: "opacity 200ms ease" }}>
              Log out
            </span>
          )}
        </a>
      </div>

      <div className="flex items-center border-t border-border/50" style={{
        height: 52,
        padding: collapsed ? "0" : "0 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <button
          onClick={toggle}
          className="flex items-center justify-center rounded-xl text-text-muted hover:bg-surface-raised/40 hover:text-text-primary"
          style={{
            height: 36,
            width: collapsed ? 36 : "100%",
            gap: collapsed ? 0 : 8,
            padding: collapsed ? 0 : "0 12px",
            transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <HugeiconsIcon
            icon={ArrowLeftIcon}
            size={16}
            style={{
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          <span
            className="overflow-hidden whitespace-nowrap text-sm"
            style={{
              maxWidth: collapsed ? 0 : 100,
              opacity: collapsed ? 0 : 1,
              transition: "max-width 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}