import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Top glow */}
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[140px]" />

        {/* Bottom glow */}
        <div className="absolute bottom-[-300px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>

          <span className="text-lg font-semibold tracking-tight">
            recover.ai
          </span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-zinc-500 sm:block">
            New to recover.ai?
          </span>

          <Link
            to="/register"
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            Create account
          </Link>
        </div>
      </nav>

      {/* Login Area */}
      <section className="relative z-10 flex min-h-[calc(100vh-89px)] items-center justify-center px-6 pb-16 pt-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Recovery workspace
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Welcome back.
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-zinc-500">
              Sign in to access your recovery workspace and monitor
              AI-assisted payment recovery.
            </p>
          </div>

          {/* Login Card */}
          <div className="relative">
            {/* Card glow */}
            <div className="absolute -inset-4 -z-10 rounded-[32px] bg-white/[0.025] blur-2xl" />

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              {/* Card top */}
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Authentication
                  </p>

                  <h2 className="mt-2 text-sm font-medium text-zinc-300">
                    Sign in to your account
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 text-zinc-400"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-400/30 text-red-400">
                    <span className="text-xs">!</span>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-red-300">
                      Authentication failed
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-400/70">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-zinc-400"
                >
                  Email address
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 text-zinc-600"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </div>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 outline-none transition focus:border-white/25 focus:bg-white/[0.05] focus:ring-4 focus:ring-white/[0.03]"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-zinc-400"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-[11px] text-zinc-600 transition hover:text-zinc-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 text-zinc-600"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="5" y="10" width="14" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </div>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-16 text-sm text-white placeholder:text-zinc-700 outline-none transition focus:border-white/25 focus:bg-white/[0.05] focus:ring-4 focus:ring-white/[0.03]"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        className="opacity-20"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M21 12a9 9 0 0 1-9 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign in

                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M4 10h12M11 5l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] uppercase tracking-widest text-zinc-700">
                  Secure access
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              {/* Security indicator */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-600">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Your recovery workspace is protected
              </div>
            </form>
          </div>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-zinc-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-zinc-300 transition hover:text-white"
            >
              Create one
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-10 flex items-center justify-center gap-5 text-[10px] uppercase tracking-widest text-zinc-700">
            <span>AI + RAG</span>
            <span className="h-1 w-1 rounded-full bg-zinc-800" />
            <span>Bounded Actions</span>
            <span className="h-1 w-1 rounded-full bg-zinc-800" />
            <span>Audit Ready</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;