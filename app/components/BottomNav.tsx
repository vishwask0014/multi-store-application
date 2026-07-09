"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  HomeIcon,
  StoreIcon,
  ShoppingCartIcon,
  CalendarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { label: "Home", icon: HomeIcon },
  { label: "Categories", icon: StoreIcon },
  { label: "Cart", icon: ShoppingCartIcon },
  { label: "Bookings", icon: CalendarIcon },
  { label: "Profile", icon: UserIcon },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-18 items-center justify-around border-t border-border/50 bg-base/80 px-2 backdrop-blur-2xl lg:hidden">
      {navItems.map((item, i) => (
        <a
          key={item.label}
          href="#"
          className={`group relative flex flex-col items-center gap-0.5 px-4 py-2 transition-all duration-200 ${
            i === 0 ? "text-primary" : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {i === 0 && (
            <span className="absolute inset-0 mx-auto mt-0.5 h-1 w-6 rounded-full bg-primary shadow-sm shadow-primary/50" />
          )}
          <HugeiconsIcon icon={item.icon} size={22} className="relative" />
          <span className="relative text-[10px] font-medium tracking-wide">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
