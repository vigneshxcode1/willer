import React, { useState } from "react";

// Sub-components for User and Bug cards
const UserReportCard = ({ report }) => (
  <div className="management-card">
    <div className="management-header">
      <span className="dot red"></span>
      <h4>{report.title}</h4>
      <span className={`badge ${report.priority}`}>{report.priority.toUpperCase()}</span>
    </div>

    <div className="management-info">
      <p><strong>Reported by:</strong> {report.reportedBy}</p>
      <p><strong>Reported user:</strong> {report.reportedUser}</p>
      <p><strong>Category:</strong> {report.category}</p>
      <p><strong>Time:</strong> {report.time}</p>
    </div>

    <div className="message-preview">{report.message}</div>

    <div className="action-row">
      <button className="btn blue">Investigate</button>
      <button className="btn red">Take Action</button>
      <button className="btn gray">Dismiss</button>
    </div>
  </div>
);

const BugReportCard = ({ report }) => (
  <div className="management-card">
    <div className="management-header">
      <span className="dot red"></span>
      <h4>{report.title}</h4>
      <span className={`badge ${report.priority}`}>{report.priority.toUpperCase()}</span>
    </div>

    <div className="management-info">
      <p><strong>Reported by:</strong> {report.reportedBy}</p>
      <p><strong>Device:</strong> {report.device}</p>
      <p><strong>Browser:</strong> {report.browser}</p>
      <p><strong>Time:</strong> {report.time}</p>
    </div>

    <div className="message-preview">{report.message}</div>

    <div className="action-row">
      <button className="btn blue">Assign</button>
      <button className="btn green">Mark Resolved</button>
      <button className="btn gray">Archive</button>
    </div>
  </div>
);

const ManagementReports = () => {
  const [managementTab, setManagementTab] = useState("user");

  // Dummy data, replace with fetched reports if needed
  const userReports = [
    {
      title: "Profile violates community guidelines",
      priority: "high",
      reportedBy: "Sarah Johnson",
      reportedUser: "Mike Roberts",
      category: "Fake Profile",
      time: "2025-01-09 15:30",
      message: "User is using fake photos and providing misleading information."
    }
  ];

  const bugReports = [
    {
      title: "Profile photos not loading",
      priority: "medium",
      reportedBy: "Alex Brown",
      device: "iPhone 14",
      browser: "Safari",
      time: "2025-01-10 10:20",
      message: "Photos take too long to load when browsing profiles."
    }
  ];

  return (
    <>
      <div className="section-header">
        <h2>Reports Management</h2>
        <p>Handle user reports and bug submissions</p>
      </div>

      <div className="management-toggle">
        <button
          className={managementTab === "user" ? "toggle-btn active" : "toggle-btn"}
          onClick={() => setManagementTab("user")}
        >
          User Reports
        </button>
        <button
          className={managementTab === "bug" ? "toggle-btn active" : "toggle-btn"}
          onClick={() => setManagementTab("bug")}
        >
          Bug Reports
        </button>
      </div>

      {managementTab === "user" &&
        userReports.map((report, idx) => <UserReportCard key={idx} report={report} />)}

      {managementTab === "bug" &&
        bugReports.map((report, idx) => <BugReportCard key={idx} report={report} />)}
    </>
  );
};

export default ManagementReports;