"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Icon } from "../ui/icon";
import { Badge } from "@/components/ui/badge";

export const Header = ({ sidebarOpen, setSidebarOpen, title }) => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Icon name="menu" className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-primary">{title || "Dashboard"}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Bell (Optional) */}
          <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg relative">
            <Icon name="bell" className="w-5 h-5 text-primary" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
