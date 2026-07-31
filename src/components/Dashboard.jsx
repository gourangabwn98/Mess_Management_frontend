import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Card, StatCard, EmptyState } from "./ui";
import { fmtINR, monthLabel } from "../utils";
import { paymentsApi, expensesApi } from "../api";

export default function Dashboard({ month, members }) {
  const [monthPayments, setMonthPayments] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      paymentsApi.list({ month }),
      expensesApi.list({ month }),
      paymentsApi.list(),
      expensesApi.list(),
    ])
      .then(([mp, me, ap, ae]) => {
        if (cancelled) return;
        setMonthPayments(mp);
        setMonthExpenses(me);
        setAllPayments(ap);
        setAllExpenses(ae);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [month]);

  const collected = monthPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const spent = monthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const balance = collected - spent;
  const allTimeCollected = allPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const allTimeSpent = allExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  const paidMemberIds = new Set(monthPayments.map((p) => p.member?._id || p.member));
  const unpaidMembers = members.filter((m) => !paidMemberIds.has(m._id));

  const byCategory = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthExpenses]);

  if (loading) {
    return <div className="text-muted font-body text-sm py-10 text-center">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Collected this month" value={collected} tone="good" />
        <StatCard label="Spent this month" value={spent} tone="bad" />
        <StatCard label="Balance" value={balance} tone={balance >= 0 ? "good" : "bad"} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="font-display text-lg font-semibold mb-3 text-ink">
            Who hasn't paid — {monthLabel(month)}
          </div>
          {members.length === 0 ? (
            <EmptyState text="Add members first to track who's paid." />
          ) : unpaidMembers.length === 0 ? (
            <div className="text-sm text-good font-body flex items-center gap-2">
              <Check size={16} /> Everyone has paid this month.
            </div>
          ) : (
            <ul className="space-y-1.5">
              {unpaidMembers.map((m) => (
                <li
                  key={m._id}
                  className="flex items-center justify-between text-sm font-body border-b border-dashed border-divider py-1.5"
                >
                  <span className="text-ink">{m.name}</span>
                  <span className="text-rule text-xs uppercase tracking-wide font-medium">unpaid</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="font-display text-lg font-semibold mb-3 text-ink">Spend by category</div>
          {byCategory.length === 0 ? (
            <EmptyState text="No expenses logged for this month yet." />
          ) : (
            <ul className="space-y-2">
              {byCategory.map(([cat, amt]) => (
                <li key={cat} className="text-sm font-body">
                  <div className="flex justify-between mb-1 text-ink">
                    <span>{cat}</span>
                    <span className="font-num">₹{fmtINR(amt)}</span>
                  </div>
                  <div className="h-1.5 bg-hover rounded-full overflow-hidden">
                    <div
                      className="h-full bg-turmeric"
                      style={{ width: `${spent ? (amt / spent) * 100 : 0}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <div className="font-display text-lg font-semibold mb-3 text-ink">All-time totals</div>
        <div className="grid grid-cols-3 gap-4 font-body text-sm">
          <div>
            <div className="text-muted text-xs uppercase mb-1">Collected</div>
            <div className="font-num text-lg text-good">₹{fmtINR(allTimeCollected)}</div>
          </div>
          <div>
            <div className="text-muted text-xs uppercase mb-1">Spent</div>
            <div className="font-num text-lg text-rule">₹{fmtINR(allTimeSpent)}</div>
          </div>
          <div>
            <div className="text-muted text-xs uppercase mb-1">Net</div>
            <div className="font-num text-lg text-ink">₹{fmtINR(allTimeCollected - allTimeSpent)}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
