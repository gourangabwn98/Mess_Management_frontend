export default function Header({ error }) {
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
        {error && (
          <div className="text-xs text-rule font-body max-w-[200px] text-right">
            {error}
          </div>
        )}
      </div>
    </header>
  );
}
