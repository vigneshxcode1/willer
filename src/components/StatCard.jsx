export default function StatCard({ title, value, change }) {
  return (
    <div className="stat-card">
      <h3>{value}</h3>
      <p>{title}</p>
      <span className={change > 0 ? "up" : "down"}>
        {change > 0 ? `+${change}%` : `${change}%`}
      </span>
    </div>
  )
}
