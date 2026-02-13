import React, { useEffect, useState, useMemo } from "react";
import "./Moderation_Reports.css";
import {
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Flag,
} from "lucide-react";

import { supabase } from "../../supabaseClient";
import { getAllReports } from "../../services/adminApi";
import { useNavigate, useLocation } from "react-router-dom";

/* ================= PRIORITY CONFIG ================= */

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

const normalizedHigh = highPriority.map((r) => r.toLowerCase());
const normalizedMedium = mediumPriority.map((r) => r.toLowerCase());

/* ================= COMPONENT ================= */

const ModerationReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const isModeration = location.pathname === "/ModeratioReports";
  const isReports = location.pathname === "/reports";

  /* ================= FETCH ================= */

  const fetchReports = async () => {
    setLoading(true);
    const data = await getAllReports();
    setReports(data || []);
    setLoading(false);
  };

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ================= GROUP BY USER ================= */

  const reportsByUser = useMemo(() => {
    return reports.reduce((acc, report) => {
      const userKey = report.reported_phone?.trim();

      if (!acc[userKey]) {
        acc[userKey] = [];
      }

      acc[userKey].push(report);
      return acc;
    }, {});
  }, [reports]);

  const openCases = Object.keys(reportsByUser).length;

  /* ================= PRIORITY ================= */

  const getPriority = (reason) => {
    const r = reason?.trim().toLowerCase();
    if (!r) return "LOW PRIORITY";

    if (normalizedHigh.includes(r)) return "HIGH PRIORITY";
    if (normalizedMedium.includes(r)) return "MEDIUM PRIORITY";

    return "LOW PRIORITY";
  };

  const getPriorityClass = (reason) => {
    const priority = getPriority(reason);
    if (priority === "HIGH PRIORITY") return "high";
    if (priority === "MEDIUM PRIORITY") return "medium";
    return "low";
  };

  const highPriorityCount = reports.filter(
    (r) => getPriority(r.reason) === "HIGH PRIORITY"
  ).length;

  /* ================= DISMISS (FIXED) ================= */

  const handleDismiss = async (reportIds) => {
    console.log("Trying to delete IDs:", reportIds);

    if (!window.confirm("Are you sure you want to dismiss all reports for this user?"))
      return;

    try {
      const { data, error } = await supabase
        .from("user_reports")
        .delete()
        .in("id", reportIds)
        .select();

      console.log("Supabase response:", data);
      console.log("Supabase error:", error);
      const session = await supabase.auth.getSession();
      console.log("Session:", session);

      if (error) throw error;

      setReports((prev) => prev.filter((r) => !reportIds.includes(r.id)));

      alert("Reports dismissed successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to dismiss reports.");
    }
  };




  const resolvedToday = 34;
  const avgResponseTime = "2.4h";

  /* ================= UI ================= */

  return (
    <>
      <div className="moderation-container">
        {/* TOP TABS */}
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



        {/* HEADER */}
        <div className="page-header">
          <h2>Content Moderation</h2>
          <p>Review and moderate flagged content from user reports</p>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-box">
            <p>Open Cases</p>
            <h3>{openCases}</h3>
            <Flag size={18} className="stat-icon" />
          </div>

          <div className="stat-box">
            <p>High Priority</p>
            <h3>{highPriorityCount}</h3>
            <AlertTriangle size={18} className="stat-icon red" />
          </div>

          <div className="stat-box">
            <p>Resolved Today</p>
            <h3>{resolvedToday}</h3>
            <CheckCircle size={18} className="stat-icon green" />
          </div>

          <div className="stat-box">
            <p>Avg Response Time</p>
            <h3>{avgResponseTime}</h3>
            <Clock size={18} className="stat-icon" />
          </div>
        </div>

        {/* REPORT LIST */}
        {loading ? (
          <p className="loading-text">Loading reports...</p>
        ) : openCases === 0 ? (
          <p className="loading-text">No reports available.</p>
        ) : (
          <div className="reports-list">
            {Object.values(reportsByUser).map((userReports) => {
              const firstReport = userReports[0];
              const totalReports = userReports.length;

              return (
                <ReportCard
                  key={firstReport.id}
                  reportIds={userReports.map(r => r.id)}   // ✅ pass all ids
                  name={firstReport.reported_name || "Unknown User"}
                  reporter={firstReport.reporter_name || "Unknown Reporter"}
                  reason={firstReport.reason}
                  description={firstReport.message}
                  reports={totalReports}
                  time={new Date(firstReport.created_at).toLocaleString()}
                  priority={getPriority(firstReport.reason)}
                  priorityClass={getPriorityClass(firstReport.reason)}
                  onDismiss={handleDismiss}
                />
              );
            })}

          </div>
        )}
      </div>
    </>
  );

};

/* ================= REPORT CARD ================= */

const ReportCard = ({
  name,
  priority,
  reportIds,
  priorityClass,
  reportedPhone,
  reports,
  time,
  reporter,
  reason,
  description,
  onDismiss,
}) => {
  return (
    <div className="report-card">
      <div className="report-header">
        <div className="report-title">
          <span className={`status-dot ${priorityClass}`} />
          <h4>{name}</h4>

          <span className={`priority ${priorityClass}`}>
            {priority}
          </span>
        </div>
      </div>

      <div className="report-details">
        <div className="left">
          <p><strong>User ID:</strong> {reportIds?.[0]?.slice(0, 17)}</p>
          <p><strong>Reported by:</strong> {reporter}</p>
          <p><strong>Reason:</strong> {reason}</p>
        </div>

        <div className="right">
          <p><strong>Reports:</strong> {reports}</p>
          <p><strong>Time:</strong> {time}</p>
        </div>
      </div>

      <div className="description-box">
        <p className="desc-label">Description:</p>
        <p>{description || "No message provided"}</p>
      </div>

      <div className="actions">
        <button className="btn-primary">
          <Eye size={16} /> View Content
        </button>

        <button
          className="btn-secondary"
          onClick={() => onDismiss(reportIds)}
        >
          Dismiss Report
        </button>

        <button className="btn-secondary">
          Suspend User
        </button>
      </div>
    </div>

  );
};

export default ModerationReports;