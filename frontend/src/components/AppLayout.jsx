import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen">
        <div className="px-8 py-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;