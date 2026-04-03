/**
 * ============================================================
 * Finova Pro — Finance Dashboard UI
 * Frontend Developer Intern Assignment Submission
 * ============================================================
 * Author       : Niranjan NN
 * GitHub       : https://github.com/NiranjanNN
 * Stack        : React 18 + Vite + Tailwind CSS + Recharts
 * Entry Point  : src/App.jsx
 *
 * Assignment Requirements Met (all in this file + /components):
 *   [REQ-1] Dashboard Overview   → KPI cards + Area chart + Pie chart + table preview
 *   [REQ-2] Transactions Section → searchable, filterable ledger with date/amount/category/type
 *   [REQ-3] Role-Based UI        → Admin (full CRUD) vs Viewer (read + export only)
 *   [REQ-4] Insights Section     → category concentration, Smart Score, observations
 *   [REQ-5] State Management     → useState + useMemo; localStorage persistence
 *   [REQ-6] UI/UX               → responsive, dark/light, empty states, micro-animations
 *   [OPT]   Dark Mode            → sidebar toggle, theme token object (T)
 *   [OPT]   localStorage         → auto-saved on every transactions change
 *   [OPT]   CSV Export           → downloads filtered transactions as .csv
 *   [OPT]   Animations           → hover scale, animated progress bars, modal zoom-in
 * ============================================================
 */

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

// ─── Local module imports ────────────────────────────────────────────────────
import { CATEGORIES, CAT_COLORS, INITIAL_TRANSACTIONS, MONTHLY_TREND } from "./data/constants";
import Icon from "./components/Icon";
import StatCard from "./components/StatCard";
import TransactionCard from "./components/TransactionCard";
import TransactionModal from "./components/TransactionModal";
import InsightsPanel from "./components/InsightsPanel";

// ─── Utility: Format numbers to INR (₹) locale string ────────────────────────
export const fmt = (n) => "₹" + n.toLocaleString("en-IN");

// ─── Tab navigation config ────────────────────────────────────────────────────
const NAV_TABS = [
  { id: "dashboard",    icon: "dashboard",    label: "Overview"   },
  { id: "transactions", icon: "transactions", label: "History"    },
  { id: "insights",     icon: "insights",     label: "Analytics"  }
];

// ─── Page title map ───────────────────────────────────────────────────────────
const PAGE_TITLE = {
  dashboard:    "Financial Overview",
  transactions: "Transaction Ledger",
  insights:     "Market Insights"
};

/**
 * ─── MAIN APP COMPONENT ──────────────────────────────────────────────────────
 *
 * Manages global app state:
 *   - dark         → theme toggle
 *   - role         → 'admin' | 'viewer' (controls edit/delete access)
 *   - activeTab    → current page view
 *   - transactions → core data array (persisted to localStorage)
 *   - modal        → null | 'add' | { edit: transaction }
 *   - search/filterType → transaction list filters
 */
export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [dark, setDark]               = useState(true);
  const [role, setRole]               = useState("admin"); // 'admin' | 'viewer'
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [activeTab, setActiveTab]     = useState("dashboard");
  const [search, setSearch]           = useState("");
  const [filterType, setFilterType]   = useState("all");
  const [modal, setModal]             = useState(null); // null | 'add' | { edit: tx }

  // Load transactions from localStorage on mount; fall back to seed data
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("finova_tx");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const roleDropdownRef = useRef(null);

  // ── Side Effects ──────────────────────────────────────────────────────────
  // Persist transactions array to localStorage on every update
  useEffect(() => {
    localStorage.setItem("finova_tx", JSON.stringify(transactions));
  }, [transactions]);

  // Close role dropdown when user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Derived / Memoized State ──────────────────────────────────────────────
  const isAdmin = role === "admin";

  // Aggregate income, expense, and net balance from all transactions
  const totals = useMemo(() => {
    const income  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  // Build category breakdown for the Pie chart (expenses only)
  const categoryData = useMemo(() => {
    const map = {};
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Apply search and type filters, then sort newest-first
  const filteredTx = useMemo(() => {
    return transactions
      .filter(t => {
        const matchSearch = t.desc.toLowerCase().includes(search.toLowerCase())
                         || t.category.toLowerCase().includes(search.toLowerCase());
        const matchType   = filterType === "all" || t.type === filterType;
        return matchSearch && matchType;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, search, filterType]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  /** Save (add or edit) a transaction from the modal form */
  const handleSave = (tx) => {
    if (modal?.edit) {
      setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t));
    } else {
      setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev]);
    }
    setModal(null);
  };

  /** Delete a transaction by ID — admin-only guard */
  const deleteTx = (id) => {
    if (!isAdmin) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  /** Export the currently filtered transactions as a CSV file */
  const exportCSV = () => {
    const headers = ["Date,Description,Category,Type,Amount"];
    const rows    = filteredTx.map(t => `${t.date},"${t.desc}",${t.category},${t.type},${t.amount}`);
    const blob    = new Blob([[headers, ...rows].join("\n")], { type: "text/csv" });
    const url     = window.URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href        = url;
    a.download    = "finova_report.csv";
    a.click();
  };

  // ── Theme Constants ───────────────────────────────────────────────────────
  // Centralised token object passed to child components for consistent theming
  const T = {
    bg:          dark ? "#0a0c10"                   : "#f4f7fa",
    surface:     dark ? "rgba(23, 27, 34, 0.8)"    : "rgba(255, 255, 255, 0.85)",
    border:      dark ? "rgba(255,255,255,0.08)"   : "rgba(0,0,0,0.15)",
    text:        dark ? "#f0f2f5"                  : "#1a1f26",
    muted:       dark ? "#8b949e"                  : "#6e7781",
    accent:      "#6366f1",
    success:     "#10b981",
    danger:      "#ef4444",
    dropdownBg:  dark ? "#1c2128"                  : "#ffffff",
    dropdownHover: dark ? "#2d333b"                : "#f3f4f6"
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Font import */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* ── SIDEBAR (desktop only) ─────────────────────────────────────────── */}
      <aside
        className="fixed left-0 top-0 h-full w-64 hidden md:flex flex-col p-6 border-r transition-all"
        style={{ backgroundColor: dark ? "#0d1117" : "#fff", borderColor: T.border }}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Icon name="wallet" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Finova<span className="text-indigo-500">Pro</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-2">
          {NAV_TABS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-gray-500/10 text-gray-500"
              }`}
              style={activeTab === item.id ? { boxShadow: "0 10px 15px -3px rgba(99,102,241,0.3)" } : {}}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer — Role Switcher + Theme Toggle */}
        <div className="mt-auto space-y-4 pt-6 border-t" style={{ borderColor: T.border }}>

          {/* Role Switcher Dropdown */}
          <div className="px-2" ref={roleDropdownRef}>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Access Role
            </label>
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="w-full flex items-center gap-3 pl-3 pr-3 py-2 text-sm font-semibold border rounded-xl transition-all hover:border-indigo-500/50"
                style={{ borderColor: T.border, backgroundColor: T.dropdownBg, color: T.text }}
              >
                <div className="opacity-60">
                  <Icon name={role === "admin" ? "shield" : "user"} size={14} />
                </div>
                <span className="flex-1 text-left">{role === "admin" ? "Administrator" : "Viewer Mode"}</span>
                <div className={`transition-transform duration-200 ${roleMenuOpen ? "rotate-180" : ""}`}>
                  <Icon name="chevron" size={12} />
                </div>
              </button>

              {/* Dropdown popup */}
              {roleMenuOpen && (
                <div
                  className="absolute bottom-full mb-2 left-0 w-full rounded-xl border shadow-2xl overflow-hidden z-50"
                  style={{ backgroundColor: T.dropdownBg, borderColor: T.border }}
                >
                  {[
                    { id: "admin",  label: "Administrator", icon: "shield" },
                    { id: "viewer", label: "Viewer Mode",   icon: "user"   }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setRole(opt.id); setRoleMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left"
                      style={{
                        color:           role === opt.id ? T.accent : T.text,
                        backgroundColor: role === opt.id ? T.dropdownHover : "transparent"
                      }}
                    >
                      <Icon name={opt.icon} size={14} />
                      {opt.label}
                      {role === opt.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all"
            style={{ borderColor: T.border, backgroundColor: dark ? "#161b22" : "#f6f8fa" }}
          >
            <span className="text-sm font-medium">{dark ? "Light Mode" : "Dark Mode"}</span>
            <Icon name={dark ? "sun" : "moon"} size={16} />
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main className="md:ml-64 p-4 md:p-8 min-h-screen">

        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{PAGE_TITLE[activeTab]}</h1>
            <p className="text-sm opacity-60 mt-1">
              Welcome back. You are viewing as{" "}
              <span className="font-bold text-indigo-500 uppercase">{role}</span>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* CSV Export — available to all roles */}
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl border font-medium flex items-center gap-2 hover:opacity-80 transition-all"
              style={{ borderColor: T.border, backgroundColor: T.surface }}
            >
              <Icon name="export" size={16} />
              Export .CSV
            </button>
            {/* Add Record — admin only */}
            {isAdmin && (
              <button
                onClick={() => setModal("add")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Icon name="plus" size={16} />
                Add Record
              </button>
            )}
          </div>
        </header>

        {/* ── PAGE VIEWS ──────────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* ──── DASHBOARD VIEW ──────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <>
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Liquidity", val: totals.balance,  icon: "wallet",   color: T.accent,   desc: "Cash & equivalents" },
                  { label: "Active Income",   val: totals.income,   icon: "plus",     color: T.success,  desc: "Total earnings this month" },
                  { label: "Cash Outflow",    val: totals.expense,  icon: "trash",    color: T.danger,   desc: "Spent across all categories" },
                  {
                    label: "Saving Yield",
                    val: totals.income > 0 ? ((totals.balance / totals.income) * 100).toFixed(1) + "%" : "0%",
                    icon: "insights",
                    color: "#f59e0b",
                    desc: "Of total income saved"
                  }
                ].map((stat, i) => (
                  <StatCard key={i} stat={stat} T={T} fmt={fmt} />
                ))}
              </div>

              {/* Charts Grid — Area chart + Donut pie */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 6-month Income vs Expense area chart */}
                <div
                  className="lg:col-span-2 p-6 rounded-3xl border h-[400px]"
                  style={{ backgroundColor: T.surface, borderColor: T.border }}
                >
                  <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                    Flow Analytics
                    <span className="text-xs font-normal opacity-50">Last 6 Months (₹k)</span>
                  </h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={MONTHLY_TREND}>
                      <defs>
                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={T.success} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={T.success} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={T.danger} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={T.danger} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.border} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: T.muted, fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: T.muted, fontSize: 11 }} tickFormatter={v => (v / 1000) + "k"} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px", border: "none",
                          backgroundColor: dark ? "#161b22" : "#fff",
                          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
                        }}
                      />
                      <Area type="monotone" dataKey="income"  stroke={T.success} strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                      <Area type="monotone" dataKey="expense" stroke={T.danger}  strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" strokeDasharray="6 6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Expense allocation donut chart */}
                <div
                  className="p-6 rounded-3xl border h-[400px] flex flex-col"
                  style={{ backgroundColor: T.surface, borderColor: T.border }}
                >
                  <h3 className="text-lg font-bold mb-4">Allocation</h3>
                  <div className="flex-1 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData.slice(0, 5)}
                          innerRadius={60} outerRadius={90}
                          paddingAngle={8} dataKey="value" stroke="none"
                        >
                          {categoryData.slice(0, 5).map((entry, index) => (
                            <Cell key={index} fill={CAT_COLORS[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center label overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="text-xs opacity-50 uppercase font-bold">Top Expense</div>
                      <div className="text-lg font-bold" style={{ color: CAT_COLORS[categoryData[0]?.name] }}>
                        {categoryData[0]?.name}
                      </div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {categoryData.slice(0, 4).map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CAT_COLORS[c.name] }} />
                        <span className="opacity-70 truncate">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Transactions preview table */}
              <div className="p-6 rounded-3xl border" style={{ backgroundColor: T.surface, borderColor: T.border }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Recent Movements</h3>
                  <button
                    onClick={() => setActiveTab("transactions")}
                    className="text-sm font-bold text-indigo-500 hover:underline underline-offset-4"
                  >
                    Browse All Activity
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest opacity-40">
                        <th className="pb-4 font-bold">Merchant / Description</th>
                        <th className="pb-4 font-bold">Category</th>
                        <th className="pb-4 font-bold">Date</th>
                        <th className="pb-4 font-bold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 4).map((t, i) => (
                        <tr key={i} className="group hover:bg-gray-500/5 transition-colors">
                          <td className="py-4 font-medium flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: (CAT_COLORS[t.category] || T.accent) + "20", color: CAT_COLORS[t.category] || T.accent }}
                            >
                              {t.category[0]}
                            </div>
                            {t.desc}
                          </td>
                          <td className="py-4">
                            <span
                              className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider"
                              style={{ backgroundColor: (CAT_COLORS[t.category] || T.accent) + "10", color: CAT_COLORS[t.category] || T.accent }}
                            >
                              {t.category}
                            </span>
                          </td>
                          <td className="py-4 text-sm opacity-60">{t.date}</td>
                          <td className={`py-4 text-right font-bold ${t.type === "income" ? "text-green-500" : ""}`}>
                            {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ──── TRANSACTIONS VIEW ───────────────────────────────────────── */}
          {activeTab === "transactions" && (
            <div className="space-y-4">

              {/* Search + Filter Bar */}
              <div
                className="flex flex-wrap items-center gap-4 p-4 rounded-2xl border"
                style={{ backgroundColor: T.surface, borderColor: T.border }}
              >
                <div className="flex-1 min-w-[200px] relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40">
                    <Icon name="search" size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by merchant or tag..."
                    className="w-full bg-transparent border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ring-indigo-500/20"
                    style={{ borderColor: T.border }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="bg-transparent border rounded-xl px-4 py-2 text-sm focus:outline-none"
                  style={{ borderColor: T.border }}
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  <option value="all">All Flow Types</option>
                  <option value="income">Credits Only</option>
                  <option value="expense">Debits Only</option>
                </select>
              </div>

              {/* Transaction list */}
              <div className="grid grid-cols-1 gap-3">
                {filteredTx.length > 0 ? (
                  filteredTx.map(t => (
                    <TransactionCard
                      key={t.id}
                      t={t}
                      isAdmin={isAdmin}
                      T={T}
                      fmt={fmt}
                      onEdit={() => setModal({ edit: t })}
                      onDelete={() => deleteTx(t.id)}
                    />
                  ))
                ) : (
                  <div className="py-20 text-center opacity-40">
                    <div className="text-4xl mb-4">📂</div>
                    <div className="font-bold">No Records Found</div>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ──── INSIGHTS VIEW ───────────────────────────────────────────── */}
          {activeTab === "insights" && (
            <InsightsPanel
              categoryData={categoryData}
              totals={totals}
              T={T}
              fmt={fmt}
            />
          )}
        </div>
      </main>

      {/* ── TRANSACTION MODAL (Add / Edit) ────────────────────────────────── */}
      {modal && (
        <TransactionModal
          modal={modal}
          dark={dark}
          T={T}
          onClose={() => setModal(null)}
          onSave={handleSave}
          CATEGORIES={CATEGORIES}
        />
      )}

      {/* ── MOBILE FLOATING BOTTOM NAV ────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl z-40">
        {NAV_TABS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
              activeTab === item.id ? "bg-indigo-600 text-white" : "text-white/40"
            }`}
          >
            <Icon name={item.icon} size={20} />
          </button>
        ))}
      </nav>
    </div>
  );
}
