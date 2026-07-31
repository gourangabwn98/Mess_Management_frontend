import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Card, EmptyState } from "./ui";
import { fmtINR, monthLabel, todayISO } from "../utils";
import { expensesApi } from "../api";

const CATEGORIES = [
  "Groceries", "Vegetables", "Gas/Fuel", "Milk & Dairy",
  "Cook/Staff wages", "Utensils & Cleaning", "Electricity/Water", "Other",
];

export default function ExpensesTab({ month }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");

  const load = () => {
    setLoading(true);
    expensesApi.list({ month }).then(setExpenses).finally(() => setLoading(false));
  };
  useEffect(load, [month]);

  const submit = async (e) => {
    e.preventDefault();
    if (!amount) return;
    await expensesApi.create({ category, amount: Number(amount), date, note: note.trim(), month });
    setAmount("");
    setNote("");
    load();
  };

  const startEdit = (ex) => {
    setEditingId(ex._id);
    setEditCategory(ex.category);
    setEditAmount(String(ex.amount));
    setEditDate(ex.date);
    setEditNote(ex.note || "");
  };
  const saveEdit = async (id) => {
    await expensesApi.update(id, { category: editCategory, amount: Number(editAmount), date: editDate, note: editNote.trim() });
    setEditingId(null);
    load();
  };
  const remove = async (id) => {
    await expensesApi.remove(id);
    load();
  };

  const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="font-display text-lg font-semibold mb-3 text-ink">
          Log an expense — {monthLabel(month)}
        </div>
        <form onSubmit={submit} className="grid sm:grid-cols-4 gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="font-body text-sm px-3 py-2 rounded border border-border bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount ₹"
            className="font-body text-sm px-3 py-2 rounded border border-border bg-white"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="font-body text-sm px-3 py-2 rounded border border-border bg-white"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="font-body text-sm px-3 py-2 rounded border border-border bg-white"
          />
          <button
            type="submit"
            className="sm:col-span-4 flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-ink text-paper text-sm font-medium font-body hover:bg-inkSoft"
          >
            <Plus size={16} /> Add expense
          </button>
        </form>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-display text-lg font-semibold text-ink">
            Expenses this month ({expenses.length})
          </div>
          <div className="font-num text-sm text-rule">₹{fmtINR(total)}</div>
        </div>
        {loading ? (
          <div className="text-muted font-body text-sm py-6 text-center">Loading…</div>
        ) : expenses.length === 0 ? (
          <EmptyState text="No expenses logged for this month yet." />
        ) : (
          <ul className="divide-y divide-dashed divide-divider">
            {expenses.map((ex) => (
              <li key={ex._id} className="py-3">
                {editingId === ex._id ? (
                  <div className="grid sm:grid-cols-5 gap-2 items-center">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="font-body text-sm px-2 py-1.5 rounded border border-border bg-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="font-body text-sm px-2 py-1.5 rounded border border-border bg-white"
                    />
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="font-body text-sm px-2 py-1.5 rounded border border-border bg-white"
                    />
                    <input
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="font-body text-sm px-2 py-1.5 rounded border border-border bg-white"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(ex._id)} className="p-1.5 rounded bg-good text-white"><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded bg-hover"><X size={14} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-body text-sm font-medium text-ink">{ex.category}</div>
                      <div className="font-body text-xs text-muted">
                        {ex.date}{ex.note ? ` · ${ex.note}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-num text-sm text-rule">₹{fmtINR(ex.amount)}</div>
                      <button onClick={() => startEdit(ex)} className="p-1.5 rounded hover:bg-hover"><Pencil size={14} /></button>
                      <button onClick={() => remove(ex._id)} className="p-1.5 rounded hover:bg-red-100 text-rule"><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
