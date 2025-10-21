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

  // Show loading state
  if (status === "loading") {
    return (
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </aside>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo & Brand */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold text-primary">Tempe Nusantara</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="text-sm text-gray-600 mb-2">
            <p>Welcome back,</p>
            <p className="font-medium text-primary text-base">{user.name}</p>
            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
          </div>
          <Badge variant="secondary" className="mt-2 text-xs">
            {user.role}
          </Badge>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-4 flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      router.push(item.href);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    <Icon name={item.icon} className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <Button onClick={handleLogout} variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">
            <Icon name="log-out" className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};
