"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SettingsIcon,
  NotificationIcon,
  LockIcon,
  Moon01Icon,
  LogoutIcon,
  ArrowRightIcon,
  Tick01Icon,
  LanguageSkillIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";

const sections = [
  {
    title: "Preferences",
    items: [
      {
        label: "Notifications",
        icon: NotificationIcon,
        desc: "Push, email, and SMS alerts",
        type: "toggle",
        defaultOn: true,
      },
      {
        label: "Dark Mode",
        icon: Moon01Icon,
        desc: "Appearance theme",
        type: "toggle",
        defaultOn: true,
      },
      {
        label: "Language",
        icon: LanguageSkillIcon,
        desc: "English (US)",
        type: "link",
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        label: "Password",
        icon: LockIcon,
        desc: "Last changed 3 months ago",
        type: "link",
      },
      {
        label: "Two-Factor Auth",
        icon: LockIcon,
        desc: "Not enabled",
        type: "link",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "About",
        icon: InformationCircleIcon,
        desc: "Version 1.0.0",
        type: "link",
      },
    ],
  },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    Notifications: true,
    "Dark Mode": true,
  });

  const toggle = (label: string) => {
    setToggles((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-3xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-8 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">
              Settings
            </h1>
            <p className="text-sm text-text-muted">
              Manage your account preferences
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4 transition-all duration-200 hover:border-border-strong/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <HugeiconsIcon icon={item.icon} size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          {item.label}
                        </p>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </div>
                      {item.type === "toggle" ? (
                        <button
                          onClick={() => toggle(item.label)}
                          className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
                            toggles[item.label]
                              ? "bg-primary"
                              : "bg-border"
                          }`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
                              toggles[item.label]
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      ) : (
                        <HugeiconsIcon
                          icon={ArrowRightIcon}
                          size={16}
                          className="text-text-muted"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 border-t border-border/50 pt-6">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm font-medium text-danger transition-all duration-200 hover:bg-danger/10">
              <HugeiconsIcon icon={LogoutIcon} size={18} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
