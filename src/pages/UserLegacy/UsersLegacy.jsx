import { useEffect, useState } from "react";
import "./UsersLegacy.css";
import {
  
    getTotalUsers,
    getTotalSubscription,
    getVerifiedUsers,
} from "../../services/adminApi";
import { supabase } from "../../supabaseClient";
import { BsEye } from "react-icons/bs";
import { BiBlock } from "react-icons/bi";

export default function UsersLegacy() {







    const USERS_PER_PAGE = 10;

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalsubscription, setTotalSubscription] = useState(0);
    const [verifiedUsers, setVerifiedUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

    useEffect(() => {
        async function loadData() {
            setLoading(true);

            const [
                usersData,
                usersCount,
                subscriptions,
                verified,
            ] = await Promise.all([
                getUsersLegacy(page, USERS_PER_PAGE), // 🔥 paginated DB query
                getTotalUsers(),
                getTotalSubscription(),
                getVerifiedUsers(),
            ]);

            setUsers(usersData);
            setTotalUsers(usersCount);
            setTotalSubscription(subscriptions);
            setVerifiedUsers(verified);

            setLoading(false);
        }

        loadData();
    }, [page]);




    async function getUsersLegacy(page = 1, limit = 10) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error } = await supabase
            .from("users")
            .select(`
          id,
          nickname,
          age,
       location,
          
          last_seen,
          is_verified
        `)
            .order("last_seen", { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Error fetching users:", error);
            return [];
        }

        // ✅ Hardcoded subscription
        return data.map((user) => ({
            id: user.id,
            nickname: user.nickname,
            age: user.age,
            location:user.location,
            status: "active",
            subscription: "free", // 👈 hardcoded
            last_active: user.last_seen
                ? new Date(user.last_seen).toLocaleDateString()
                : "—",
            verified: user.is_verified,
        }));
    }
    return (
        <div className="users-page">
            {/* Header */}
            <h1 className="page-title">Users Management</h1>
            <p className="page-subtitle">
                view and manage all the users on the platform
            </p>
            <input
                type="text"
                placeholder="Search by name,phone,or location..."
            />
            {/* Stats */}
            <div className="stats-grid">
                <StatCard label="Total Users" value={totalUsers.toLocaleString()} trend="+12.5%" />
                <StatCard label="Premium Users" value={totalsubscription.toLocaleString()} trend="+8.2%" />
                <StatCard label="Active Today" value="23,456" trend="+15.3%" />
                <StatCard
                    label="Verified Users"
                    value={(verifiedUsers ?? 0).toLocaleString()}
                    trend="+5.7%"
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
                                <th>USER</th>
                                <th>AGE</th>
                                <th>LOCATION</th>
                                <th>STATUS</th>
                                <th>VERIFIED</th>

                                <th>LAST ACTIVE</th>
                                <th>ACTIONS</th>
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

                                    <td className="muted">{user.age}</td>
     <td className="muted">{user.location}</td>
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

                                    <td className="view-link"><BsEye/><BiBlock/></td>
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
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
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
    return (
        <div className="stat-card">
            <span className="stat-trend">{trend}</span>
            <h3>{value}</h3>
            <p>{label}</p>
        </div>
    );
}
