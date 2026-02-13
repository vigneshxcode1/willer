import { useEffect, useState } from "react";
import { getRecentActivity } from "../services/adminApi";
import { formatDistanceToNow, format } from "date-fns";
import "../pages/Dashboard.css";

export default function ActivityList() {
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function loadActivity() {
      const data = await getRecentActivity();
      setRecentActivity(data);
    }
    loadActivity();
  }, []);

  // Format timestamp for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${format(date, "HH:mm")}`;
    }

    return format(date, "MMM d, yyyy 'at' HH:mm");
  };

  // New function to format the activity message
  const formatActivityTypeMessage = (type) => {
    if (!type) return "performed an action";

    switch (type) {
      case "login":
        return "logged in";
      case "logout":
        return "logged out";
      case "register":
        return "registered";
      case "photo_verification":
        return "photo verification approved";
      case "report":
        return "reported inappropriate content";
      case "premium_subscription":
        return "activated premium subscription";
      case "account_suspended":
        return "account suspended";
      default:
        return String(type).replace(/_/g, " ");
    }
  };




  return (
    <div className="activity-card">
      <h2 className="activity-title">Recent Activity</h2>

      {recentActivity.length === 0 ? (
        <p className="empty-text">No recent activity.</p>
      ) : (
        <ul className="activity-list">
          {recentActivity.map((activity) => (
            <li key={activity.id} className="activity-item">
              <span
                className={`activity-dot ${activity.activity_type ? activity.activity_type.replace(/_/g, "-") : "default"
                  }`}
              />

              <div className="activity-content">
                <p className="activity-user">{activity.users?.nickname || "Unknown User"}</p>
                <p className="activity-action">{formatActivityTypeMessage(activity.activity_type)}</p>

              </div>


              <span className="activity-time">
                {formatTime(activity.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}