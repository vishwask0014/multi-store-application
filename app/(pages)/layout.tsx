"use client";

import SidebarLayout from "@/app/components/Common/SidebarLayout";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}