/**
 * ============================================================
 * src/data/constants.js
 * ============================================================
 * Central store for all static data used across the app:
 *  - CATEGORIES    → list of valid transaction categories
 *  - CAT_COLORS    → colour mapping for each category
 *  - INITIAL_TRANSACTIONS → seed data loaded on first run
 *  - MONTHLY_TREND → last 6 months aggregate data for charts
 * ============================================================
 */

// ─── Transaction Categories ───────────────────────────────────────────────────
// Used in the Add/Edit modal's category dropdown and throughout charts/filters
export const CATEGORIES = [
  "Food", "Transport", "Shopping", "Housing",
  "Health", "Entertainment", "Freelance", "Salary", "Investment"
];

// ─── Category Colour Map ─────────────────────────────────────────────────────
// Each category maps to a distinct hex colour used in Pie charts, badges, etc.
export const CAT_COLORS = {
  Food:          "#f97316",
  Transport:     "#3b82f6",
  Shopping:      "#a855f7",
  Housing:       "#ec4899",
  Health:        "#10b981",
  Entertainment: "#f59e0b",
  Freelance:     "#06b6d4",
  Salary:        "#22c55e",
  Investment:    "#6366f1"
};

// ─── Seed Transactions ───────────────────────────────────────────────────────
// Shown on first load before any user data is stored in localStorage.
// All amounts are in Indian Rupees (₹).
export const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2026-03-01", desc: "March Salary",       amount: 85000, category: "Salary",        type: "income"  },
  { id: 2,  date: "2026-03-02", desc: "Apartment Rent",     amount: 18000, category: "Housing",       type: "expense" },
  { id: 3,  date: "2026-03-04", desc: "Grocery Store",      amount: 3200,  category: "Food",          type: "expense" },
  { id: 4,  date: "2026-03-05", desc: "Uber Rides",         amount: 850,   category: "Transport",     type: "expense" },
  { id: 5,  date: "2026-03-07", desc: "Freelance Project",  amount: 22000, category: "Freelance",     type: "income"  },
  { id: 6,  date: "2026-03-09", desc: "Amazon Shopping",    amount: 4500,  category: "Shopping",      type: "expense" },
  { id: 7,  date: "2026-03-10", desc: "Subscription Bundle",amount: 1200,  category: "Entertainment", type: "expense" },
  { id: 8,  date: "2026-03-12", desc: "Health Checkup",     amount: 2100,  category: "Health",        type: "expense" },
  { id: 9,  date: "2026-03-14", desc: "Bistro Dinner",      amount: 2800,  category: "Food",          type: "expense" },
  { id: 10, date: "2026-03-15", desc: "Stock Dividend",     amount: 5200,  category: "Investment",    type: "income"  },
  { id: 11, date: "2026-03-17", desc: "Fuel Refill",        amount: 1500,  category: "Transport",     type: "expense" },
  { id: 12, date: "2026-03-22", desc: "Gym Renewal",        amount: 2500,  category: "Health",        type: "expense" }
];

// ─── Monthly Trend Data ──────────────────────────────────────────────────────
// Pre-computed 6-month aggregate for the AreaChart on the Dashboard.
// Replace with API data in a production setup.
export const MONTHLY_TREND = [
  { month: "Oct", income: 95000,  expense: 42000 },
  { month: "Nov", income: 102000, expense: 48000 },
  { month: "Dec", income: 110000, expense: 62000 },
  { month: "Jan", income: 92000,  expense: 26400 },
  { month: "Feb", income: 111000, expense: 37600 },
  { month: "Mar", income: 127200, expense: 46350 }
];
