import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/UserList/UsersList";
import UserProfileDetails from "./pages/UserList/UserProfileDetails";
import UsersLegacy from "./pages/UserLegacy/UsersLegacy";
import Payments from "./pages/payments/Payments";
import SettingsPage from "./pages/Settings/SettingsPage";
import ComponentLibrary from "./pages/ComponentLibrary/ComponentLibrary";
import ModerationReports from "./pages/Moderation_Reports/Moderatio_Reports";
import ReportsPage from "./pages/Moderation_Reports/ReportsPage";
import ReportDetailModal from "./pages/UserList/ReportDetailModal";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
         <Route path="/userslegacy" element={<UsersLegacy/>}/>
         <Route path="/payments" element={<Payments/>}/>
         <Route path="/settings" element={<SettingsPage/>}/>
         <Route path="/componentLibrary" element={<ComponentLibrary />} />
         <Route path="/ModeratioReports" element={<ModerationReports/>} />
         <Route path="/userProfileDetails" element={<UserProfileDetails/>} />
         <Route path="/reportDetailModal" element={<ReportDetailModal/>} />
         <Route path="/reports" element={<ReportsPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
