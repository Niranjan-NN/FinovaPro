/**
 * ============================================================
 * src/components/InsightsPanel.jsx
 * ============================================================
 * The full Analytics / Insights page view rendered when
 * activeTab === 'insights' in App.jsx.
 *
 * Sections:
 *   1. Spending Concentration — horizontal progress bars per category
 *   2. Smart Score card       — AI-style financial health score
 *   3. Efficiency Observation — income growth and spending alerts
 *
 * Props:
 *   categoryData {object[]} — [{ name, value }] sorted by spend desc
 *   totals       {object}   — { income, expense, balance }
 *   T            {object}   — theme token object
 *   fmt          {fn}       — INR formatter function
 * ============================================================
 */

import { CAT_COLORS } from "../data/constants";
import Icon from "./Icon";

const InsightsPanel = ({ categoryData, totals, T, fmt }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {/* ── Spending Concentration (full-width on large screens) ── */}
    <div
      className="p-6 rounded-3xl border lg:col-span-2"
      style={{ backgroundColor: T.surface, borderColor: T.border }}
    >
      <h3 className="text-lg font-bold mb-6">Spending Concentration</h3>
      <div className="space-y-6">
        {categoryData.map((c, i) => {
          // Percentage of total expense for this category
          const perc = ((c.value / totals.expense) * 100).toFixed(0);
          return (
            <div key={i}>
              {/* Label row */}
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CAT_COLORS[c.name] }} />
                  {c.name}
                </span>
                <span>
                  {fmt(c.value)}
                  <span className="opacity-40 ml-2">{perc}%</span>
                </span>
              </div>

              {/* Progress bar — animates in via CSS transition */}
              <div className="h-2.5 rounded-full overflow-hidden bg-gray-500/10">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: perc + "%", backgroundColor: CAT_COLORS[c.name] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* ── Right column — Score + Observations ─────────────────── */}
    <div className="space-y-6">

      {/* Smart Score card (indigo gradient) */}
      <div className="p-6 rounded-3xl border bg-indigo-600 text-white" style={{ borderColor: "transparent" }}>
        <h3 className="text-lg font-bold mb-2">Smart Score</h3>
        <p className="text-xs opacity-70 mb-6">Financial health index based on cashflow.</p>

        {/* Score value */}
        <div className="text-5xl font-black mb-4">
          84<span className="text-lg opacity-50">/100</span>
        </div>

        {/* AI tip based on top expense category */}
        <div className="text-sm font-medium p-3 rounded-xl bg-white/10 flex items-start gap-2">
          <div className="mt-1 flex-shrink-0">
            <Icon name="bulb" size={14} />
          </div>
          <span>
            Tip: Reduce your{" "}
            <span className="font-bold">{categoryData[0]?.name}</span>{" "}
            spending by 10% to hit your savings goal.
          </span>
        </div>
      </div>

      {/* Efficiency Observation panel */}
      <div
        className="p-6 rounded-3xl border"
        style={{ backgroundColor: T.surface, borderColor: T.border }}
      >
        <h3 className="text-sm font-bold opacity-50 uppercase tracking-widest mb-4">
          Efficiency Observation
        </h3>
        <div className="space-y-4">

          {/* Income growth alert */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
              <Icon name="trendUp" size={20} />
            </div>
            <div>
              <div className="text-sm font-bold">Income Growth</div>
              <p className="text-xs opacity-50">Your income grew 14% compared to February.</p>
            </div>
          </div>

          {/* Food spending alert */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
              <Icon name="food" size={20} />
            </div>
            <div>
              <div className="text-sm font-bold">Foodie Alert</div>
              <p className="text-xs opacity-50">Dining expenses are up by ₹2,400 this week.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);

export default InsightsPanel;
