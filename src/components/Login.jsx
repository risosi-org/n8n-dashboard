import { useState } from "react";
import { toast } from "react-hot-toast";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Enter both username and password");
      return;
    }

    setSubmitting(true);

    try {
      await onLogin({ username: username.trim(), password });
    } catch (error) {
      // toast.error(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-dark-2 to-dark-3 text-text px-4">
      <div className="w-full max-w-md glass border border-border rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔒</div>
          <h1 className="text-2xl font-semibold text-text">Dashboard Login</h1>
          <p className="text-sm text-text-muted">Enter your credentials to continue.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-text mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-dark-3 border border-border rounded-xl text-text placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="username"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-dark-3 border border-border rounded-xl text-text placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

