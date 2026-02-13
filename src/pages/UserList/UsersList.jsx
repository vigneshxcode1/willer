import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "./UsersList.css";


import {
  getUsers,
  getTotalUsers,
  getTotalSubscription,
  getVerifiedUsers,
  getActiveTodayUsers,

  // ✅ NEW WEEK FUNCTIONS
  getThisWeekUsersCount,
  getLastWeekUsersCount,
  getThisWeekPremiumUsersCount,
  getLastWeekPremiumUsersCount,
  getThisWeekActiveUsersCount,
  getLastWeekActiveUsersCount,
  getThisWeekVerifiedUsersCount,
  getLastWeekVerifiedUsersCount,
  calculatePercentage,
} from "../../services/adminApi";

export default function UsersList() {
  const USERS_PER_PAGE = 10;

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalsubscription, setTotalSubscription] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);

  // ✅ PERCENT STATES
  const [totalUsersPercent, setTotalUsersPercent] = useState(0);
  const [premiumUsersPercent, setPremiumUsersPercent] = useState(0);
  const [activeTodayPercent, setActiveTodayPercent] = useState(0);
  const [verifiedUsersPercent, setVerifiedUsersPercent] = useState(0);

  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const [
          usersData,
          usersCount,
          subscriptions,
          verified,
          activeTodayCount,

          // ✅ WEEK DATA
          thisWeekUsers,
          lastWeekUsers,

          thisWeekPremium,
          lastWeekPremium,

          thisWeekActive,
          lastWeekActive,

          thisWeekVerified,
          lastWeekVerified,
        ] = await Promise.all([
          getUsers(page, USERS_PER_PAGE),
          getTotalUsers(),
          getTotalSubscription(),
          getVerifiedUsers(),
          getActiveTodayUsers(),

          getThisWeekUsersCount(),
          getLastWeekUsersCount(),

          getThisWeekPremiumUsersCount(),
          getLastWeekPremiumUsersCount(),

          getThisWeekActiveUsersCount(),
          getLastWeekActiveUsersCount(),

          getThisWeekVerifiedUsersCount(),
          getLastWeekVerifiedUsersCount(),
        ]);

        // MAIN COUNTS
        setUsers(usersData);
        setTotalUsers(usersCount);
        setTotalSubscription(subscriptions);
        setVerifiedUsers(verified);
        setActiveToday(activeTodayCount);

        // ✅ CALCULATE PERCENTAGES
        setTotalUsersPercent(calculatePercentage(thisWeekUsers, lastWeekUsers));
        setPremiumUsersPercent(
          calculatePercentage(thisWeekPremium, lastWeekPremium)
        );
        setActiveTodayPercent(
          calculatePercentage(thisWeekActive, lastWeekActive)
        );
        setVerifiedUsersPercent(
          calculatePercentage(thisWeekVerified, lastWeekVerified)
        );
      } catch (error) {
        console.error("Error loading users page:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [page]);

  return (
    <div className="users-page">
      {/* Header */}
      <h1 className="page-title">Users List</h1>
      <p className="page-subtitle">
        Comprehensive view of all registered users on the platform
      </p>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Users"
          value={totalUsers.toLocaleString()}
          trend={totalUsersPercent}
        />

        <StatCard
          label="Premium Users"
          value={totalsubscription.toLocaleString()}
          trend={premiumUsersPercent}
        />

        <StatCard
          label="Active Today"
          value={activeToday.toLocaleString()}
          trend={activeTodayPercent}
        />

        <StatCard
          label="Verified Users"
          value={(verifiedUsers ?? 0).toLocaleString()}
          trend={verifiedUsersPercent}
        />
      </div>

      {/* Table */}
      <div className="table-card">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>Mobile_Number</th>
                <th>STATUS</th>
                <th>SUBSCRIPTION</th>
                <th>LAST ACTIVE</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">
                        {user.nickname?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="username">{user.nickname}</div>
                        {user.verified && (
                          <span className="verified">Verified</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="muted">{user.email}</td>

                  <td>
                    <span className={`status ${user.status}`}>
                      {user.status}
                    </span>
                  </td>

                  <td>
                    {user.subscription === "premium" ? (
                      <span className="premium">👑 Premium</span>
                    ) : (
                      <span className="muted">Free</span>
                    )}
                  </td>

                  <td className="muted">{user.last_active}</td>

                  <td className="view-link">
                    <NavLink to="/userProfileDetails" state={{ user }}>
                      View Details
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">
            Showing {(page - 1) * USERS_PER_PAGE + 1}–
            {Math.min(page * USERS_PER_PAGE, totalUsers)} of {totalUsers} users
          </span>

          <div className="pagination-buttons">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="primary"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stats Card ---------- */
function StatCard({ label, value, trend }) {
  const isPositive = trend >= 0;

  return (
    <div className="stat-card">
      <span className={`stat-trend ${isPositive ? "green" : "red"}`}>
        {isPositive ? "+" : ""}
        {trend}%
      </span>

      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}
