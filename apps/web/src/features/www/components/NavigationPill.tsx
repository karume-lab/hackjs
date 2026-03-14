"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@repo/ui/web/components/ui/navigation-menu";
import { cn } from "@repo/ui/web/lib/utils";
import { Home, MessageSquare, Zap } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

const NAVIGATION_ITEMS = [
  {
    href: "#hero",
    label: "Home",
    Icon: Home,
  },
  {
    href: "#features",
    label: "Features",
    Icon: Zap,
  },
  {
    href: "#testimonials",
    label: "Testimonials",
    Icon: MessageSquare,
  },
];

const NavigationPill = () => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <NavigationMenu
        className={cn(
          "rounded-full border border-primary/10",
          "bg-background/20 backdrop-blur-xl shadow-2xl",
          "px-4 py-2 transition-all duration-300 hover:bg-background/40",
        )}
      >
        <NavigationMenuList className="gap-2">
          {NAVIGATION_ITEMS.map(({ href, label, Icon }) => (
            <NavigationMenuItem key={href}>
              <Link
                href={href as Route}
                className={cn(
                  "flex items-center justify-center size-10 rounded-full transition-all duration-300",
                  "text-foreground/70 hover:text-primary",
                  "hover:bg-primary/10 hover:scale-110",
                  "focus:bg-primary/10 focus:outline-none",
                )}
              >
                <Icon className="size-5 transition-transform duration-300" />
                <span className="sr-only">{label}</span>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavigationPill;
