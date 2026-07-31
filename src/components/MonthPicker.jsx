import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthLabel, shiftMonth } from "../utils";

export default function MonthPicker({ month, setMonth }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => setMonth(shiftMonth(month, -1))}
        className="p-2 rounded hover:bg-hover text-ink"
        aria-label="Previous month"
      >
        <ChevronLeft size={18} />
      </button>
      <div className="font-display text-xl font-semibold text-ink">{monthLabel(month)}</div>
      <button
        onClick={() => setMonth(shiftMonth(month, 1))}
        className="p-2 rounded hover:bg-hover text-ink"
        aria-label="Next month"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
