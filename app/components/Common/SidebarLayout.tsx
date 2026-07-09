"use client";

import { SidebarProvider, useSidebar } from "@/app/providers";
import Sidebar from "@/app/components/Common/Sidebar";
import BottomNav from "@/app/components/Common/BottomNav";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarInner>{children}</SidebarInner>
    </SidebarProvider>
  );
}

function SidebarInner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <BottomNav />
      {children}
    </>
  );
}