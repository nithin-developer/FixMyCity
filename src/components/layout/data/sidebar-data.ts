import { IconLayoutDashboard, IconShieldLock } from "@tabler/icons-react";
import { AiFillCopy } from "react-icons/ai";
import { Command, Users, Activity, UserCog, Settings } from "lucide-react";

import { IconPalette, IconLock } from "@tabler/icons-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    full_name: "Nithin Kumar K",
    email: "nithinkumark6364@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
  name: "FixMyStreet",
      logo: Command,
  plan: "Civic Issue Platform",
    },
  ],
  navGroups: [
    {
      title: "Features",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: IconLayoutDashboard,
        },
        {
          title: "Issues",
          url: "/issues",
          icon: Activity,
        },
        
        
        {
          title: "Reports",
          url: "/reports",
          icon: AiFillCopy,
          roles: ["admin", "collector", "municipal_officer"],
        },
        {
          title: "Collectors",
            url: "/collectors",
          icon: Users,
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Administrators",
          url: "/administrators",
          icon: IconShieldLock,
          roles: ["admin"],
        },
        {
          title: "Settings",
          icon: Settings,
          roles: ["admin", "collector", "municipal_officer"],
          items: [
            {
              title: "Account",
              url: "/settings/account",
              icon: UserCog,
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
              icon: IconPalette,
            },
            {
              title: "Security",
              url: "/settings/security",
              icon: IconLock,
            },
            {
              title: "Two Factor Auth",
              url: "/settings/two-factor-authentication",
              icon: IconShieldLock,
            },
          ],
        },
      ],
    },
  ],
};
