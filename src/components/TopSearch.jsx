import { FaSearch, FaBell, FaUser } from "react-icons/fa";

export default function TopSearch() {
  return (
    <div style={styles.topbar}>

      {/* Search Section */}
      <div style={styles.searchBox}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search users, reports, or content..."
          style={styles.searchInput}
        />
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>

        {/* Notification */}
        <div style={styles.notification}>
          <FaBell />
          <span style={styles.dot}></span>
        </div>

        <div style={styles.divider}></div>

        {/* Admin Info */}
        <div style={styles.adminInfo}>
          <div style={styles.adminText}>
            <span style={styles.adminName}>Admin User</span>
            <small style={styles.adminRole}>Super Admin</small>
          </div>

          <div style={styles.avatar}>
            <FaUser />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= INLINE STYLES ================= */

const styles = {
  /* Topbar */
  topbar: {
    height: "72px",
    // background: "#3A3A3C",
    background: "#1e1e1e",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    width:"100%"
  },

  /* Search */
  searchBox: {
    position: "relative",
    width: "540px",
  },

  searchInput: {
    width: "100%",
    height: "44px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    paddingLeft: "44px",
    fontSize: "14px",
    outline: "none",

    /* 🔥 THIS IS THE IMPORTANT PART */
    backgroundColor: "#ffffff",
    color: "#111827",
    boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    fontSize: "16px",
  },

  /* Right section */
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  notification: {
    position: "relative",
    fontSize: "18px",
    color: "#c7ff00",
    cursor: "pointer",
  },

  dot: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    width: "8px",
    height: "8px",
    background: "red",
    borderRadius: "50%",
  },

  divider: {
    width: "1px",
    height: "32px",
    background: "#777",
  },

  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  adminText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: "1.1",
  },

  adminName: {
    color: "#c7ff00",
    fontSize: "14px",
    fontWeight: "600",
  },

  adminRole: {
    color: "#d1d5db",
    fontSize: "12px",
  },

  avatar: {
    width: "36px",
    height: "36px",
    background: "#c7ff00",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#1f2937",
  },
};
