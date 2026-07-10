"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ElectricPlugsIcon,
  Home01Icon,
  Book01Icon,
  MusicNote01Icon,
  HealthIcon,
  GameController01Icon,
  WorkoutSportIcon,
  Fashion,
  Sport,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";

const categories = [
  { name: "Electronics", icon: ElectricPlugsIcon, count: 128, color: "from-blue-500/20 to-blue-600/10" },
  { name: "Fashion", icon: Fashion, count: 96, color: "from-pink-500/20 to-pink-600/10" },
  { name: "Home & Garden", icon: Home01Icon, count: 72, color: "from-green-500/20 to-green-600/10" },
  { name: "Sports", icon: Sport, count: 54, color: "from-orange-500/20 to-orange-600/10" },
  { name: "Books", icon: Book01Icon, count: 41, color: "from-yellow-500/20 to-yellow-600/10" },
  { name: "Music", icon: MusicNote01Icon, count: 33, color: "from-purple-500/20 to-purple-600/10" },
  { name: "Health & Beauty", icon: HealthIcon, count: 67, color: "from-red-500/20 to-red-600/10" },
  { name: "Toys & Games", icon: GameController01Icon, count: 29, color: "from-teal-500/20 to-teal-600/10" },
];

const items = [
  { name: "Items", count: 312, desc: "Physical products ready to ship" },
  { name: "Services", count: 178, desc: "Bookable experiences & sessions" },
];

export default function CategoriesPage() {
  return (
    <SidebarLayout>
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pt-8 pb-6 lg:px-8">
          <div className="mb-8 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">
              Categories
            </h1>
            <p className="text-sm text-text-muted">
              Browse by category or offering type
            </p>
          </div>

          <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.name}
                className="group cursor-pointer rounded-xl border border-border/50 bg-surface p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <p className="text-lg font-medium text-text-primary">{item.name}</p>
                <p className="mt-1 text-2xl font-medium text-primary">{item.count}</p>
                <p className="mt-0.5 text-xs text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="group cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div
                  className={`flex items-center justify-center bg-gradient-to-br ${cat.color} p-8`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface/60 text-text-primary ring-1 ring-border/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <HugeiconsIcon icon={cat.icon} size={26} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-text-primary">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {cat.count} offerings
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
