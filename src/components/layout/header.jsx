"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Icon } from "../ui/icon";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const Header = ({ sidebarOpen, setSidebarOpen, title }) => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="bg-card border-b border-border px-4 py-3 lg:px-6 sticky top-0 z-30 backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Toggle sidebar">
            <Icon name="menu" className="w-5 h-5 text-foreground" />
          </button>

          {/* Home Button */}
          <Link href="/" className="p-2 hover:bg-accent rounded-lg transition-colors group" aria-label="Go to home">
            <Icon name="home" className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>

          {/* Page Title */}
          <div className="hidden sm:block h-6 w-px bg-border" />
          <h1 className="text-lg lg:text-xl font-semibold text-foreground">{title || "Dashboard"}</h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          {/* Notifications */}
          <button className="p-2 hover:bg-accent rounded-lg relative transition-colors group" aria-label="Notifications">
            <Icon name="bell" className="w-5 h-5 text-primary group-hover:text-foreground transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-card" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 lg:pl-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground leading-tight">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">{user?.role || "Member"}</p>
            </div>

            <button className="w-9 h-9 lg:w-10 lg:h-10 bg-primary rounded-full flex items-center justify-center hover:ring-2 hover:ring-ring transition-all" aria-label="User menu">
              <span className="text-primary-foreground font-semibold text-sm">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
