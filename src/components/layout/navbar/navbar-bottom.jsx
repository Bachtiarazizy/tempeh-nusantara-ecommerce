"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { mainNavigation } from "./navigation-config";
import MegaMenu from "./mega-menu";

const NavbarBottom = ({ activeMegaMenu, setActiveMegaMenu }) => {
  const router = useRouter();

  return (
    <div className="border-t border-border bg-muted/20 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 h-12">
          <a href="/" className="text-foreground hover:text-primary hover:bg-accent px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Home
          </a>
          {mainNavigation.map((item) => (
            <div key={item.name} className="relative" onMouseEnter={() => item.hasMegaMenu && setActiveMegaMenu(item.megaMenuKey)} onMouseLeave={() => setActiveMegaMenu(null)}>
              <button onClick={() => !item.hasMegaMenu && router.push(item.href)} className="text-foreground hover:text-primary hover:bg-accent px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                {item.name}
                {item.hasMegaMenu && <ChevronDown className={`w-4 h-4 transition-transform ${activeMegaMenu === item.megaMenuKey ? "rotate-180" : ""}`} />}
              </button>

              {/* Mega Menu */}
              {item.hasMegaMenu && activeMegaMenu === item.megaMenuKey && <MegaMenu menuKey={item.megaMenuKey} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarBottom;
