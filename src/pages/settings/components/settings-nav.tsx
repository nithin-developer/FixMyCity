import { NavLink } from "react-router-dom";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { UserCircle, Palette, Shield, KeyRound } from "lucide-react";

const navItems = [
  {
    title: "Account",
    href: "/settings/account",
    icon: UserCircle,
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: Palette,
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: Shield,
  },
  {
    title: "Two Factor Auth",
    href: "/settings/two-factor-authentication",
    icon: KeyRound,
  },
];

export function SettingsNav() {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}