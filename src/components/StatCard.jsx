/**
 * ============================================================
 * src/components/StatCard.jsx
 * ============================================================
 * Reusable KPI card displayed in a 4-column grid on the
 * Dashboard Overview page.
 *
 * Props:
 *   stat  {object} — { label, val, icon, color, desc }
 *   T     {object} — theme token object from App
 *   fmt   {fn}     — INR formatter function
 * ============================================================
 */

import Icon from "./Icon";

const StatCard = ({ stat, T, fmt }) => (
  <div
    className="p-6 rounded-3xl border relative overflow-hidden transition-all hover:shadow-xl group"
    style={{ backgroundColor: T.surface, borderColor: T.border }}
  >
    {/* Decorative background circle — fades in on hover */}
    <div
      className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-110 transition-transform"
      style={{ backgroundColor: stat.color }}
    />

    {/* Icon badge */}
    <div className="flex items-center justify-between mb-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: stat.color + "15", color: stat.color }}
      >
        <Icon name={stat.icon} size={20} />
      </div>
    </div>

    {/* Primary value */}
    <div className="text-2xl font-bold">
      {typeof stat.val === "number" ? fmt(stat.val) : stat.val}
    </div>

    {/* Label */}
    <div className="text-xs font-bold uppercase tracking-widest mt-1 opacity-50">
      {stat.label}
    </div>

    {/* Subtitle */}
    <div className="text-[10px] mt-3 opacity-40 italic">{stat.desc}</div>
  </div>
);

export default StatCard;
