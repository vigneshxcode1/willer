// import React, { useEffect, useState } from "react";
// import "./UserProfileDetails.css";
// import { FaHeart, FaUserFriends, FaStar } from "react-icons/fa";
// import { useLocation, useNavigate } from "react-router-dom";
// import defaultAvatar from "../../assets/Housing_Post Property.png";
// import ReportDetailModal from "./ReportDetailModal";

// import {
//     getLikesReceivedCount,
//     getMatchesCount,
//     getUserReportsCount,
//     getUserReportsList,
//     suspendUser,
//     sendWarningUser,
//     getResolvedReportsCount,
//     getThisWeekUsersCount,
//     getLastWeekUsersCount,
//     getThisWeekPremiumUsersCount,
//     getLastWeekPremiumUsersCount,
//     getThisWeekActiveUsersCount,
//     getLastWeekActiveUsersCount,
//     getThisWeekVerifiedUsersCount,
//     getLastWeekVerifiedUsersCount,
// } from "../../services/adminApi";

// export default function UserProfile() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const user = location.state?.user;

//     const [activeTab, setActiveTab] = useState("overview");
//     const [likesReceived, setLikesReceived] = useState(0);
//     const [matchesCount, setMatchesCount] = useState(0);
//     const [totalReports, setTotalReports] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [reportsList, setReportsList] = useState([]);
//     const [selectedReport, setSelectedReport] = useState(null);
//     const [warningLoading, setWarningLoading] = useState(false);
//     const [resolvedCount, setResolvedCount] = useState(0);
//     const [totalUsers, setTotalUsers] = useState(0);

//     const calculatePercentage = (current, previous) => {
//         if (previous === 0 && current > 0) return 100;
//         if (previous === 0 && current === 0) return 0;

//         return Number((((current - previous) / previous) * 100).toFixed(1));
//     };

//     const percent = calculatePercentage(7, 6);

//     const [totalUsersPercent, setTotalUsersPercent] = useState(0);
//     const [premiumUsersPercent, setPremiumUsersPercent] = useState(0);
//     const [activeTodayPercent, setActiveTodayPercent] = useState(0);
//     const [verifiedUsersPercent, setVerifiedUsersPercent] = useState(0);
//     useEffect(() => {
//         if (!user) return;

//         async function loadAllStats() {
//             setLoading(true);

//             try {
//                 const [
//                     likes,
//                     matches,
//                     reportsCount,
//                     reportsData,
//                     resolved,

//                     thisWeekUsers,
//                     lastWeekUsers,

//                     thisWeekPremium,
//                     lastWeekPremium,

//                     thisWeekActive,
//                     lastWeekActive,

//                     thisWeekVerified,
//                     lastWeekVerified,
//                 ] = await Promise.all([
//                     getLikesReceivedCount(user.email),
//                     getMatchesCount(user.email),
//                     getUserReportsCount(user.email),
//                     getUserReportsList(user.email),
//                     getResolvedReportsCount(user.email),

//                     getThisWeekUsersCount(),
//                     getLastWeekUsersCount(),

//                     getThisWeekPremiumUsersCount(),
//                     getLastWeekPremiumUsersCount(),

//                     getThisWeekActiveUsersCount(),
//                     getLastWeekActiveUsersCount(),

//                     getThisWeekVerifiedUsersCount(),
//                     getLastWeekVerifiedUsersCount(),
//                 ]);

//                 setLikesReceived(likes);
//                 setMatchesCount(matches);
//                 setTotalReports(reportsCount);
//                 setReportsList(reportsData);
//                 setResolvedCount(resolved);

//                 // set percentages
//                 setTotalUsersPercent(calculatePercentage(thisWeekUsers, lastWeekUsers));
//                 setPremiumUsersPercent(calculatePercentage(thisWeekPremium, lastWeekPremium));
//                 setActiveTodayPercent(calculatePercentage(thisWeekActive, lastWeekActive));
//                 setVerifiedUsersPercent(calculatePercentage(thisWeekVerified, lastWeekVerified));

//             } catch (error) {
//                 console.error("Error loading stats:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadAllStats();
//     }, [user]);


//     console.log(percent); // +16.7%

//     // Fetch real-time data - SINGLE useEffect
//     useEffect(() => {
//         if (!user) return;

//         async function loadUserStats() {
//             setLoading(true);
//             try {
//                 const [likes, matches, reportsCount, reportsData, resolved] =
//                     await Promise.all([
//                         getLikesReceivedCount(user.email),
//                         getMatchesCount(user.email),
//                         getUserReportsCount(user.email),
//                         getUserReportsList(user.email),
//                         getResolvedReportsCount(user.email),
//                     ]);

//                 setLikesReceived(likes);
//                 setMatchesCount(matches);
//                 setTotalReports(reportsCount);
//                 setReportsList(reportsData);
//                 setResolvedCount(resolved);
//             } catch (error) {
//                 console.error("Error loading user stats:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadUserStats();
//     }, [user]);

//     function formatTimeAgo(dateString) {
//         if (!dateString) return "Never";

//         const date = new Date(dateString);
//         const now = new Date();
//         const diffMs = now - date;

//         const minutes = Math.floor(diffMs / (1000 * 60));
//         const hours = Math.floor(diffMs / (1000 * 60 * 60));
//         const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//         if (minutes < 60) return `${minutes} minutes ago`;
//         if (hours < 24) return `${hours} hours ago`;
//         return `${days} days ago`;
//     }

//     function formatDate(dateString) {
//         if (!dateString) return "--";
//         return new Date(dateString).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         });
//     }

//     async function handleSuspend() {
//         const confirmSuspend = window.confirm(
//             "Are you sure you want to suspend this account for 7 days?"
//         );

//         if (!confirmSuspend) return;

//         const success = await suspendUser(user.email);

//         if (success) {
//             alert("User suspended for 7 days.");
//             window.location.reload();
//         } else {
//             alert("Failed to suspend user.");
//         }
//     }

//     async function handleSendWarning() {
//         const confirmWarning = window.confirm(
//             "Send warning to this user? Warning will stay TRUE for 5 seconds."
//         );

//         if (!confirmWarning) return;

//         setWarningLoading(true);

//         const success = await sendWarningUser(user.email);

//         if (success) {
//             alert("Warning sent successfully (5 seconds).");
//         } else {
//             alert("Failed to send warning.");
//         }

//         setWarningLoading(false);
//     }

//     function getUserStatus(user) {
//         if (user.is_suspended) return "SUSPENDED";

//         if (!user.last_seen) return "INACTIVE";

//         const lastSeenDate = new Date(user.last_seen);
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//         return lastSeenDate >= sevenDaysAgo ? "ACTIVE" : "INACTIVE";
//     }

//     // Helper function to determine priority
//     const getPriorityFromReason = (reason) => {
//         if (!reason) return { label: "Medium", className: "medium" };

//         const highPriority = [
//             "Harassment",
//             "Threats",
//             "Unsolicited Explicit Content",
//             "Offensive Language",
//         ];

//         const mediumPriority = [
//             "Catfishing",
//             "AI Generated",
//             "Fake Profile",
//             "Other",
//         ];

//         const lowPriority = ["Spam", "Violation of Terms"];

//         if (highPriority.includes(reason)) {
//             return { label: "High", className: "high" };
//         }

//         if (mediumPriority.includes(reason)) {
//             return { label: "Medium", className: "medium" };
//         }

//         if (lowPriority.includes(reason)) {
//             return { label: "Low", className: "low" };
//         }

//         return { label: "Medium", className: "medium" };
//     };

//     if (!user) {
//         return (
//             <div className="page">
//                 <div className="error-container">
//                     <h2>No User Data Found</h2>
//                     <button
//                         className="btn-primary"
//                         onClick={() => navigate("/users")}
//                     >
//                         Go Back to Users
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // Critical (High) Reports Count
//     const criticalReportsCount = reportsList.filter((report) => {
//         const priority = getPriorityFromReason(report.reason);
//         return priority.label === "High";
//     }).length;

//     const profileImage =
//         Array.isArray(user.photos) && user.photos.length > 0
//             ? user.photos[0]
//             : user.photos || defaultAvatar;


//     return (
//         <div className="page">
//             {/* Breadcrumb */}
//             <div className="breadcrumb">Users List &gt; {user.nickname}</div>

//             {/* Top Profile Card */}
//             <div className="profile-card">
//                 <div className="profile-left">
//                     <div className="avatar-wrapper">
//                         <img
//                             src={profileImage}
//                             alt="profile"
//                             className="avatar"
//                             onError={(e) => {
//                                 e.target.src = defaultAvatar;
//                             }}
//                         />
//                         <span className="online-dot"></span>
//                     </div>

//                     <div className="profile-info">
//                         <h2 className="name">{user.nickname || "Unknown User"}</h2>

//                         <div className="badges-row">
//                             <span
//                                 className={`status-badge ${getUserStatus(user).toLowerCase()}`}
//                             >
//                                 {getUserStatus(user)}
//                             </span>
//                             {user.subscription === "premium" && (
//                                 <span className="premium-badge">★ PREMIUM</span>
//                             )}
//                         </div>

//                         <p className="email">
//                             ✉ {user.email} <span className="divider">|</span>{" "}
//                             {user.verified ? "Verified Member" : "Not Verified"}
//                         </p>

//                         <p className="meta">
//                             Account created: {formatDate(user.created_at)} · Last
//                             active: {formatTimeAgo(user.last_seen)}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="profile-actions">
//                     <button
//                         className="btn light"
//                         onClick={handleSendWarning}
//                         disabled={warningLoading}
//                     >
//                         {warningLoading ? "Sending..." : "⚠ Send Warning"}
//                     </button>
//                     <button className="btn danger" onClick={handleSuspend}>
//                         ⛔ Suspend Account
//                     </button>
//                 </div>
//             </div>

//             {/* Tabs */}
//             <div className="tabs">
//                 <span
//                     className={activeTab === "overview" ? "active-tab" : ""}
//                     onClick={() => setActiveTab("overview")}
//                 >
//                     Overview
//                 </span>
//                 <span
//                     className={activeTab === "photos" ? "active-tab" : ""}
//                     onClick={() => setActiveTab("photos")}
//                 >
//                     Profile Photos
//                 </span>
//                 <span
//                     className={activeTab === "logs" ? "active-tab" : ""}
//                     onClick={() => setActiveTab("logs")}
//                 >
//                     Reports & Logs
//                 </span>
//             </div>

//             <div className="content">
//                 {/* LEFT SECTION */}
//                 <div className="left-section">
//                     {/* Personal Details Card */}
//                     {activeTab === "overview" && (
//                         <div className="personal-card">
//                             <div className="card-header">
//                                 <div className="title">Personal Details</div>
//                                 <div className="edit">
//                                     <span className="edit-icon">✏</span>
//                                     Edit Details
//                                 </div>
//                             </div>

//                             <div className="divider"></div>

//                             <div className="details-grid">
//                                 <div className="detail-item">
//                                     <div className="label">AGE & GENDER</div>
//                                     <div className="value">
//                                         {user.age ?? "--"}, {user.gender ?? "--"}
//                                     </div>
//                                 </div>

//                                 <div className="detail-item">
//                                     <div className="label">LOCATION</div>
//                                     <div className="value">{user.location ?? "--"}</div>
//                                 </div>

//                                 <div className="detail-item">
//                                     <div className="label">OCCUPATION</div>
//                                     <div className="value">{user.job ?? "--"}</div>
//                                 </div>

//                                 <div className="detail-item">
//                                     <div className="label">EDUCATION</div>
//                                     <div className="value">{user.education ?? "--"}</div>
//                                 </div>
//                             </div>

//                             <div className="bio-section">
//                                 <div className="label">BIO</div>
//                                 <div className="bio-box">
//                                     {user.about ?? "No bio available"}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Photo Moderation Tab */}
//                     {activeTab === "photos" && (
//                         <div className="photo-moderation-card">
//                             <div className="photo-header">
//                                 <h3>Photo Moderation</h3>
//                                 <span className="total-text">
//                                     Total{" "}
//                                     {Array.isArray(user.photos) ? user.photos.length : 0}{" "}
//                                     photos
//                                 </span>
//                             </div>

//                             <div className="photo-grid">
//                                 {Array.isArray(user.photos) &&
//                                     user.photos.map((photo, index) => (
//                                         <div
//                                             key={index}
//                                             className={`photo-box ${index === 0 ? "approved" : "pending"
//                                                 }`}
//                                         >
//                                             <img
//                                                 src={photo}
//                                                 alt={`User photo ${index + 1}`}
//                                                 onError={(e) => {
//                                                     e.target.src = defaultAvatar;
//                                                 }}
//                                             />
//                                             {index === 0 && (
//                                                 <span className="approved-badge">
//                                                     APPROVED
//                                                 </span>
//                                             )}
//                                         </div>
//                                     ))}

//                                 {/* Empty slots */}
//                                 {[
//                                     ...Array(
//                                         Math.max(0, 6 - (user.photos?.length || 0))
//                                     ),
//                                 ].map((_, i) => (
//                                     <div key={`empty-${i}`} className="photo-box empty">
//                                         <div className="empty-icon">📷</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Reports & Logs Tab */}
//                     {activeTab === "logs" && (
//                         <div className="reports-container">
//                             <div className="reports-header">
//                                 <div>
//                                     <h2>Reports & Logs</h2>
//                                     <p>
//                                         Reviewing {totalReports} incidents associated with
//                                         this account.
//                                     </p>
//                                 </div>
//                                 <div className="header-actions">
//                                     <button className="filter-btn">Filter</button>
//                                     <button className="export-btn">Export PDF</button>
//                                 </div>
//                             </div>

//                             {/* Stats Row */}
//                             <div className="report-stats">
//                                 <div className="stat-card">
//                                     <span className={`percent ${totalUsersPercent >= 0 ? "green" : "red"}`}>
//                                         {totalUsersPercent > 0 ? "+" : ""}
//                                         {totalUsersPercent}%
//                                     </span>
//                                     <h2>{totalUsers}</h2>
//                                     <p>Total Users</p>
//                                 </div>


//                                 <div className="stat-card pending">
//                                     <h4>Pending Review</h4>
//                                     <h2>{totalReports}</h2>
//                                 </div>

//                                 <div className="stat-card resolved">
//                                     <h4>Resolved</h4>
//                                     <h2>{loading ? "..." : resolvedCount}</h2>
//                                 </div>

//                                 <div className="stat-card critical">
//                                     <h4>Critical Reports</h4>
//                                     <h2>{loading ? "..." : criticalReportsCount}</h2>
//                                 </div>
//                             </div>

//                             <div className="reports-table">
//                                 <div className="table-header">
//                                     <span>Report ID</span>
//                                     <span>Reported By</span>
//                                     <span>Reason</span>
//                                     <span>Message</span>
//                                     <span>Date</span>
//                                     <span>Status</span>
//                                     <span>Priority</span>
//                                     <span>Action</span>
//                                 </div>

//                                 {loading ? (
//                                     <div className="table-row">
//                                         <span colSpan="8">Loading reports...</span>
//                                     </div>
//                                 ) : reportsList.length === 0 ? (
//                                     <div className="table-row">
//                                         <span colSpan="8">No reports found</span>
//                                     </div>
//                                 ) : (
//                                     reportsList.map((report, index) => {
//                                         const priority =
//                                             getPriorityFromReason(report.reason);

//                                         return (
//                                             <div className="table-row" key={report.id}>
//                                                 <span>#REP-{index + 1}</span>
//                                                 <span>
//                                                     {report.reporter_phone || "Unknown"}
//                                                 </span>
//                                                 <span className="badge red">
//                                                     {report.reason || "N/A"}
//                                                 </span>
//                                                 <span>
//                                                     {report.message ?? "No Message"}
//                                                 </span>
//                                                 <span>
//                                                     {report.created_at
//                                                         ? new Date(
//                                                             report.created_at
//                                                         ).toLocaleDateString()
//                                                         : "--"}
//                                                 </span>
//                                                 <span className="status pending-dot">
//                                                     Pending
//                                                 </span>

//                                                 {/* Priority Badge */}
//                                                 <span
//                                                     className={`badge ${priority.className}`}
//                                                 >
//                                                     {priority.label}
//                                                 </span>

//                                                 <span
//                                                     className="eye"
//                                                     onClick={() =>
//                                                         setSelectedReport(report)
//                                                     }
//                                                     style={{ cursor: "pointer" }}
//                                                 >
//                                                     👁
//                                                 </span>
//                                             </div>
//                                         );
//                                     })
//                                 )}
//                             </div>

//                             {/* Pagination */}
//                             <div className="pagination">
//                                 <button className="page active">1</button>
//                                 <button className="page">2</button>
//                                 <button className="page">3</button>
//                             </div>

//                             {/* Footer */}
//                             <div className="reports-footer">
//                                 <span>Moderated by 3 team members today.</span>
//                                 <div className="trust-score">
//                                     Account Trust Score: <strong>94/100</strong>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* RIGHT SECTION */}
//                 <div className="right-section">
//                     <div className="card">
//                         <h4>ENGAGEMENT OVERVIEW</h4>

//                         <div className="stat">
//                             <FaHeart className="icon pink" />
//                             <div>
//                                 <h3>{loading ? "..." : likesReceived}</h3>
//                                 <p>Likes Received</p>
//                             </div>
//                         </div>

//                         <div className="stat">
//                             <FaUserFriends className="icon blue" />
//                             <div>
//                                 <h3>{loading ? "..." : matchesCount}</h3>
//                                 <p>Matches</p>
//                             </div>
//                         </div>

//                         <div className="stat">
//                             <FaStar className="icon gold" />
//                             <div>
//                                 <h3>{user.subscription || "Free"}</h3>
//                                 <p>Subscription Tier</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="trust-card">
//                         <h4>VERIFICATION</h4>
//                         <h2>{user.verified ? "✓ Verified" : "✗ Not Verified"}</h2>
//                         <p>User verification status from Supabase.</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Report Detail Modal */}
//             {selectedReport && (
//                 <ReportDetailModal
//                     report={selectedReport}
//                     onClose={() => setSelectedReport(null)}
//                 />
//             )}
//         </div>
//     );
// }


import React, { useEffect, useState } from "react";
import "./UserProfileDetails.css";
import { FaHeart, FaUserFriends, FaStar } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/Housing_Post Property.png";
import ReportDetailModal from "./ReportDetailModal";

import {
    getLikesReceivedCount,
    getMatchesCount,
    getUserReportsCount,
    getUserReportsList,
    suspendUser,
    sendWarningUser,
    getResolvedReportsCount,
    getThisWeekUsersCount,
    getLastWeekUsersCount,
    getThisWeekPremiumUsersCount,
    getLastWeekPremiumUsersCount,
    getThisWeekActiveUsersCount,
    getLastWeekActiveUsersCount,
    getThisWeekVerifiedUsersCount,
    getLastWeekVerifiedUsersCount,
} from "../../services/adminApi";

export default function UserProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;

    const [activeTab, setActiveTab] = useState("overview");
    const [likesReceived, setLikesReceived] = useState(0);
    const [matchesCount, setMatchesCount] = useState(0);
    const [totalReports, setTotalReports] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reportsList, setReportsList] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [warningLoading, setWarningLoading] = useState(false);
    const [resolvedCount, setResolvedCount] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    const calculatePercentage = (current, previous) => {
        if (previous === 0 && current > 0) return 100;
        if (previous === 0 && current === 0) return 0;
        return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    const [totalUsersPercent, setTotalUsersPercent] = useState(0);
    const [premiumUsersPercent, setPremiumUsersPercent] = useState(0);
    const [activeTodayPercent, setActiveTodayPercent] = useState(0);
    const [verifiedUsersPercent, setVerifiedUsersPercent] = useState(0);

    useEffect(() => {
        if (!user) return;

        async function loadAllStats() {
            setLoading(true);

            try {
                const [
                    likes,
                    matches,
                    reportsCount,
                    reportsData,
                    resolved,
                    thisWeekUsers,
                    lastWeekUsers,
                    thisWeekPremium,
                    lastWeekPremium,
                    thisWeekActive,
                    lastWeekActive,
                    thisWeekVerified,
                    lastWeekVerified,
                ] = await Promise.all([
                    getLikesReceivedCount(user.email),
                    getMatchesCount(user.email),
                    getUserReportsCount(user.email),
                    getUserReportsList(user.email),
                    getResolvedReportsCount(user.email),
                    getThisWeekUsersCount(),
                    getLastWeekUsersCount(),
                    getThisWeekPremiumUsersCount(),
                    getLastWeekPremiumUsersCount(),
                    getThisWeekActiveUsersCount(),
                    getLastWeekActiveUsersCount(),
                    getThisWeekVerifiedUsersCount(),
                    getLastWeekVerifiedUsersCount(),
                ]);

                setLikesReceived(likes);
                setMatchesCount(matches);
                setTotalReports(reportsCount);
                setReportsList(reportsData);
                setResolvedCount(resolved);

                setTotalUsersPercent(calculatePercentage(thisWeekUsers, lastWeekUsers));
                setPremiumUsersPercent(calculatePercentage(thisWeekPremium, lastWeekPremium));
                setActiveTodayPercent(calculatePercentage(thisWeekActive, lastWeekActive));
                setVerifiedUsersPercent(calculatePercentage(thisWeekVerified, lastWeekVerified));
            } catch (error) {
                console.error("Error loading stats:", error);
            } finally {
                setLoading(false);
            }
        }

        loadAllStats();
    }, [user]);

    function formatTimeAgo(dateString) {
        if (!dateString) return "Never";

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;

        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        return `${days} days ago`;
    }

    function formatDate(dateString) {
        if (!dateString) return "--";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    async function handleSuspend() {
        const confirmSuspend = window.confirm(
            "Are you sure you want to suspend this account for 7 days?"
        );

        if (!confirmSuspend) return;

        const success = await suspendUser(user.email);

        if (success) {
            alert("User suspended for 7 days.");
            window.location.reload();
        } else {
            alert("Failed to suspend user.");
        }
    }

    async function handleSendWarning() {
        const confirmWarning = window.confirm(
            "Send warning to this user? Warning will stay TRUE for 5 seconds."
        );

        if (!confirmWarning) return;

        setWarningLoading(true);

        const success = await sendWarningUser(user.email);

        if (success) {
            alert("Warning sent successfully (5 seconds).");
        } else {
            alert("Failed to send warning.");
        }

        setWarningLoading(false);
    }

    function getUserStatus(user) {
        if (user.is_suspended) return "SUSPENDED";
        if (!user.last_seen) return "INACTIVE";

        const lastSeenDate = new Date(user.last_seen);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return lastSeenDate >= sevenDaysAgo ? "ACTIVE" : "INACTIVE";
    }

    const getPriorityFromReason = (reason) => {
        if (!reason) return { label: "Medium", className: "medium" };

        const highPriority = [
            "Harassment",
            "Threats",
            "Unsolicited Explicit Content",
            "Offensive Language",
        ];

        const mediumPriority = [
            "Catfishing",
            "AI Generated",
            "Fake Profile",
            "Other",
        ];

        const lowPriority = ["Spam", "Violation of Terms"];

        if (highPriority.includes(reason)) {
            return { label: "High", className: "high" };
        }

        if (mediumPriority.includes(reason)) {
            return { label: "Medium", className: "medium" };
        }

        if (lowPriority.includes(reason)) {
            return { label: "Low", className: "low" };
        }

        return { label: "Medium", className: "medium" };
    };

    if (!user) {
        return (
            <div className="page">
                <div className="error-container">
                    <h2>No User Data Found</h2>
                    <button className="btn-primary" onClick={() => navigate("/users")}>
                        Go Back to Users
                    </button>
                </div>
            </div>
        );
    }

    const criticalReportsCount = reportsList.filter((report) => {
        const priority = getPriorityFromReason(report.reason);
        return priority.label === "High";
    }).length;

    const profileImage =
        Array.isArray(user.photos) && user.photos.length > 0
            ? user.photos[0]
            : user.photos || defaultAvatar;

    return (
        <div className="user-profile-page">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                Users List <span className="arrow">&gt;</span> {user.nickname}
            </div>

            {/* Profile Header Card */}
            <div className="profile-header-card">
                <div className="profile-header-left">
                    <div className="avatar-container">
                        <img
                            src={profileImage}
                            alt="profile"
                            className="profile-avatar"
                            onError={(e) => {
                                e.target.src = defaultAvatar;
                            }}
                        />
                        <span className="online-indicator"></span>
                    </div>

                    <div className="profile-user-info">
                        <h1 className="user-name">{user.nickname || "Unknown User"}</h1>

                        <div className="user-badges">
                            <span className={`status-badge ${getUserStatus(user).toLowerCase()}`}>
                                {getUserStatus(user)}
                            </span>
                            {user.subscription === "premium" && (
                                <span className="premium-badge">
                                    <span className="star">★</span> PREMIUM
                                </span>
                            )}
                        </div>

                        <div className="user-email-row">
                            <span className="email-icon">✉</span>
                            <span className="user-email">{user.email}</span>
                            <span className="separator">|</span>
                            <span className="verification-badge">
                                <span className="check-icon">✓</span> Verified Member
                            </span>
                        </div>

                        <div className="user-meta-info">
                            Account created: {formatDate(user.created_at)} · Last active:{" "}
                            {formatTimeAgo(user.last_seen)}
                        </div>
                    </div>
                </div>

                <div className="profile-header-actions">
                    <button
                        className="action-btn warning-btn"
                        onClick={handleSendWarning}
                        disabled={warningLoading}
                    >
                        <span className="btn-icon">⚠</span>
                        {warningLoading ? "Sending..." : "Send Warning"}
                    </button>
                    <button className="action-btn reverify-btn">
                        <span className="btn-icon">🔄</span>
                        Re-verify
                    </button>
                    <button className="action-btn suspend-btn" onClick={handleSuspend}>
                        <span className="btn-icon">⛔</span>
                        Suspend Account
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="profile-tabs">
                <button
                    className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                >
                    <span className="tab-icon">👤</span>
                    Overview
                </button>
                <button
                    className={`tab-button ${activeTab === "photos" ? "active" : ""}`}
                    onClick={() => setActiveTab("photos")}
                >
                    <span className="tab-icon">🖼</span>
                    Profile Photos
                    <span className="tab-count">6</span>
                </button>
                <button
                    className={`tab-button ${activeTab === "logs" ? "active" : ""}`}
                    onClick={() => setActiveTab("logs")}
                >
                    <span className="tab-icon">📋</span>
                    Reports & Logs
                    <span className="tab-count">1</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="profile-content-wrapper">
                {/* Left Section */}
                <div className="profile-left-section">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="personal-details-card">
                            <div className="card-top-header">
                                <h3 className="card-title">Personal Details</h3>
                                <button className="edit-details-btn">
                                    <span className="edit-icon">✏</span>
                                    Edit Details
                                </button>
                            </div>

                            <div className="card-divider"></div>

                            <div className="details-info-grid">
                                <div className="info-item">
                                    <div className="info-label">AGE & GENDER</div>
                                    <div className="info-value">
                                        {user.age ?? "--"}, {user.gender ?? "--"}
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-label">LOCATION</div>
                                    <div className="info-value">{user.location ?? "--"}</div>
                                </div>

                                <div className="info-item">
                                    <div className="info-label">OCCUPATION</div>
                                    <div className="info-value">{user.job ?? "--"}</div>
                                </div>

                                <div className="info-item">
                                    <div className="info-label">EDUCATION</div>
                                    <div className="info-value">{user.education ?? "--"}</div>
                                </div>
                            </div>

                            <div className="bio-container">
                                <div className="info-label">BIO</div>
                                <div className="bio-content">
                                    {user.about ?? "No bio available"}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Photos Tab */}
                    {activeTab === "photos" && (
                        <div className="photo-moderation-container">
                            <div className="photo-moderation-header">
                                <h3 className="photo-mod-title">Photo Moderation</h3>
                                <span className="photo-count-text">
                                    Total {Array.isArray(user.photos) ? user.photos.length : 0}{" "}
                                    photos
                                </span>
                            </div>

                            <div className="photos-grid">
                                {Array.isArray(user.photos) &&
                                    user.photos.map((photo, index) => (
                                        <div
                                            key={index}
                                            className={`photo-item ${
                                                index === 0 ? "approved-photo" : "pending-photo"
                                            }`}
                                        >
                                            <img
                                                src={photo}
                                                alt={`Photo ${index + 1}`}
                                                className="photo-img"
                                                onError={(e) => {
                                                    e.target.src = defaultAvatar;
                                                }}
                                            />
                                            {index === 0 && (
                                                <span className="approval-badge">APPROVED</span>
                                            )}
                                        </div>
                                    ))}

                                {[...Array(Math.max(0, 6 - (user.photos?.length || 0)))].map(
                                    (_, i) => (
                                        <div key={`empty-${i}`} className="photo-item empty-slot">
                                            <div className="empty-photo-icon">📷</div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reports & Logs Tab */}
                    {activeTab === "logs" && (
                        <div className="reports-logs-container">
                            <div className="reports-logs-header">
                                <div>
                                    <h2 className="reports-title">Reports & Logs</h2>
                                    <p className="reports-subtitle">
                                        Reviewing {totalReports} incidents associated with this
                                        account.
                                    </p>
                                </div>
                                <div className="reports-actions">
                                    <button className="reports-filter-btn">Filter</button>
                                    <button className="reports-export-btn">Export PDF</button>
                                </div>
                            </div>

                            {/* Reports Statistics */}
                            <div className="reports-statistics">
                                <div className="stat-box">
                                    <span
                                        className={`stat-percent ${
                                            totalUsersPercent >= 0 ? "positive" : "negative"
                                        }`}
                                    >
                                        {totalUsersPercent > 0 ? "+" : ""}
                                        {totalUsersPercent}%
                                    </span>
                                    <h2 className="stat-number">{totalUsers}</h2>
                                    <p className="stat-label">Total Users</p>
                                </div>

                                <div className="stat-box pending">
                                    <h4 className="stat-heading">Pending Review</h4>
                                    <h2 className="stat-number">{totalReports}</h2>
                                </div>

                                <div className="stat-box resolved">
                                    <h4 className="stat-heading">Resolved</h4>
                                    <h2 className="stat-number">
                                        {loading ? "..." : resolvedCount}
                                    </h2>
                                </div>

                                <div className="stat-box critical">
                                    <h4 className="stat-heading">Critical Reports</h4>
                                    <h2 className="stat-number">
                                        {loading ? "..." : criticalReportsCount}
                                    </h2>
                                </div>
                            </div>

                            {/* Reports Table */}
                            <div className="reports-data-table">
                                <div className="table-header-row">
                                    <span>Report ID</span>
                                    <span>Reported By</span>
                                    <span>Reason</span>
                                    <span>Message</span>
                                    <span>Date</span>
                                    <span>Status</span>
                                    <span>Priority</span>
                                    <span>Action</span>
                                </div>

                                {loading ? (
                                    <div className="table-data-row">
                                        <span colSpan="8">Loading reports...</span>
                                    </div>
                                ) : reportsList.length === 0 ? (
                                    <div className="table-data-row">
                                        <span colSpan="8">No reports found</span>
                                    </div>
                                ) : (
                                    reportsList.map((report, index) => {
                                        const priority = getPriorityFromReason(report.reason);

                                        return (
                                            <div className="table-data-row" key={report.id}>
                                                <span>#REP-{index + 1}</span>
                                                <span>{report.reporter_phone || "Unknown"}</span>
                                                <span className="reason-badge">
                                                    {report.reason || "N/A"}
                                                </span>
                                                <span>{report.message ?? "No Message"}</span>
                                                <span>
                                                    {report.created_at
                                                        ? new Date(
                                                              report.created_at
                                                          ).toLocaleDateString()
                                                        : "--"}
                                                </span>
                                                <span className="status-indicator pending">
                                                    Pending
                                                </span>
                                                <span className={`priority-badge ${priority.className}`}>
                                                    {priority.label}
                                                </span>
                                                <span
                                                    className="action-eye"
                                                    onClick={() => setSelectedReport(report)}
                                                >
                                                    👁
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="table-pagination">
                                <button className="pagination-btn active-page">1</button>
                                <button className="pagination-btn">2</button>
                                <button className="pagination-btn">3</button>
                            </div>

                            {/* Reports Footer */}
                            <div className="reports-bottom-footer">
                                <span>Moderated by 3 team members today.</span>
                                <div className="trust-score-info">
                                    Account Trust Score: <strong>94/100</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Section */}
                <div className="profile-right-section">
                    {/* Engagement Overview Card */}
                    <div className="engagement-card">
                        <h4 className="engagement-heading">ENGAGEMENT OVERVIEW</h4>

                        <div className="engagement-stat">
                            <div className="stat-icon-wrapper pink">
                                <FaHeart className="stat-icon" />
                            </div>
                            <div className="stat-info">
                                <h3 className="stat-value">{loading ? "..." : likesReceived}</h3>
                                <p className="stat-name">Likes Received</p>
                                <span className="stat-change positive">+12%</span>
                            </div>
                        </div>

                        <div className="engagement-stat">
                            <div className="stat-icon-wrapper blue">
                                <FaUserFriends className="stat-icon" />
                            </div>
                            <div className="stat-info">
                                <h3 className="stat-value">{loading ? "..." : matchesCount}</h3>
                                <p className="stat-name">Matches</p>
                                <span className="stat-change positive">+5%</span>
                            </div>
                        </div>

                        <div className="engagement-stat">
                            <div className="stat-icon-wrapper gold">
                                <FaStar className="stat-icon" />
                            </div>
                            <div className="stat-info">
                                <h3 className="stat-value">{user.subscription || "Gold"}</h3>
                                <p className="stat-name">Subscription Tier</p>
                                <span className="expiry-date">Ends 12/24</span>
                            </div>
                        </div>
                    </div>

                    {/* Discovery Preferences Card */}
                    <div className="discovery-card">
                        <h4 className="discovery-heading">DISCOVERY PREFERENCES</h4>

                        <div className="preference-section">
                            <p className="preference-label">Interested in</p>
                            <div className="preference-pills">
                                <span className="pill">Men</span>
                                <span className="pill">Age 25-35</span>
                            </div>
                        </div>

                        <div className="preference-section">
                            <p className="preference-label">Distance Range</p>
                            <div className="distance-slider-container">
                                <div className="distance-slider">
                                    <div className="slider-fill" style={{ width: "60%" }}></div>
                                </div>
                                <span className="distance-value">30 mi</span>
                            </div>
                        </div>

                        <div className="preference-section">
                            <p className="preference-label">Hobbies</p>
                            <div className="hobbies-grid">
                                <span className="hobby-tag">HIKING</span>
                                <span className="hobby-tag">PHOTOGRAPHY</span>
                                <span className="hobby-tag">COOKING</span>
                                <span className="hobby-tag">TRAVEL</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Score Card */}
                    <div className="trust-score-card">
                        <h4 className="trust-score-heading">TRUST SCORE</h4>
                        <div className="trust-score-display">
                            <h1 className="trust-score-number">94</h1>
                            <span className="trust-score-max">/100</span>
                        </div>
                        <p className="trust-score-description">
                            User has linked 4 social accounts and has a high response rate.
                        </p>
                    </div>
                </div>
            </div>

            {/* Report Detail Modal */}
            {selectedReport && (
                <ReportDetailModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
}