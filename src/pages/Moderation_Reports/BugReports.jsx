import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const BugReports = () => {
    const [bugs, setBugs] = useState([]);
    const [selectedBug, setSelectedBug] = useState(null);
    const [loadingBugs, setLoadingBugs] = useState(false);

    const [bugStats, setBugStats] = useState({
        total: 0,
        critical: 0,
        inProgress: 0,
        resolvedThisWeek: 0,
        percentage: 0
    });

    // Map reason -> priority (frontend only)
    const PRIORITY_MAP = {
        "App Crash": "critical",
        "Login Problem": "critical",
        "Payment Issue": "critical",
        "UI Bug": "high",
        "Video Call Issue": "high",
        "Slow Performance": "low",
        "Notification Problem": "low",
        "Other": "low"
    };

    const CRITICAL_REASONS = [
        "App Crash",
        "Login Problem",
        "Payment Issue"
    ];

    useEffect(() => {
        fetchBugs();
        fetchBugStats();
    }, []);

    // ---------------- FETCH BUG LIST ----------------
    async function fetchBugs() {
        setLoadingBugs(true);

        const { data, error } = await supabase
            .from("bug_reports")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            const mapped = data.map((bug) => ({
                ...bug,
                priority: PRIORITY_MAP[bug.reason] || "low"
            }));

            setBugs(mapped);

            if (mapped.length > 0) {
                setSelectedBug(mapped[0]);
            }
        }

        setLoadingBugs(false);
    }

    // ---------------- FETCH STATS ----------------
    async function fetchBugStats() {
        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        const [
            totalRes,
            criticalRes,
            inProgressRes,
            resolvedThisWeekRes,
            resolvedLastWeekRes
        ] = await Promise.all([
            supabase
                .from("bug_reports")
                .select("*", { count: "exact", head: true }),

            supabase
                .from("bug_reports")
                .select("*", { count: "exact", head: true })
                .in("reason", CRITICAL_REASONS),

            supabase
                .from("bug_reports")
                .select("*", { count: "exact", head: true })
                .eq("status", "in_progress"),

            supabase
                .from("bug_reports")
                .select("*", { count: "exact", head: true })
                .eq("status", "resolved")
                .gte("resolved_at", startOfWeek.toISOString()),

            supabase
                .from("bug_reports")
                .select("*", { count: "exact", head: true })
                .eq("status", "resolved")
                .gte("resolved_at", startOfLastWeek.toISOString())
                .lt("resolved_at", startOfWeek.toISOString())
        ]);

        const resolvedThisWeek = resolvedThisWeekRes.count || 0;
        const resolvedLastWeek = resolvedLastWeekRes.count || 0;

        const percentage =
            resolvedLastWeek === 0
                ? resolvedThisWeek > 0 ? 100 : 0
                : ((resolvedThisWeek - resolvedLastWeek) /
                    resolvedLastWeek) *
                100;

        setBugStats({
            total: totalRes.count || 0,
            critical: criticalRes.count || 0,
            inProgress: inProgressRes.count || 0,
            resolvedThisWeek,
            percentage: percentage.toFixed(1)
        });
    }


    // ---------------- MARK AS RESOLVED ----------------
    async function markAsResolved() {
        if (!selectedBug) return;

        const confirmResolve = window.confirm(
            "Are you sure you want to mark this bug as resolved?"
        );

        if (!confirmResolve) return;

        const { error } = await supabase
            .from("bug_reports")
            .update({
                status: "resolved",
                resolved_at: new Date().toISOString()
            })
            .eq("id", selectedBug.id);

        if (!error) {
            fetchBugs();
            fetchBugStats();
        }
    }


    async function assignToDevTeam() {
        if (!selectedBug) return;

        const { error } = await supabase
            .from("bug_reports")
            .update({ status: "in_progress" })
            .eq("id", selectedBug.id);

        if (!error) {
            // Update selected bug locally (instant UI update)
            setSelectedBug({
                ...selectedBug,
                status: "in_progress"
            });

            // Refresh list + stats
            fetchBugs();
            fetchBugStats();
        }
    }

    // ---------------- UI ----------------
    return (
        <>
            <div className="section-header">
                <h2>Bug Reports</h2>
                <p>Track and manage bug reports from users</p>
            </div>

            {/* STATS */}
            <div className="stats-row">
                <div className="stat-box">
                    <h3>{bugStats.total}</h3>
                    <p>Total Bugs</p>
                </div>

                <div className="stat-box">
                    <h3>{bugStats.critical}</h3>
                    <p>Critical Issues</p>
                </div>

                <div className="stat-box">
                    <h3>{bugStats.inProgress}</h3>
                    <p>In Progress</p>
                </div>

                <div className="stat-box">
                    <h3>{bugStats.resolvedThisWeek}</h3>
                    <p>
                        Resolved This Week
                        <span style={{ marginLeft: 8, color: "green" }}>
                            {bugStats.percentage}% vs last week
                        </span>
                    </p>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="bug-layout">
                {/* LEFT PANEL */}
                <div className="bug-list">
                    {["critical", "high", "low"].map((priority) => (
                        <div key={priority}>
                            <h3 className="priority-heading">
                                {priority === "critical"
                                    ? "Critical Issues"
                                    : priority === "high"
                                        ? "High Priority"
                                        : "Low Priority"}
                            </h3>

                            {bugs
                                .filter((b) => b.priority === priority)
                                .map((bug) => (
                                    <div
                                        key={bug.id}
                                        className={`bug-item ${selectedBug?.id === bug.id ? "active" : ""
                                            }`}
                                        onClick={() => setSelectedBug(bug)}
                                    >
                                        <div className="bug-item-header">
                                            <span className={`badge ${bug.priority}`}>
                                                {bug.priority.toUpperCase()}
                                            </span>
                                            <span className={`status ${bug.status}`}>
                                                {bug.status?.replace("_", " ").toUpperCase()}
                                            </span>
                                        </div>

                                        <h4>{bug.reason}</h4>
                                        <p>{bug.title}</p>

                                        <div className="bug-meta">
                                            {/* <span>{bug.device || "Unknown Device"}</span> */}
                                            <span>
                                                {new Date(bug.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                {/* RIGHT PANEL */}
                <div className="bug-details">
                    {selectedBug ? (
                        <>
                            <div className="details-header">
                                <h2>{selectedBug.reason}</h2>
                                <span className={`status ${selectedBug.status}`}>
                                    {selectedBug.status
                                        ?.replace("_", " ")
                                        .toUpperCase()}
                                </span>
                            </div>

                            <div className="details-section">
                                <h4>Reported By</h4>
                                <p>{selectedBug.user_phone || "Unknown"}</p>
                            </div>

                            <div className="details-section">
                                <h4>Reported On</h4>
                                <p>
                                    {new Date(selectedBug.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div className="details-section">
                                <h4>Description</h4>
                                <p>
                                    {selectedBug.message || "No description provided."}
                                </p>
                            </div>




                            <div className="details-actions">
                                <button
                                    className="btn blue"
                                    onClick={assignToDevTeam}
                                    disabled={selectedBug.status === "in_progress"}
                                >
                                    {selectedBug.status === "in_progress"
                                        ? "Assigned to Dev Team"
                                        : "Assign to Dev Team"}
                                </button>

                                <button
                                    className="btn green"
                                    onClick={markAsResolved}
                                >
                                    Mark as Resolved
                                </button>

                            </div>

                        </>
                    ) : (
                        <p>Select a bug to view details</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default BugReports;