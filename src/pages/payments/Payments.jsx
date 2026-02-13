import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { BsEye } from "react-icons/bs";
import { BiBlock } from "react-icons/bi";

export default function Payments() {
  const USERS_PER_PAGE = 10;

  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalSubscription, setTotalSubscription] = useState(0);
  const [revenueStats, setRevenueStats] = useState({
    current: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(totalRecords / USERS_PER_PAGE);

  useEffect(() => {
    loadData();
  }, [page]);

  async function loadData() {
    setLoading(true);

    const activeSubs = await getActiveSubscriptions();
    setTotalSubscription(activeSubs);

    const revenue = await getRevenueStats();
    setRevenueStats(revenue);

    await getUsersPayments(page, USERS_PER_PAGE);

    setLoading(false);
  }

  // ✅ Active Subscriptions

async function getActiveSubscriptions() {
  const { count, error } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact" }) // just get the count
    .eq("is_active", true);          // only active subscriptions

  if (error) {
    console.error("Error fetching subscriptions:", error);
    return 0;
  }

  return count || 0;
}

  // ✅ Revenue (Last 7 Days vs Previous 7 Days)
  async function getRevenueStats() {
    const now = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);

    // Current 7 days
    const { data: currentData } = await supabase
      .from("payment_history")
      .select("amount")
      .eq("payment_status", "success")
      .gte("created_at", sevenDaysAgo.toISOString());

    // Previous 7 days
    const { data: prevData } = await supabase
      .from("payment_history")
      .select("amount")
      .eq("payment_status", "success")
      .gte("created_at", fourteenDaysAgo.toISOString())
      .lt("created_at", sevenDaysAgo.toISOString());

    const currentTotal =
      currentData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    const prevTotal =
      prevData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    // ((Current - Previous) / Previous) × 100
    const percentage =
      prevTotal === 0
        ? 100
        : ((currentTotal - prevTotal) / prevTotal) * 100;

    return {
      current: currentTotal,
      percentage: percentage.toFixed(1),
    };
  }

async function getUsersPayments(page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("payment_history")
    .select(
      `
      payment_id,
      user_id,
      nickname,
      plan_type,
      amount,
      payment_status,
      payment_method,
      created_at
     
      `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching payments:", error);
    return;
  }

  setPayments(data);
  setTotalRecords(count);
}

  return (
    <div className="users-page">
      <h1 className="page-title">Payment Management</h1>
      <p className="page-subtitle">
        Monitor transactions and subscription revenue
      </p>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Revenue (MTD)"
          value={`₹ ${revenueStats.current.toLocaleString()}`}
          trend={`${revenueStats.percentage}%`}
        />

        <StatCard
          label="Active Subscriptions"
          value={totalSubscription.toLocaleString()}
          trend="" 
        />

        <StatCard
          label="Avg Transaction Value"
          value={totalRecords.toLocaleString()}
          trend=""
        />

        <StatCard
          label="Failed Payments"
          value={
            payments.filter((p) => p.status === "failed").length
          }
          trend=""
        />
      </div>

      {/* Table */}
      <div className="table-card">
        <h5>Recent Transactions</h5>

        {loading ? (
          <p>Loading payments...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>TRANSACTION ID</th>
                <th>USER </th>
                <th>PLAN/PRODUCT</th>
                <th>AMOUNT</th>
                <th>METHOD</th>
                <th>STATUS</th>
                <th>DATE</th>
              
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.payment_id}>
                <td>{payment.user_id}</td>
  <td>{payment.nickname}</td>
    <td>₹ {payment.plan_type}</td>
                 
                  <td>₹ {payment.amount}</td>
 <td>₹ {payment.payment_method}</td>

                  <td>
                 <span className={`status ${payment.payment_status}`}>

                      {payment.payment_status}
                    </span>
                  </td>

                  <td>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>

                  <td className="view-link">
                    <BsEye /> <BiBlock />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">
            Showing {(page - 1) * USERS_PER_PAGE + 1} –
            {Math.min(page * USERS_PER_PAGE, totalRecords)} of{" "}
            {totalRecords} transactions
          </span>

          <div className="pagination-buttons">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="primary"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stats Card ---------- */
function StatCard({ label, value, trend }) {
  const isPositive = Number(trend) >= 0;

  return (
    <div className="stat-card">
      {trend && (
        <span
          className="stat-trend"
          style={{ color: isPositive ? "green" : "red" }}
        >
          {isPositive ? "▲" : "▼"} {trend}
        </span>
      )}
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}