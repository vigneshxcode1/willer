// import { useEffect, useState } from "react"
// import { createClient } from '@supabase/supabase-js'
// import "./Dashboard.css"

// import Dollar from "../assets/Dollar.png";
// import flag from "../assets/flag.png";
// import heart from "../assets/heart.png";
// import person from "../assets/person.png";

// Initialize Supabase client (replace with your credentials)
// const supabase = createClient(
//   "https://xybvntejftsnbzsjwqal.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YnZudGVqZnRzbmJ6c2p3cWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDUwNDIsImV4cCI6MjA4NDMyMTA0Mn0.0mzi4V_73L0hE87LZChonoUjQGxHZ2598fBic8HGqoM"
// )


// // ==================== UTILITY FUNCTIONS ====================
// function getDateDaysAgo(days) {
//   const date = new Date()
//   date.setDate(date.getDate() - days)
//   date.setHours(0, 0, 0, 0)
//   return date
// }

// const calculatePercentage = (currentTotal, previousTotal) => {
//   if (previousTotal === 0) return 0
//   return Number(
//     (((currentTotal - previousTotal) / previousTotal) * 10).toFixed(2)
//   )
// }

// // ==================== API FUNCTIONS ====================
// async function getTotalUsers() {
//   const sevenDaysAgo = getDateDaysAgo(7)
//   const fourteenDaysAgo = getDateDaysAgo(14)

//   const { count: total } = await supabase
//     .from("users")
//     .select("*", { count: "exact", head: true })

//   const { count: current } = await supabase
//     .from("users")
//     .select("*", { count: "exact", head: true })
//     .gte("created_at", sevenDaysAgo.toISOString())

//   const { count: previous } = await supabase
//     .from("users")
//     .select("*", { count: "exact", head: true })
//     .gte("created_at", fourteenDaysAgo.toISOString())
//     .lt("created_at", sevenDaysAgo.toISOString())

//   return {
//     total: total || 0,
//     current: current || 0,
//     previous: previous || 0,
//   }
// }

// async function getActiveMatches() {
//   const sevenDaysAgo = getDateDaysAgo(7)
//   const fourteenDaysAgo = getDateDaysAgo(14)

//   const { count: total } = await supabase
//     .from("matches")
//     .select("*", { count: "exact", head: true })

//   const { count: current } = await supabase
//     .from("matches")
//     .select("*", { count: "exact", head: true })
//     .gte("created_at", sevenDaysAgo.toISOString())

//   const { count: previous } = await supabase
//     .from("matches")
//     .select("*", { count: "exact", head: true })
//     .gte("created_at", fourteenDaysAgo.toISOString())
//     .lt("created_at", sevenDaysAgo.toISOString())

//   return {
//     total: total || 0,
//     current: current || 0,
//     previous: previous || 0,
//   }
// }

// async function getTotalReports() {
//   const sevenDaysAgo = getDateDaysAgo(7)
//   const fourteenDaysAgo = getDateDaysAgo(14)

//   const { count: total } = await supabase
//     .from("user_reports")
//     .select("*", { count: "exact", head: true })

//   const { count: current } = await supabase
//     .from("user_reports")
//     .select("*", { count: "exact", head: true })
//     .gte("created_at", sevenDaysAgo.toISOString())

//   const { count: previous } = await supabase
//     .from("user_reports")
//     .select("*", { count: "exact", head: true })
//     .gte("created_at", fourteenDaysAgo.toISOString())
//     .lt("created_at", sevenDaysAgo.toISOString())

//   return {
//     total: total || 0,
//     current: current || 0,
//     previous: previous || 0,
//   }
// }

// async function getRecentActivity() {
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)

//   const { data, error } = await supabase
//     .from("app_activity")
//     .select(`
//       id,
//       activity_type,
//       device_info,
//       created_at,
//       users(nickname)
//     `)
//     .gte("created_at", today.toISOString())
//     .order("created_at", { ascending: false })

//   if (error) {
//     console.error(error)
//     return []
//   }

//   return data
// }

// // ==================== COMPONENTS ====================

// // StatCard Component
// function StatCard({ title, value, change }) {
//   const isPositive = change >= 0
  
//   return (
//     <div className="stat-card">
//       <h3 className="stat-title">{title}</h3>
//       <div className="stat-value">{value.toLocaleString()}</div>
//       <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
//         <span className="stat-arrow">{isPositive ? '↑' : '↓'}</span>
//         <span>{Math.abs(change)}%</span>
//         <span className="stat-period">vs last 7 days</span>
//       </div>
//     </div>
//   )
// }

// // ActivityList Component
// function ActivityList() {
//   const [activities, setActivities] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function loadActivities() {
//       setLoading(true)
//       const data = await getRecentActivity()
//       setActivities(data)
//       setLoading(false)
//     }
//     loadActivities()
//   }, [])

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp)
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     })
//   }

//   const getActivityIcon = (type) => {
//     const icons = {
//       'user_signup': '👤',
//       'match_created': '💕',
//       'message_sent': '💬',
//       'profile_update': '✏️',
//       'report_submitted': '⚠️',
//       'login': '🔑',
//     }
//     return icons[type] || '📱'
//   }

//   const getActivityText = (activity) => {
//     const nickname = activity.users?.nickname || 'User'
//     const typeMap = {
//       'user_signup': 'signed up',
//       'match_created': 'got a new match',
//       'message_sent': 'sent a message',
//       'profile_update': 'updated their profile',
//       'report_submitted': 'submitted a report',
//       'login': 'logged in',
//     }
//     return `${nickname} ${typeMap[activity.activity_type] || 'performed an action'}`
//   }

//   return (
//     <div className="activity-section">
//       <h2>Recent Activity</h2>
//       {loading ? (
//         <p className="loading-text">Loading activities...</p>
//       ) : activities.length === 0 ? (
//         <p className="no-activity">No activity today yet</p>
//       ) : (
//         <div className="activity-list">
//           {activities.map((activity) => (
//             <div key={activity.id} className="activity-item">
//               <span className="activity-icon">{getActivityIcon(activity.activity_type)}</span>
//               <div className="activity-details">
//                 <p className="activity-text">{getActivityText(activity)}</p>
//                 <p className="activity-time">{formatTime(activity.created_at)}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // ==================== MAIN DASHBOARD COMPONENT ====================
// export default function Dashboard() {
//   const [totalUsers, setTotalUsers] = useState({
//     total: 0,
//     current: 0,
//     previous: 0,
//   })
//   const [activeMatches, setActiveMatches] = useState({
//     total: 0,
//     current: 0,
//     previous: 0,
//   })
//   const [totalReports, setTotalReports] = useState({
//     total: 0,
//     current: 0,
//     previous: 0,
//   })
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function loadStats() {
//       setLoading(true)
//       const [users, matches, reports] = await Promise.all([
//         getTotalUsers(),
//         getActiveMatches(),
//         getTotalReports(),
//       ])

//       // Debug logs
//       console.log("===== DASHBOARD DATA =====")
//       console.log("USERS OBJECT:", users)
//       console.log("Total Users (All Time):", users.total)
//       console.log("Users Last 7 Days:", users.current)
//       console.log("Users Previous 7 Days:", users.previous)
//       console.log(
//         "User 7-Day Growth:",
//         calculatePercentage(users.current, users.previous) + "%"
//       )
//       console.log("ACTIVE MATCHES:", matches)
//       console.log(
//         "Active Matches 7-Day Growth:",
//         calculatePercentage(matches.current, matches.previous) + "%"
//       )
//       console.log(
//         "Reports 7-Day Growth:",
//         calculatePercentage(reports.current, reports.previous) + "%"
//       )
//       console.log("==========================")

//       setTotalUsers(users)
//       setActiveMatches(matches)
//       setTotalReports(reports)
//       setLoading(false)
//     }
//     loadStats()
//   }, [])

//   return (
//     <div className="dashboard-layout">
//       <div className="main">
//         <h1>Dashboard</h1>
//         <p className="subtitle">
//           Welcome back! Here's what's happening with your dating platform today.
//         </p>
//         <div className="stats">
//           {loading ? (
//             <p>Loading stats...</p>
//           ) : (
//             <>
//               <StatCard
//                 title="Total Users"
//                 value={totalUsers.total}
//                 change={calculatePercentage(
//                   totalUsers.current,
//                   totalUsers.previous
//                 )}
               
//                 img={person}
//               />
//               <StatCard
//                 title="Active Matches"
//                 value={activeMatches.total}
//                 change={calculatePercentage(
//                   activeMatches.current,
//                   activeMatches.previous
//                 )}
//                  img={heart}
               
//               />
//               <StatCard
//                 title="Pending Reports"
//                 value={totalReports.total}
//                 change={calculatePercentage(
//                   totalReports.current,
//                   totalReports.previous
//                 )}
//                  img={flag}
//               />
//               <StatCard title="Revenue (MTD)" value="$48,392" change={23.1}                  img={Dollar}
// />
//             </>
//           )}
//         </div>
//         <ActivityList />
//       </div>
//     </div>
//   )
// }















































import { useEffect, useState } from "react"
import { createClient } from '@supabase/supabase-js'
import "./Dashboard.css"

import Dollar from "../assets/Dollar.png";
import flag from "../assets/flag.png";
import heart from "../assets/heart.png";
import person from "../assets/person.png";

// Initialize Supabase client (replace with your credentials)
const supabase = createClient(
  "https://xybvntejftsnbzsjwqal.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YnZudGVqZnRzbmJ6c2p3cWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDUwNDIsImV4cCI6MjA4NDMyMTA0Mn0.0mzi4V_73L0hE87LZChonoUjQGxHZ2598fBic8HGqoM"
)



// ==================== UTILITY FUNCTIONS ====================
function getDateDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(0, 0, 0, 0)
  return date
}

const calculatePercentage = (currentTotal, previousTotal) => {
  if (previousTotal === 0) return 0
  return Number(
    (((currentTotal - previousTotal) / previousTotal) * 10).toFixed(2)
  )
}

// ==================== API FUNCTIONS ====================
async function getTotalUsers() {
  const sevenDaysAgo = getDateDaysAgo(7)
  const fourteenDaysAgo = getDateDaysAgo(14)

  const { count: total } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })

  const { count: current } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString())

  const { count: previous } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", fourteenDaysAgo.toISOString())
    .lt("created_at", sevenDaysAgo.toISOString())

  return {
    total: total || 0,
    current: current || 0,
    previous: previous || 0,
  }
}

async function getActiveMatches() {
  const sevenDaysAgo = getDateDaysAgo(7)
  const fourteenDaysAgo = getDateDaysAgo(14)

  const { count: total } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })

  const { count: current } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString())

  const { count: previous } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .gte("created_at", fourteenDaysAgo.toISOString())
    .lt("created_at", sevenDaysAgo.toISOString())

  return {
    total: total || 0,
    current: current || 0,
    previous: previous || 0,
  }
}

async function getTotalReports() {
  const sevenDaysAgo = getDateDaysAgo(7)
  const fourteenDaysAgo = getDateDaysAgo(14)

  const { count: total } = await supabase
    .from("user_reports")
    .select("*", { count: "exact", head: true })

  const { count: current } = await supabase
    .from("user_reports")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString())

  const { count: previous } = await supabase
    .from("user_reports")
    .select("*", { count: "exact", head: true })
    .gte("created_at", fourteenDaysAgo.toISOString())
    .lt("created_at", sevenDaysAgo.toISOString())

  return {
    total: total || 0,
    current: current || 0,
    previous: previous || 0,
  }
}

async function getRecentActivity() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from("app_activity")
    .select(`
      id,
      activity_type,
      device_info,
      created_at,
      users(nickname)
    `)
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
}

// ==================== COMPONENTS ====================

// StatCard Component
function StatCard({ title, value, change, img, bgColor }) {
  const isPositive = change >= 0
  
  return (
    <div className="stat-card" >
      <div className="stat-card-header">
        <div className="stat-icon-wrapper" style={{ backgroundColor: bgColor }}>
          <img src={img} alt={title} className="stat-icon"  />
        </div>
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="stat-arrow">{isPositive ? '↗' : '↘'}</span>
          <span>{isPositive ? '+' : ''}{change}%</span>
        </div>
      </div>
      <div className="stat-value">{value.toLocaleString()}</div>
      <div className="stat-title">{title}</div>
    </div>
  )
}

// ActivityList Component
function ActivityList() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadActivities() {
      setLoading(true)
      const data = await getRecentActivity()
      setActivities(data)
      setLoading(false)
    }
    loadActivities()
  }, [])

  const formatTime = (timestamp) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffMs = now - activityTime
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) {
      return `${diffMins} min ago`
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      return activityTime.toLocaleDateString()
    }
  }

  const getActivityDotColor = (type) => {
    const colors = {
      'user_signup': '#3b82f6',      // Blue
      'match_created': '#10b981',    // Green
      'message_sent': '#10b981',     // Green
      'profile_update': '#10b981',   // Green
      'report_submitted': '#f59e0b', // Orange
      'login': '#10b981',            // Green
    }
    return colors[type] || '#3b82f6'
  }

  const getActivityText = (activity) => {
    const nickname = activity.users?.nickname || 'User'
    const typeMap = {
      'user_signup': 'New user registration',
      'match_created': 'got a new match',
      'message_sent': 'sent a message',
      'profile_update': 'Photo verification approved',
      'report_submitted': 'Reported inappropriate content',
      'login': 'logged in',
    }
    return {
      name: nickname,
      action: typeMap[activity.activity_type] || 'performed an action'
    }
  }

  return (
    <div className="activity-section">
      <h2>Recent Activity</h2>
      {loading ? (
        <p className="loading-text">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="no-activity">No activity today yet</p>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => {
            const { name, action } = getActivityText(activity)
            return (
              <div key={activity.id} className="activity-item">
                <div 
                  className="activity-dot" 
                  style={{ backgroundColor: getActivityDotColor(activity.activity_type) }}
                />
                <div className="activity-details">
                  <p className="activity-name">{name}</p>
                  <p className="activity-action">{action}</p>
                </div>
                <p className="activity-time">{formatTime(activity.created_at)}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ==================== MAIN DASHBOARD COMPONENT ====================
export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState({
    total: 0,
    current: 0,
    previous: 0,
  })
  const [activeMatches, setActiveMatches] = useState({
    total: 0,
    current: 0,
    previous: 0,
  })
  const [totalReports, setTotalReports] = useState({
    total: 0,
    current: 0,
    previous: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      const [users, matches, reports] = await Promise.all([
        getTotalUsers(),
        getActiveMatches(),
        getTotalReports(),
      ])

      // Debug logs
      console.log("===== DASHBOARD DATA =====")
      console.log("USERS OBJECT:", users)
      console.log("Total Users (All Time):", users.total)
      console.log("Users Last 7 Days:", users.current)
      console.log("Users Previous 7 Days:", users.previous)
      console.log(
        "User 7-Day Growth:",
        calculatePercentage(users.current, users.previous) + "%"
      )
      console.log("ACTIVE MATCHES:", matches)
      console.log(
        "Active Matches 7-Day Growth:",
        calculatePercentage(matches.current, matches.previous) + "%"
      )
      console.log(
        "Reports 7-Day Growth:",
        calculatePercentage(reports.current, reports.previous) + "%"
      )
      console.log("==========================")

      setTotalUsers(users)
      setActiveMatches(matches)
      setTotalReports(reports)
      setLoading(false)
    }
    loadStats()
  }, [])

  return (
    <div className="dashboard-layout">
      <div className="main">
        <h1 style={{color:"#101828"}}>Dashboard</h1>
        <p className="subtitle">
          Welcome back! Here's what's happening with your dating platform today.
        </p>
        <div className="stats">
          {loading ? (
            <p>Loading stats...</p>
          ) : (
            <>
              <StatCard
                title="Total Users"
                value={totalUsers.total}
                change={calculatePercentage(
                  totalUsers.current,
                  totalUsers.previous
                )}
                img={person}
                bgColor="#dbeafe"
              />
              <StatCard
                title="Active Matches"
                value={activeMatches.total}
                change={calculatePercentage(
                  activeMatches.current,
                  activeMatches.previous
                )}
                img={heart}
                bgColor="#fce7f3"
              />
              <StatCard
                title="Pending Reports"
                value={totalReports.total}
                change={calculatePercentage(
                  totalReports.current,
                  totalReports.previous
                )}
                img={flag}
                bgColor="#fef3c7"
              />
              <StatCard 
                title="Revenue (MTD)" 
                value="$48,392" 
                change={23.1}
                img={Dollar}
                bgColor="#d1fae5"
              />
            </>
          )}
        </div>
        <ActivityList />
      </div>
    </div>
  )
}