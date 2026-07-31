import { LogOut } from "lucide-react";

export default function Header({ error, onLogout }) {
  return (
    <header className="border-b-4 border-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-end justify-between">
        <div>
          <div className="text-xs tracking-[0.25em] text-rule font-body font-semibold uppercase">
            Mess Register
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-none mt-1 text-ink">
            Jannat Mess
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <div className="text-xs text-rule font-body max-w-[200px] text-right">
              {error}
            </div>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-body text-muted hover:text-ink px-2 py-1.5 rounded hover:bg-hover"
            >
              <LogOut size={13} /> Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}