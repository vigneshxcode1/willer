import React, { useEffect, useState } from "react";
import "./ComponentLibrary.css";
import { supabase } from "../../../src/supabaseClient"; // ✅ correct path check panniko
import {
  getTotalUsers,
  getActiveMatches,
  getTotalReports,
} from "../../services/adminApi"; // ✅ correct path check panniko

// ✅ Stat Card Component
function StatCard({ title, value, change, negative }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>

      <div className={`stat-change ${negative ? "negative" : "positive"}`}>
        {change}
      </div>
    </div>
  );
}

// ✅ Status Chip Component
function StatusChip({ label, type }) {
  return <span className={`status-chip ${type}`}>{label}</span>;
}

export default function ComponentLibrary() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeMatches, setActiveMatches] = useState(0);
  const [totalReports, setTotalReports] = useState(0);

  // ===============================
  // FETCH INITIAL STATS
  // ===============================
  const fetchStats = async () => {
    const usersCount = await getTotalUsers();
    const matchesCount = await getActiveMatches();
    const reportsCount = await getTotalReports();

    setTotalUsers(usersCount);
    setActiveMatches(matchesCount);
    setTotalReports(reportsCount);
  };

  useEffect(() => {
    fetchStats();

    // ===============================
    // REALTIME SUBSCRIPTION (USERS TABLE)
    // ===============================
    const channel = supabase
      .channel("realtime-users-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        async () => {
          const usersCount = await getTotalUsers();
          setTotalUsers(usersCount);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="admin-container">
      <h1>Component Library Showcase</h1>
      <p className="subtitle">Reusable UI components for the admin panel</p>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          change="Live"
        />

        <StatCard
          title="Active Matches"
          value={activeMatches.toLocaleString()}
          change="Live"
        />

        <StatCard
          title="Pending Reports"
          value={totalReports.toLocaleString()}
          change="Live"
          negative
        />

        <StatCard title="Revenue (MTD)" value="$48,392" change="+23.1%" />
      </div>

      {/* Search Bar */}
      <div className="filter-bar">
        <input placeholder="Search users by name, email, or location..." />
        <button className="secondary-btn">Date Range</button>
        <button className="secondary-btn">More Filters</button>
      </div>

      {/* Action Buttons Section */}
      <div className="section">
        <h2>Action Buttons</h2>

        <div className="button-row">
          <button className="primary-btn">Apply</button>
          <button className="secondary-btn">Cancel</button>
          <button className="danger-btn">Suspend</button>
        </div>

        <div className="button-row">
          <button className="primary-btn">Primary</button>
          <button className="secondary-btn">Secondary</button>
          <button className="danger-btn">Destructive</button>
          <button className="success-btn">Success</button>
          <button className="warning-btn">Warning</button>
        </div>

        <button className="full-btn">Save Changes</button>
      </div>

      {/* Status Chips */}
      <div className="section">
        <h2>Status Chips</h2>
        <div className="chip-row">
          <StatusChip label="Active" type="success" />
          <StatusChip label="Suspended" type="danger" />
          <StatusChip label="Flagged" type="warning" />
          <StatusChip label="Pending" type="pending" />
          <StatusChip label="Verified" type="info" />
        </div>
      </div>
    </div>
  );
}