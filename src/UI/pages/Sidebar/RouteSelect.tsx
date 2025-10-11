import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";
import {
  MdOutlinePerson,
  MdGroups,
  MdDashboard,
  MdAddCircle,
  MdPlayArrow,
  MdSports,
  MdRefresh
} from "react-icons/md";
import { socket } from "../../api/socket";
import { ModeToggle } from "@/components/mode-toggle";

interface RouteProps {
  Icon: IconType;
  title: string;
  to: string;
  target?: string;
}

const routes: RouteProps[] = [
  /* Matches redirect to home (/) */
  { Icon: MdAddCircle, title: "Matches", to: "" },
  { Icon: MdOutlinePerson, title: "Players", to: "players" },
  { Icon: MdGroups, title: "Teams", to: "teams" },
  { Icon: MdSports, title: "Coaches", to: "coaches" },
  { Icon: MdDashboard, title: "Dashboard", to: "dashboard" },
];

const refreshHud = () => {
  console.log("Refreshing hud");
  socket.emit("refreshHUD");
};

export const RouteSelect = () => {
  return (
    <div className="flex justify-between items-center bg-sidebar/95 w-full rounded-lg shadow-lg py-5 px-2">
      <div className="relative flex items-center gap-2">
        {routes.map((route, index) => (
          <NavRoutes key={index} {...route} />
        ))}
        {/* <div className="flex size-full w-full border-t border-border pt-4 text-accent-foreground">
          <button
            className="relative flex h-7 w-full items-center gap-1 rounded-lg bg-sidebar py-5 hover:bg-sidebar-border"
            onClick={() => window.electron.startOverlay()}
          >
            <MdPlayArrow className="absolute left-3.5 size-7" />
            {isOpen && <p className="pl-14 font-semibold">Overlay</p>}
          </button>
        </div> */}
        {/* <div className="flex size-full w-full text-accent-foreground">
          <button
            className="relative flex h-7 w-full items-center gap-1 rounded-lg bg-sidebar py-5 hover:bg-sidebar-border"
            onClick={refreshHud}
          >
            <MdRefresh className="absolute left-3.5 size-7" />
            {isOpen && <p className="pl-14 font-semibold">Refresh hud</p>}
          </button>
        </div> */}
      </div>
      <ModeToggle/>
    </div>
  );
};

const NavRoutes = ({ Icon, title, target, to }: RouteProps) => {
  const isOpen = true; // useDrawer().isOpen;
  return (
    <NavLink
      to={to}
      target={target}
      className={({ isActive }) =>
        `flex items-center justify-center py-4 border-b-4 ${isActive ? "text-sidebar-accent-foreground border-primary" : "text-muted-foreground border-transparent"}`
      }
    >
      {({ isActive }) => (
        <div className="flex h-7 items-center hover:bg-sidebar-border rounded-lg py-5 px-3.5">
          {/* <Icon
            className={`size-7 ${isActive ? "text-primary-light" : "text-accent-foreground-disabled"} absolute`}
          /> */}
          {isOpen && (
            <p
              className={`font-semibold`}
            >
              {title}
            </p>
          )}
        </div>
      )}
    </NavLink>
  );
};
