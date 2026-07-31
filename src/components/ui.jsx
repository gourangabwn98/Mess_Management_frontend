import { fmtINR } from "../utils";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-card margin-rule rounded-sm shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, tone = "default" }) {
  const toneColor =
    tone === "good" ? "text-good" : tone === "bad" ? "text-rule" : "text-ink";
  return (
    <Card className="p-4">
      <div className="text-xs uppercase tracking-wide text-muted font-body font-medium">
        {label}
      </div>
      <div className={`font-num text-2xl font-semibold mt-1 ${toneColor}`}>
        <span className="text-base align-top mr-0.5">₹</span>
        {fmtINR(value)}
      </div>
    </Card>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="text-center py-10 text-muted font-body text-sm border border-dashed border-border rounded-sm">
      {text}
    </div>
  );
}

export function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-body text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
        active ? "border-rule text-ink" : "border-transparent text-muted hover:text-ink"
      }`}
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </button>
  );
}
