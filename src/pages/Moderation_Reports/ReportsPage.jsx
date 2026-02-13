import React, { useEffect, useState } from "react";
import "./ReportsPage.css";
import { supabase } from "../../supabaseClient";
import { getAllReports } from "../../services/adminApi";
import { useNavigate, useLocation } from "react-router-dom";

// Import child components
import ChatReports from "./ChatReports";
import BugReports from "./BugReports";
import ManagementReports from "./ManagementReports";

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("bug");
    const navigate = useNavigate();
    const location = useLocation();

    const isModeration = location.pathname === "/moderation";
    const isReports = location.pathname === "/reports";

    useEffect(() => {
        fetchReports();

        const channel = supabase
            .channel("realtime-user_reports")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "user_reports" },
                () => fetchReports()
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        const data = await getAllReports();
        setReports(data || []);
        setLoading(false);
    };

    return (
        <div className="reports-container">
            {/* Primary Tabs */}
            <div className="tabs-bar">
                <button
                    className={`tab-btn ${isModeration ? "active" : ""}`}
                    onClick={() => navigate("/ModeratioReports")}
                >
                    Moderation
                </button>
                <button
                    className={`tab-btn ${isReports ? "active" : ""}`}
                    onClick={() => navigate("/reports")}
                >
                    Reports
                </button>
            </div>

            {/* Secondary Tabs */}
            <div className="sub-tabs">
                <button
                    className={activeTab === "chat" ? "sub-tab active" : "sub-tab"}
                    onClick={() => setActiveTab("chat")}
                >
                    Chat Reports
                </button>
                <button
                    className={activeTab === "bug" ? "sub-tab active" : "sub-tab"}
                    onClick={() => setActiveTab("bug")}
                >
                    Bug Reports
                </button>
                {/* <button
          className={activeTab === "management" ? "sub-tab active" : "sub-tab"}
          onClick={() => setActiveTab("management")}
        >
          Reports Management
        </button> */}
            </div>

            {/* Main Content */}
            <div className="reports-content">
                {activeTab === "chat" && <ChatReports />}
                {activeTab === "bug" && <BugReports />}
                {activeTab === "management" && <ManagementReports />}
            </div>
        </div>
    );
};

export default ReportsPage;