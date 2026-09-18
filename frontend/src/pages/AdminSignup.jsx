import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import logo from "../assets/logo.jpg";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.signup({ email, password, signup_code: signupCode });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <img src={logo} alt="GTGPM logo" className="w-16 h-16 rounded-full object-cover mb-4" />
        <h1 className="font-serif text-xl mb-2">Check your email</h1>
        <p className="text-sm text-brand-grey max-w-[320px]">
          We've sent a verification link to <strong>{email}</strong>. Click it to activate your admin
          account, then log in.
        </p>
        <Link to="/admin/login" className="mt-6 text-sm text-brand-red underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <img src={logo} alt="GTGPM logo" className="w-16 h-16 rounded-full object-cover mb-4" />
      <h1 className="font-serif text-xl mb-6">Create Admin Account</h1>

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
          minLength={8}
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm rounded-lg px-3 py-2.5 border border-brand-line bg-brand-bg"
        />
        <input
          type="text"
          required
          placeholder="Signup code"
          value={signupCode}
          onChange={(e) => setSignupCode(e.target.value)}
          className="w-full text-sm rounded-lg px-3 py-2.5 border border-brand-line bg-brand-bg"
        />

        {error && <p className="text-sm text-brand-red">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full text-sm font-medium text-white rounded-lg py-2.5 bg-brand-red disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <Link to="/admin/login" className="mt-4 text-sm text-brand-grey underline">
        Already have an account? Log in
      </Link>
    </div>
  );
}
