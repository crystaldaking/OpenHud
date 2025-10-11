import { Outlet } from "react-router-dom";

export const PageContainer = () => {
  return (
    <div
      id="PageContainer"
      className="relative flex flex-1 h-full w-full items-center justify-center overflow-y-auto bg-background px-4"
    >
      <Outlet />
    </div>
  );
};
