"use client";

import { Badge } from "@/components/ui/badge";
import { megaMenus } from "./navigation-config";

const MegaMenu = ({ menuKey }) => {
  const menu = megaMenus[menuKey];

  if (!menu) return null;

  return (
    <div className="absolute left-0 top-full pt-2 w-screen max-w-4xl -ml-20 z-50">
      <div className="bg-card border rounded-lg shadow-xl p-6">
        <div className="grid grid-cols-3 gap-8">
          {menu.sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm text-foreground mb-3 pb-2 border-b">{section.title}</h3>
              <ul className="space-y-1">
                {section.items.map((subItem) => (
                  <li key={subItem.name}>
                    <a
                      href={subItem.href}
                      className="flex items-start gap-2 text-sm hover:bg-accent p-2 rounded-lg transition-colors group"
                      target={subItem.href.startsWith("http") ? "_blank" : undefined}
                      rel={subItem.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {subItem.icon && <subItem.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground group-hover:text-primary">{subItem.name}</span>
                          {subItem.badge && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                              {subItem.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
