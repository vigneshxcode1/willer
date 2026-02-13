import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <h2 className="logo">💚 LoveLink Admin</h2>

        <ul className="menu">
          <li>
            <NavLink to="/">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/users">Users</NavLink>
          </li>

          <li>
            <NavLink to="/userslegacy">Users(Legacy)</NavLink>
          </li>

          {/* <li>Verification</li> */}
          {/* <li>Content Moderation</li> */}
       <li>
            <NavLink to="/ModeratioReports">Moderation & Reports</NavLink>
          </li>


          <li>
            <NavLink to="/payments">Payments</NavLink>
          </li>



          {/* <li>
            <NavLink to="/settings">Settings</NavLink>
          </li> */}
          {/* <li>Audit Log</li> */}
          <li>
            {/* <NavLink to="/componentLibrary">Component Library</NavLink> */}
          </li>
        </ul>

        <p className="version">v1.0.0</p>
      </div>

      {/* CSS in the same file */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: Inter, sans-serif;
        }

        .dashboard-layout, .app-layout {
          display: flex;
          height: 100vh;
          background: #f4f5f7;
        }

        .sidebar {
          position: fixed; /* fix sidebar */
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          background: #1e1e1e;
          color: white;
          padding: 20px;
          overflow-y: auto;
          z-index: 1000;
        }

        .logo {
          color: #b6ff00;
          font-size: 20px;
          margin-bottom: 30px;
        }

        .menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .menu li {
          padding: 20px;
          cursor: pointer;
          opacity: 0.8;
          margin-bottom: 5px;
        }

        .menu li a {
          color: white;
          text-decoration: none;
          display: block;
        }

        .menu li a.active {
          background: #b6ff00;
          color: black;
          border-radius: 6px;
          padding:10px;
        }

        .version {
          position: absolute;
          bottom: 20px;
          font-size: 12px;
        }

        .main {
          margin-left: 260px; /* leave space for fixed sidebar */
          flex: 1;
          padding: 20px 30px;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          position: sticky;
          top: 0;
          background: #f4f5f7;
          z-index: 500;
          padding-bottom: 10px;
        }

        .topbar input {
          width: 60%;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ddd;
        }
      `}</style>
    </>
  );
}
