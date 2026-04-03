/**
 * ============================================================
 * src/components/TransactionModal.jsx
 * ============================================================
 * Full-screen overlay modal for adding or editing a transaction.
 * Controlled by App.jsx via the `modal` state:
 *   - modal === 'add'         → shows empty form (new record)
 *   - modal === { edit: tx }  → pre-fills form with tx data
 *
 * Props:
 *   modal       {string|object} — 'add' or { edit: tx }
 *   dark        {boolean}       — current theme
 *   T           {object}        — theme token object
 *   onClose     {fn}            — close modal without saving
 *   onSave      {fn}            — called with the new/updated tx object
 *   CATEGORIES  {string[]}      — list of valid category strings
 *
 * Note:
 *   This component uses a native HTML <form> with onSubmit.
 *   FormData is used to read field values — avoids controlled
 *   state for each field, keeping the component simple.
 * ============================================================
 */

const TransactionModal = ({ modal, dark, T, onClose, onSave, CATEGORIES }) => {
  const isEdit = Boolean(modal?.edit);

  /** Build the transaction object from the form submission event */
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    onSave({
      id:       modal.edit?.id,         // preserve ID when editing
      desc:     data.get("desc"),
      amount:   Number(data.get("amount")),
      category: data.get("category"),
      type:     data.get("type"),
      date:     data.get("date")
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — click to dismiss */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-md p-8 rounded-[32px] border shadow-2xl"
        style={{ backgroundColor: dark ? "#161b22" : "#fff", borderColor: T.border }}
      >
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Modify Record" : "New Transaction"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
              Merchant / Description
            </label>
            <input
              required
              name="desc"
              defaultValue={modal.edit?.desc}
              className="w-full bg-transparent border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-indigo-500/20"
              style={{ borderColor: T.border }}
            />
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                Amount (₹)
              </label>
              <input
                required
                name="amount"
                type="number"
                min="1"
                defaultValue={modal.edit?.amount}
                className="w-full bg-transparent border rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{ borderColor: T.border }}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                Date
              </label>
              <input
                required
                name="date"
                type="date"
                defaultValue={modal.edit?.date || new Date().toISOString().split("T")[0]}
                className="w-full bg-transparent border rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{ borderColor: T.border }}
              />
            </div>
          </div>

          {/* Category + Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                Category
              </label>
              <select
                name="category"
                defaultValue={modal.edit?.category || "Food"}
                className="w-full bg-transparent border rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{ borderColor: T.border }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                Type
              </label>
              <select
                name="type"
                defaultValue={modal.edit?.type || "expense"}
                className="w-full bg-transparent border rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{ borderColor: T.border }}
              >
                <option value="expense">Debit (Expense)</option>
                <option value="income">Credit (Income)</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold opacity-50 hover:opacity-100 transition-opacity"
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20"
            >
              {isEdit ? "Apply Changes" : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
