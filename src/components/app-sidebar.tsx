import { Calendar, Home, Inbox, Settings, ClipboardCheck } from "lucide-react"
import {
  MdOutlinePerson,
  MdGroups,
  MdDashboard,
  MdAddCircle,
  MdPlayArrow,
  MdSports,
  MdRefresh
} from "react-icons/md";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"

// Menu routes.
const routes = [
  {
    title: "Matches",
    url: "",
    icon: MdAddCircle,
  },
  {
    title: "Players",
    url: "players",
    icon: MdOutlinePerson,
  },
  {
    title: "Teams",
    url: "teams",
    icon: MdGroups,
  },
  {
    title: "Coaches",
    url: "coaches",
    icon: MdSports,
  },
  {
    title: "Dashboard",
    url: "dashboard",
    icon: MdDashboard,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        Hello
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton className="hover:text-primary pl-4 font-semibold" asChild size={"lg"}>
                    <NavLink to={route.url}>
                      <route.icon/>
                      <span className="text-lg">{route.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle/>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}