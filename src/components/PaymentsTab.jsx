import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Card, EmptyState } from "./ui";
import { fmtINR, monthLabel, todayISO } from "../utils";
import { paymentsApi } from "../api";

export default function PaymentsTab({ month, members }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");

  const load = () => {
    setLoading(true);
    paymentsApi.list({ month }).then(setPayments).finally(() => setLoading(false));
  };

  useEffect(load, [month]);

  useEffect(() => {
    if (members.length && !memberId) setMemberId(members[0]._id);
  }, [members, memberId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!memberId || !amount) return;
    await paymentsApi.create({ member: memberId, amount: Number(amount), date, note: note.trim(), month });
    setAmount("");
    setNote("");
    load();
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditAmount(String(p.amount));
    setEditDate(p.date);
    setEditNote(p.note || "");
  };
  const saveEdit = async (id) => {
    await paymentsApi.update(id, { amount: Number(editAmount), date: editDate, note: editNote.trim() });
    setEditingId(null);
    load();
  };
  const remove = async (id) => {
    await paymentsApi.remove(id);
    load();
  };

  const total = payments.reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="font-display text-lg font-semibold mb-3 text-ink">
          Record a payment — {monthLabel(month)}
        </div>
        {members.length === 0 ? (
          <EmptyState text="Add members first, then record what each person pays." />
        ) : (
          <form onSubmit={submit} className="grid sm:grid-cols-4 gap-2">
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="font-body text-sm px-3 py-2 rounded border border-border bg-white"
            >
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
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
              placeholder="Note — e.g. rent, food (optional)"
              className="font-body text-sm px-3 py-2 rounded border border-border bg-white"
            />
            <button
              type="submit"
              className="sm:col-span-4 flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-ink text-paper text-sm font-medium font-body hover:bg-inkSoft"
            >
              <Plus size={16} /> Add payment
            </button>
          </form>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-display text-lg font-semibold text-ink">
            Payments this month ({payments.length})
          </div>
          <div className="font-num text-sm text-good">₹{fmtINR(total)}</div>
        </div>
        {loading ? (
          <div className="text-muted font-body text-sm py-6 text-center">Loading…</div>
        ) : payments.length === 0 ? (
          <EmptyState text="No payments recorded for this month yet." />
        ) : (
          <ul className="divide-y divide-dashed divide-divider">
            {payments.map((p) => (
              <li key={p._id} className="py-3">
                {editingId === p._id ? (
                  <div className="grid sm:grid-cols-4 gap-2 items-center">
                    <div className="font-body text-sm font-medium text-ink">{p.member?.name || "—"}</div>
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
                    <div className="flex gap-2 items-center">
                      <input
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="flex-1 font-body text-sm px-2 py-1.5 rounded border border-border bg-white"
                      />
                      <button onClick={() => saveEdit(p._id)} className="p-1.5 rounded bg-good text-white"><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded bg-hover"><X size={14} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-body text-sm font-medium text-ink">{p.member?.name || "Unknown member"}</div>
                      <div className="font-body text-xs text-muted">
                        {p.date}{p.note ? ` · ${p.note}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-num text-sm text-good">₹{fmtINR(p.amount)}</div>
                      <button onClick={() => startEdit(p)} className="p-1.5 rounded hover:bg-hover"><Pencil size={14} /></button>
                      <button onClick={() => remove(p._id)} className="p-1.5 rounded hover:bg-red-100 text-rule"><Trash2 size={14} /></button>
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
