import { Outlet } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const AppLayout = () => {
  return (
    <div
      className="flex flex-col w-screen h-screen max-w-[1000px] landscape:max-h-[500px] mx-auto px-2 bg-white"
      id="app-layout"
    >
      <AppHeader />
      <div className="h-1.5 sticky top-0 z-50 bg-white"></div>
      {/* TODO: overflow-hidden removed to allow for testing, but it was part of a working layout until now */}
      <div className="w-full flex-1 " id="app-content-layout">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
};

export default AppLayout;
