"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNavigationMenu } from "../shared/navigation";
import { Icon } from "../ui/icon";

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;
  const menuItems = getNavigationMenu(user?.role);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  // Loading state
  if (status === "loading") {
    return (
      <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-sidebar-primary border-t-transparent"></div>
        </div>
      </aside>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  return (
    <>
      {/* Mobile backdrop with blur */}
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={() => setIsOpen(false)} aria-hidden="true" />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-sidebar-border z-50 
          transform transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-br from-sidebar-primary to-sidebar-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-sidebar-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-bold text-sidebar-foreground text-base">Tempe Nusantara</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1.5 hover:bg-sidebar-accent rounded-md transition-colors" aria-label="Close sidebar">
              <Icon name="x" className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        router.push(item.href);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg 
                        transition-all duration-200 text-sm font-medium group
                        ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                    >
                      <Icon
                        name={item.icon}
                        className={`w-5 h-5 transition-transform duration-200 
                          ${isActive ? "" : "group-hover:scale-110"}`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <div className="w-1.5 h-1.5 bg-sidebar-primary-foreground rounded-full"></div>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-sidebar-border bg-sidebar">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 
                hover:text-destructive border-border/50 hover:border-destructive/30 
                transition-all duration-200 group"
            >
              <Icon name="log-out" className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
