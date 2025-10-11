import { MdMenu } from "react-icons/md";

export const MenuToggle = () => {
  const toggleDrawer = () => {
    console.log("Toggling drawer");
    // useDrawer().toggle();
  };

  return (
    <div className="flex w-full items-center pl-2.5">
      <button
        className="noDrag flex items-center rounded-lg p-1 hover:bg-background-light"
        onClick={toggleDrawer}
      >
        <MdMenu className="noDrag size-7" />
      </button>
    </div>
  );
};
