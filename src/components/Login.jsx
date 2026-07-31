import { useState } from "react";
import { Lock } from "lucide-react";

const AUTH_EMAIL = "gourangabwn98@gmail.com";
const AUTH_PASSWORD = "Gouranga#98";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === AUTH_EMAIL && password === AUTH_PASSWORD) {
      setError("");
      onLogin();
    } else {
      setError("Wrong email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-xs tracking-[0.25em] text-rule font-body font-semibold uppercase">
            Mess Register
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mt-1">Jannat Mess</h1>
        </div>

        <form
          onSubmit={submit}
          className="bg-card margin-rule rounded-sm shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-ink mb-1">
            <Lock size={16} />
            <span className="font-body text-sm font-medium">Sign in to continue</span>
          </div>

          <div>
            <label className="text-xs text-muted font-body block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              className="font-body text-sm px-3 py-2 rounded border border-border bg-white w-full focus:outline-none focus:ring-2 focus:ring-rule/40"
            />
          </div>

          <div>
            <label className="text-xs text-muted font-body block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-body text-sm px-3 py-2 rounded border border-border bg-white w-full focus:outline-none focus:ring-2 focus:ring-rule/40"
            />
          </div>

          {error && <div className="text-xs text-rule font-body">{error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-2 rounded bg-ink text-paper text-sm font-medium font-body hover:bg-inkSoft"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}