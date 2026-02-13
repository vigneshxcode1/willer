import { supabase } from "../supabaseClient";

// ==================== BASIC FUNCTIONS ====================

export async function getTotalUsers() {
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching user count:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getActiveMatches() {
  const { count, error } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching active matches count:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getActiveTodayUsers() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("last_seen", today.toISOString());

  if (error) {
    console.error("Error fetching active today users:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getTotalReports() {
  const { count, error } = await supabase
    .from("user_reports")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching report count:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getRecentActivity(limit = 10) {
  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, last_seen")
    .order("last_seen", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }

  return data || [];
}

export async function getTotalSubscription() {
  const { count, error } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching subscription count:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getVerifiedUsers() {
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", true);

  if (error) {
    console.error("Error fetching verified users:", error);
    return 0;
  }

  return count ?? 0;
}

// ==================== USER DETAILS FUNCTIONS ====================

export async function getLikesReceivedCount(phone) {
  if (!phone) return 0;

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("to_phone", formattedPhone);

  if (error) {
    console.error("Error fetching likes received:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getMatchesCount(phone) {
  if (!phone) return 0;

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  const { count, error } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .or(`user1_phone.eq.${formattedPhone},user2_phone.eq.${formattedPhone}`);

  if (error) {
    console.error("Error fetching matches count:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getUserReportsCount(phone) {
  if (!phone) return 0;

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  const { count, error } = await supabase
    .from("user_reports")
    .select("*", { count: "exact", head: true })
    .eq("reported_phone", formattedPhone);

  if (error) {
    console.error("Error fetching user report count:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getUserReportsList(phone) {
  if (!phone) return [];

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  const { data, error } = await supabase
    .from("user_reports")
    .select("id, reporter_phone, reported_phone, reason, message, created_at")
    .eq("reported_phone", formattedPhone)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user reports list:", error);
    return [];
  }

  return data ?? [];
}

export async function getResolvedReportsCount(phone) {
  if (!phone) return 0;

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  const { count, error } = await supabase
    .from("resolved_user")
    .select("*", { count: "exact", head: true })
    .eq("reported_phone", formattedPhone);

  if (error) {
    console.error("Error fetching resolved count:", error);
    return 0;
  }

  return count ?? 0;
}

// ==================== ADMIN ACTIONS ====================

export async function suspendUser(phone) {
  if (!phone) return false;

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  const suspendUntil = new Date();
  suspendUntil.setDate(suspendUntil.getDate() + 7);

  const { error } = await supabase
    .from("users")
    .update({
      is_suspended: true,
      suspended_until: suspendUntil.toISOString(),
    })
    .eq("phone", formattedPhone);

  if (error) {
    console.error("Error suspending user:", error);
    return false;
  }

  return true;
}

export async function sendWarningUser(phone) {
  if (!phone) return false;

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  const warningUntil = new Date(Date.now() + 5000).toISOString();

  const { error } = await supabase
    .from("users")
    .update({
      warning: true,
      warning_until: warningUntil,
    })
    .eq("phone", formattedPhone);

  if (error) {
    console.error("Error sending warning:", error);
    return false;
  }

  return true;
}

export async function clearExpiredWarnings() {
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("users")
    .update({ warning: false, warning_until: null })
    .lt("warning_until", now);

  if (error) {
    console.error("Error clearing expired warnings:", error);
    return false;
  }

  return true;
}

// ==================== WEEK RANGE HELPER ====================

function getWeekRange(weekOffset = 0) {
  const now = new Date();

  const day = now.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);
  sunday.setHours(0, 0, 0, 0);

  return { start: monday.toISOString(), end: sunday.toISOString() };
}

// ==================== PERCENTAGE CALCULATOR ====================

export function calculatePercentage(current, previous) {
  if (!previous || previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 10).toFixed(1));
}

// ==================== WEEKLY USERS ====================

export async function getThisWeekUsersCount() {
  const { start, end } = getWeekRange(0);

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) {
    console.error("Error fetching this week users:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getLastWeekUsersCount() {
  const { start, end } = getWeekRange(-1);

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) {
    console.error("Error fetching last week users:", error);
    return 0;
  }

  return count ?? 0;
}

// ==================== WEEKLY VERIFIED USERS ====================

export async function getThisWeekVerifiedUsersCount() {
  const { start, end } = getWeekRange(0);

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", true)
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) {
    console.error("Error fetching this week verified:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getLastWeekVerifiedUsersCount() {
  const { start, end } = getWeekRange(-1);

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", true)
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) {
    console.error("Error fetching last week verified:", error);
    return 0;
  }

  return count ?? 0;
}

// ==================== WEEKLY ACTIVE USERS ====================

export async function getThisWeekActiveUsersCount() {
  const { start, end } = getWeekRange(0);

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("last_seen", start)
    .lt("last_seen", end);

  if (error) {
    console.error("Error fetching this week active:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getLastWeekActiveUsersCount() {
  const { start, end } = getWeekRange(-1);

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("last_seen", start)
    .lt("last_seen", end);

  if (error) {
    console.error("Error fetching last week active:", error);
    return 0;
  }

  return count ?? 0;
}

// ==================== WEEKLY PREMIUM USERS ====================

export async function getThisWeekPremiumUsersCount() {
  const { start, end } = getWeekRange(0);

  const { count, error } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) {
    console.error("Error fetching this week premium:", error);
    return 0;
  }

  return count ?? 0;
}

export async function getLastWeekPremiumUsersCount() {
  const { start, end } = getWeekRange(-1);

  const { count, error } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) {
    console.error("Error fetching last week premium:", error);
    return 0;
  }

  return count ?? 0;
}

// ==================== USERS LIST ====================

export async function getUsers(page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      nickname,
      phone,
      photos,
      created_at,
      last_seen,
      is_verified,
      is_suspended,
      suspended_until,
      age,
      gender,
      location,
      job,
      education,
      about
    `)
    .order("last_seen", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return (data ?? []).map((user) => {
    const lastSeenDate = user.last_seen ? new Date(user.last_seen) : null;
    const isActive = lastSeenDate && lastSeenDate >= sevenDaysAgo;

    let isSuspended = user.is_suspended;
    const suspendedUntil = user.suspended_until
      ? new Date(user.suspended_until)
      : null;

    if (isSuspended && suspendedUntil && suspendedUntil <= now) {
      supabase
        .from("users")
        .update({
          is_suspended: false,
          suspended_until: null,
        })
        .eq("id", user.id)
        .then(() => {
          console.log(`Auto-reactivated user ${user.id}`);
        });

      isSuspended = false;
    }

    return {
      id: user.id,
      nickname: user.nickname,
      email: user.phone,
      photos: user.photos,
      created_at: user.created_at,
      last_seen: user.last_seen,
      verified: user.is_verified,
      is_suspended: isSuspended,
      suspended_until: user.suspended_until,
      subscription: "free",
      age: user.age,
      gender: user.gender,
      location: user.location,
      job: user.job,
      education: user.education,
      about: user.about,
      status: isSuspended ? "SUSPENDED" : isActive ? "ACTIVE" : "INACTIVE",
      last_active: user.last_seen
        ? new Date(user.last_seen).toLocaleDateString()
        : "—",
    };
  });
}

// ==================== REPORTS ====================

export async function getAllReports() {
  const { data, error } = await supabase
    .from("user_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reports FULL:", error);
    return [];
  }

  return data ?? [];
}
