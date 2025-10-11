import { AppFrame, MainPanel } from "./MainPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ReactNode } from "react";
import { RouteSelect } from "./Sidebar/RouteSelect";


export const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <div
      className={`flex h-screen w-screen flex-col bg-background text-accent-foreground`}
    >
      <AppFrame />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div id="TopNav" className="sticky top-1 h-20 right-4 z-50 w-screen flex px-4">
          <RouteSelect />
        </div>
        <MainPanel />
        {/* <SidebarProvider>
          <AppSidebar />
          <main className="flex flex-1 flex-col overflow-hidden">
            <SidebarTrigger className="size-10" />
            {children}
            <MainPanel />
          </main>
        </SidebarProvider> */}
      </div>
    </div>
  );
};
