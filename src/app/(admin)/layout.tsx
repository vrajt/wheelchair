"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, navItems, bottomNavItems, type NavItem } from "@/config/nav";
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/admin-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package2 } from "lucide-react";

function getPageTitle(pathname: string): string {
  const activeItem = navItems.find((item) => item.href === pathname);
  return activeItem ? activeItem.title : "Dashboard";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg text-primary group-data-[collapsible=icon]:hidden">
              <Package2 className="h-6 w-6 text-primary" />
              <span>{APP_NAME}</span>
            </Link>
             <Link href="/dashboard" className="flex items-center justify-center gap-2 font-semibold text-lg text-primary group-data-[collapsible=icon]:not:hidden hidden">
              <Package2 className="h-6 w-6 text-primary" />
            </Link>
          </SidebarHeader>
          <ScrollArea className="flex-1">
            <SidebarContent className="py-2">
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </ScrollArea>
          <SidebarFooter className="p-4 mt-auto border-t">
             <SidebarMenu>
                {bottomNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <AdminHeader pageTitle={pageTitle} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
