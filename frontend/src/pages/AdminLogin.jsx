import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await api.login({ email, password });
      login(data.access_token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <img src={logo} alt="GTGPM logo" className="w-16 h-16 rounded-full object-cover mb-4" />
      <h1 className="font-serif text-xl mb-6">Admin Login</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-[340px] space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-sm rounded-lg px-3 py-2.5 border border-brand-line bg-brand-bg"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm rounded-lg px-3 py-2.5 border border-brand-line bg-brand-bg"
        />

        {error && <p className="text-sm text-brand-red">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full text-sm font-medium text-white rounded-lg py-2.5 bg-brand-red disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log In"}
        </button>
      </form>

      <div className="mt-4 text-sm text-brand-grey space-x-3">
        <Link to="/admin/forgot-password" className="underline">Forgot password?</Link>
        <span>·</span>
        <Link to="/admin/signup" className="underline">Create admin account</Link>
      </div>
    </div>
  );
}
