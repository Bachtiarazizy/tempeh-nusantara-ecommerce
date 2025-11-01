"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mainNavigation } from "./navigation-config";

const MobileMenu = ({ isOpen, setIsOpen }) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <nav className="space-y-1">
            <a href="/" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors" onClick={() => setIsOpen(false)}>
              Home
            </a>
            {mainNavigation.map((item) => (
              <a key={item.name} href={item.href} className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors" onClick={() => setIsOpen(false)}>
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
