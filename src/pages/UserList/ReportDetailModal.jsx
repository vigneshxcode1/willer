import React, { useState } from "react";
import "./ReportDetailModal.css";
import {
  FaTimes,
  FaExclamationTriangle,
  FaTrash,
  FaCheck,
} from "react-icons/fa";

import { supabase } from "../../supabaseClient";
import { sendWarningUser } from "../../services/adminApi";

export default function ReportDetailModal({ report, onClose }) {
  const [loading, setLoading] = useState(false);
  const [warningLoading, setWarningLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState(null);

  async function handleSendWarning() {
    const confirmWarning = window.confirm(
      "Send warning to this user? Warning will stay TRUE for 5 seconds."
    );

    if (!confirmWarning) return;

    setWarningLoading(true);

    const success = await sendWarningUser(report.reported_phone);

    if (success) {
      alert("Warning sent successfully (5 seconds).");
    } else {
      alert("Failed to send warning.");
    }

    setWarningLoading(false);
  }

  if (!report) return null;

  const formattedDate = report.created_at
    ? new Date(report.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "--";

  // ✅ MARK AS RESOLVED FUNCTION - FIXED VERSION (NO MESSAGE COLUMN)
  const handleResolve = async () => {
    if (
      !window.confirm(
        "Are you sure you want to mark this report as resolved?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Fetch full report data
      const { data: fullReport, error: fetchError } = await supabase
        .from("user_reports")
        .select("*")
        .eq("id", report.id)
        .single();

      if (fetchError || !fullReport) {
        console.error("Fetch error:", fetchError);
        alert("❌ Failed to fetch report details");
        return;
      }

      // 2️⃣ Prepare payload WITHOUT message column
      const payload = {
        reporter_name: fullReport.reporter_name ?? null,
        reported_name: fullReport.reported_name ?? null,
        reporter_phone: fullReport.reporter_phone ?? null,
        reported_phone: fullReport.reported_phone ?? null,
        reason: fullReport.reason ? fullReport.reason : "Other",
        evidence_urls: Array.isArray(fullReport.evidence_urls)
          ? fullReport.evidence_urls
          : [],
        image_url: fullReport.image_url ?? null,
        resolved_count: 1,
      };

      // 3️⃣ Insert into resolved_user table
      const { error: insertError } = await supabase
        .from("resolved_user")
        .insert(payload);

      if (insertError) {
        console.error("INSERT ERROR =>", insertError);
        alert("❌ Insert failed: " + insertError.message);
        return;
      }

      // 4️⃣ Delete from user_reports table
      const { error: deleteError } = await supabase
        .from("user_reports")
        .delete()
        .eq("id", report.id);

      if (deleteError) {
        console.error("DELETE ERROR =>", deleteError);
        alert("❌ Delete failed: " + deleteError.message);
        return;
      }

      alert("✅ Report moved to resolved_user successfully!");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Resolve error:", err);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveContent = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this report permanently?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("user_reports")
        .delete()
        .eq("id", report.id);

      if (error) {
        console.error("Error deleting report:", error);
        alert("❌ Failed to delete report");
        return;
      }

      alert("✅ Report deleted successfully!");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
  async function loadSignedUrl() {
    if (!report?.image_url) return;

    const filePath = report.image_url.split("/object/public/")[1]; 
    // OR correct split based on your stored value

    const { data, error } = await supabase.storage
      .from("your_bucket_name")
      .createSignedUrl(filePath, 60);

    if (!error) setSignedUrl(data.signedUrl);
  }

  loadSignedUrl();
}, [report]);

  return (
    <div className="report-overlay">
      <div className="report-modal">
        {/* HEADER */}
        <div className="report-header">
          <div>
            <h2>
              Report Detail <span className="status-badge">PENDING REVIEW</span>
            </h2>
            <p className="report-id">
              ID: #{report.id} · Reported on {formattedDate}
            </p>
          </div>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        {/* Reporter Details */}
        <div className="section">
          <h4 className="section-title">Reporter Details</h4>
          <div className="user-card">
            <div className="avatar">
              {(
                report.reporter_name ||
                report.reporter_phone ||
                "?"
              )[0].toUpperCase()}
            </div>
            <div className="user-info">
              <h3>
                {report.reporter_name ||
                  report.reporter_phone ||
                  "Unknown Reporter"}
              </h3>
              <p className="user-meta">{report.reporter_phone || "--"}</p>
            </div>
          </div>
        </div>

{/* Reason & Description */}
<div className="section">
  <h4 className="section-title">Reason & Description</h4>

  {/* ✅ SHOW IMAGE ABOVE CATEGORY */}
  {report.image_url && (
    <div className="image-preview" style={{ marginBottom: "15px" }}>
      <img
        src={report.image_url}
        alt="evidence"
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    </div>
  )}

  <div className="label">Report Category</div>
  <p className="category">{report.reason || "Not Specified"}</p>

  <div className="reason-box">
    <span className="reason-title">Reported Message / Reason</span>
    <p>{report.message || "No message provided"}</p>
  </div>
</div>


        {/* Evidence Preview */}
        {report.image_url && (
          <div className="section">
            <div className="evidence-header">
              <h4 className="section-title">Evidence Preview</h4>
              <span className="attachment">1 ATTACHMENT</span>
            </div>

            <div className="image-preview">
              <img
                src={report.image_url}
                alt="evidence"
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.style.display = "flex";
                  }
                }}
              />
              <div
                style={{
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  background: "#f5f5f5",
                }}
              >
                <p>Image failed to load</p>
              </div>
            </div>
          </div>
        )}

        {/* Reported Account */}
        <div className="section">
          <h4 className="section-title">Account Being Reported</h4>
          <div className="user-card">
            <div className="avatar">
              {(
                report.reported_name ||
                report.reported_phone ||
                "?"
              )[0].toUpperCase()}
            </div>
            <div className="user-info">
              <h3>
                {report.reported_name ||
                  report.reported_phone ||
                  "Unknown User"}
              </h3>
              <p className="user-meta">{report.reported_phone || "--"}</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-row">
          <button
            className={`btn warning-btn ${warningLoading ? "warning-active" : ""}`}
            onClick={handleSendWarning}
            disabled={warningLoading}
          >
            <FaExclamationTriangle />
            {warningLoading ? " Warning Sent" : " Send Warning"}
          </button>

          <button
            className="btn danger-outline"
            onClick={handleRemoveContent}
            disabled={loading}
          >
            <FaTrash /> {loading ? "Removing..." : "Remove Content"}
          </button>
        </div>

        {/* ✅ RESOLVE BUTTON */}
        <button
          className="btn resolve"
          onClick={handleResolve}
          disabled={loading}
        >
          <FaCheck />
          {loading ? " Processing..." : " Mark as Resolved"}
        </button>

        <p className="audit-text">
          Action will be logged in the Audit Trail permanently.
        </p>
      </div>
    </div>
  );
}