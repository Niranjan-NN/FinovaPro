# 💳 Finova Pro — Finance Dashboard UI

> **Frontend Developer Intern Assignment Submission**
> Built with **React 18 · Vite · Tailwind CSS · Recharts**

---

## 📌 Assignment Compliance Checklist

| Requirement | Status | Notes |
|---|:---:|---|
| Dashboard Overview (summary cards) | ✅ | Balance, Income, Expense, Saving Yield |
| Time-based visualization | ✅ | 6-month Area chart (Income vs Expense) |
| Categorical visualization | ✅ | Donut Pie chart — spending by category |
| Transactions list with date/amount/category/type | ✅ | Full ledger view |
| Search / Filter | ✅ | Text search + type filter (All / Credits / Debits) |
| Role-Based UI (Admin vs Viewer) | ✅ | Sidebar dropdown switcher |
| Insights section | ✅ | Concentration bars, Smart Score, observations |
| State management | ✅ | React useState + useMemo + localStorage |
| Responsive design | ✅ | Sidebar on desktop, floating nav on mobile |
| Empty / no-data state handling | ✅ | Illustrated empty state in Transactions view |
| Dark mode (optional) | ✅ | Persistent toggle in sidebar |
| localStorage persistence (optional) | ✅ | Auto-saved on every transaction change |
| CSV export (optional) | ✅ | Exports currently filtered transactions |
| Animations / transitions (optional) | ✅ | Hover, scale, fade, animated progress bars |

---

## 🗂️ Project Folder Structure

```
finova-pro/
│
├── index.html                    # Vite HTML shell — mounts React onto #root
├── package.json                  # All dependencies & npm scripts
├── vite.config.js                # Vite build config + React plugin
├── tailwind.config.js            # Tailwind theme extensions & content paths
├── postcss.config.js             # PostCSS: Tailwind + Autoprefixer
├── .gitignore
├── README.md                     # ← You are here
│
└── src/
    ├── main.jsx                  # App entry — ReactDOM.createRoot
    ├── App.jsx                   # Root component — owns ALL global state
    ├── index.css                 # Tailwind directives + global resets + scrollbar
    │
    ├── data/
    │   └── constants.js          # CATEGORIES, CAT_COLORS, seed transactions, monthly chart data
    │
    └── components/
        ├── Icon.jsx              # Inline SVG icon registry (zero external icon dependency)
        ├── StatCard.jsx          # KPI summary card used on Dashboard
        ├── TransactionCard.jsx   # Single transaction row with admin actions
        ├── TransactionModal.jsx  # Add / Edit modal overlay (Admin only)
        └── InsightsPanel.jsx     # Analytics / Insights full-page view
```

---

## 🚀 Setup & Running Locally

### Prerequisites
- **Node.js** >= 18.x — https://nodejs.org
- **npm** >= 9.x (bundled with Node)

### Steps

```bash
# 1. Unzip and enter the project
unzip finova-pro.zip
cd finova-pro

# 2. Install all dependencies
npm install

# 3. Start dev server — auto-opens at http://localhost:5173
npm run dev

# 4. Production build (outputs to /dist)
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 🏗️ Architecture & Approach

### State Management Strategy

All state lives in `App.jsx`. React's built-in `useState` and `useMemo` handle
everything cleanly without needing Redux, Zustand, or Context. The data flow is
strictly top-down (props), keeping each component predictable and easy to reason about.

| State variable | Type | Purpose |
|---|---|---|
| `transactions` | array | Core data — persisted to localStorage |
| `dark` | boolean | Theme toggle (dark / light) |
| `role` | string | `'admin'` or `'viewer'` — drives RBAC |
| `activeTab` | string | Current page: dashboard / transactions / insights |
| `modal` | null / string / object | Controls Add (`'add'`) or Edit (`{ edit: tx }`) modal |
| `search` | string | Live search filter for transaction list |
| `filterType` | string | `'all'` / `'income'` / `'expense'` filter |

Derived values (`totals`, `categoryData`, `filteredTx`) are computed with `useMemo`
so they only recalculate when their dependencies change — no unnecessary re-renders.

### Component Architecture

```
App.jsx  (state owner)
  ├── StatCard          ← totals + theme tokens
  ├── TransactionCard   ← single tx + edit/delete handlers + isAdmin flag
  ├── TransactionModal  ← modal state + onSave + CATEGORIES list
  └── InsightsPanel     ← categoryData + totals + theme tokens
```

Every component is a pure presentational unit. Business logic and state mutations
stay in App.jsx. Components only call handler functions passed as props.

---

## 🔐 Role-Based UI (RBAC Simulation)

Switch roles using the **Access Role** dropdown at the bottom of the sidebar.
No backend or session logic — this is a pure UI simulation as per assignment spec.

| Feature | 👁 Viewer | 🛡 Admin |
|---|:---:|:---:|
| View dashboard, charts, KPI cards | ✅ | ✅ |
| Browse full transaction history | ✅ | ✅ |
| Search and filter transactions | ✅ | ✅ |
| View Insights / Analytics | ✅ | ✅ |
| Export CSV | ✅ | ✅ |
| **Add new transaction** | ❌ | ✅ |
| **Edit existing transaction** | ❌ | ✅ |
| **Delete transaction** | ❌ | ✅ |

Implementation: the `isAdmin` boolean (`role === 'admin'`) gates:
- The "Add Record" button in the page header
- The Edit + Delete hover-action buttons on each TransactionCard
- The TransactionModal is only reachable through those gated buttons

---

## 📊 Features Walkthrough

### 1 — Dashboard Overview
- **4 KPI cards**: Total Liquidity (net balance), Active Income, Cash Outflow, Saving Yield %
- **6-month Area chart**: Income vs Expense trend with SVG gradient fills (Recharts AreaChart)
- **Donut Pie chart**: Top 5 expense categories; center label shows highest spend category
- **Recent Movements table**: 4 latest transactions with a "Browse All" shortcut

### 2 — Transaction Ledger
- Full list sorted newest-first
- Live **text search** across description and category
- **Type filter**: All / Credits Only / Debits Only
- Admin hover actions: Edit opens pre-filled modal; Delete removes immediately
- **Empty state**: illustrated fallback (📂) when no results match the filter

### 3 — Insights & Analytics
- **Spending Concentration**: animated progress bar per category showing ₹ value and % of total spend
- **Smart Score**: 84/100 financial health index with a context-aware tip (uses top expense category name)
- **Efficiency Observations**: income growth notice + category-specific spending alert

### 4 — UI/UX Details
- Dark → Light → Dark theme toggle with 500ms CSS transition
- Card hover: scale + shadow elevation
- Progress bars animate width on mount (CSS transition-all duration-1000)
- Mobile: floating pill-shaped bottom nav with blur backdrop
- Custom indigo scrollbar on webkit browsers
- Tooltip style matches active theme (dark bg / light bg)

---

## 🎨 Tech Stack

| Layer | Technology | Why chosen |
|---|---|---|
| Framework | React 18 | Hooks model, huge ecosystem |
| Build tool | Vite 5 | Sub-second HMR, fast cold start |
| Styling | Tailwind CSS 3 | Utility-first, no context-switching |
| Charts | Recharts 2 | Composable React-native chart components |
| Icons | Custom inline SVG | Zero dependency, inherits CSS color |
| Font | DM Sans via Google Fonts | Clean, modern, non-generic choice |
| Persistence | Browser localStorage | Simple, no backend required |

---

## 🔧 How to Customise

### Add a New Spending Category
```js
// src/data/constants.js
export const CATEGORIES = [..., "Utilities"];
export const CAT_COLORS = { ..., Utilities: "#64748b" };
```

### Edit Seed / Demo Data
Modify `INITIAL_TRANSACTIONS` in `src/data/constants.js`:
```js
{
  id:       1,              // unique integer
  date:     "2026-03-01",  // YYYY-MM-DD
  desc:     "March Salary",
  amount:   85000,          // INR, integer
  category: "Salary",       // must exist in CATEGORIES array
  type:     "income"        // "income" | "expense"
}
```

### Reset to Default Data
DevTools → Application → Local Storage → delete key `finova_tx` → refresh.

### Connect to a Real API
Replace the localStorage init in `App.jsx`:
```js
useEffect(() => {
  fetch("/api/transactions")
    .then(r => r.json())
    .then(data => setTransactions(data));
}, []);
```

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|---|---|
| < 768px (mobile) | Sidebar hidden · Floating bottom nav |
| ≥ 768px (md+) | Fixed 256px sidebar · `ml-64` main content |
| KPI grid | 1 col → 2 col (sm) → 4 col (lg) |
| Chart grid | 1 col → 3 col (lg, 2:1 split) |
| Insights grid | 1 col → 2 col (md) → 3 col (lg, 2:1 split) |

---

## 📤 CSV Export

"Export .CSV" downloads `finova_report.csv` of the **currently filtered** list.
If search or type filter is active, only matching rows are exported.

```
Date,Description,Category,Type,Amount
2026-03-01,"March Salary",Salary,income,85000
2026-03-02,"Apartment Rent",Housing,expense,18000
...
```

---

## 💾 Data Persistence

`localStorage` key: `finova_tx`
A `useEffect` writes the full transactions array to localStorage on every change.
On mount, the app reads from localStorage first; falls back to `INITIAL_TRANSACTIONS`
seed data if no saved key exists (first run).

---

## 🤔 Assumptions

1. No backend required — all data is client-side with localStorage as persistence layer.
2. The Smart Score (84/100) is illustrative. In production it would be computed
   from real saving rate, spending consistency, and debt ratios.
3. Monthly Trend chart uses static 6-month aggregates from `constants.js`.
   In production these would be derived dynamically from the transactions array.
4. Role switching is a UI-only simulation — no authentication or JWT is implemented.

---

## 📝 Optional Enhancements Implemented

- ✅ **Dark mode** — system-style toggle, applied via inline style tokens
- ✅ **localStorage persistence** — survives page refresh
- ✅ **CSV export** — filtered export with one click
- ✅ **Animations** — hover micro-interactions, animated progress bars, modal zoom-in
- ✅ **Advanced filtering** — combined text search + type filter working together

---

## 👤 Submission Details

**Name**: Niranjan NN
**GitHub**: https://github.com/NiranjanNN
**LinkedIn**: https://linkedin.com/in/niranjan-nn

Submitted for: Frontend Developer Intern Assignment
