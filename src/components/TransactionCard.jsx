/**
 * ============================================================
 * src/components/TransactionCard.jsx
 * ============================================================
 * Renders a single transaction row on the History (Transactions)
 * page. Includes inline edit and delete actions for admin users.
 *
 * Props:
 *   t        {object}  — transaction object
 *   isAdmin  {boolean} — show/hide edit & delete buttons
 *   T        {object}  — theme token object from App
 *   fmt      {fn}      — INR formatter function
 *   onEdit   {fn}      — opens edit modal with this transaction
 *   onDelete {fn}      — removes this transaction from state
 * ============================================================
 */

import Icon from "./Icon";
import { CAT_COLORS } from "../data/constants";

const TransactionCard = ({ t, isAdmin, T, fmt, onEdit, onDelete }) => (
  <div
    className="p-4 rounded-2xl border flex items-center justify-between gap-4 group transition-all hover:scale-[1.005] hover:shadow-lg"
    style={{ backgroundColor: T.surface, borderColor: T.border }}
  >
    {/* Left: category avatar + description */}
    <div className="flex items-center gap-4">
      {/* Category initial badge */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold"
        style={{
          backgroundColor: (CAT_COLORS[t.category] || T.accent) + "15",
          color: CAT_COLORS[t.category] || T.accent
        }}
      >
        {t.category[0]}
      </div>

      {/* Description + meta */}
      <div>
        <div className="font-bold">{t.desc}</div>
        <div className="text-xs opacity-50 flex items-center gap-2">
          <span className="uppercase tracking-widest font-bold">{t.category}</span>
          <span>•</span>
          <span>{t.date}</span>
        </div>
      </div>
    </div>

    {/* Right: amount + admin actions */}
    <div className="flex items-center gap-6">
      {/* Amount — green for income, default for expense */}
      <div className={`text-lg font-bold text-right ${t.type === "income" ? "text-green-500" : ""}`}>
        {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
      </div>

      {/* Edit / Delete — only visible to admins, appear on hover */}
      {isAdmin && (
        <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-gray-500/10 transition-colors"
            title="Edit"
          >
            <Icon name="edit" size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
            title="Delete"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default TransactionCard;
