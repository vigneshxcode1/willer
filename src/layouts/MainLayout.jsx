import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopSearch from "../components/TopSearch";
import "../layouts/layout.css"
export default function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <TopSearch />
        <Outlet />
      </div>
    </div>
  );
}
