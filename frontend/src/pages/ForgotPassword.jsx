import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import logo from "../assets/logo.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await api.forgotPassword(email);
      // Backend always returns the same generic message, whether or not
      // the email exists — that's intentional, so we just show it as-is.
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <img src={logo} alt="GTGPM logo" className="w-16 h-16 rounded-full object-cover mb-4" />
      <h1 className="font-serif text-xl mb-6">Forgot Password</h1>

      {message ? (
        <p className="text-sm text-brand-grey text-center max-w-[320px]">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-[340px] space-y-3">
          <input
            type="email"
            required
            placeholder="Your admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-sm rounded-lg px-3 py-2.5 border border-brand-line bg-brand-bg"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full text-sm font-medium text-white rounded-lg py-2.5 bg-brand-red disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}

      <Link to="/admin/login" className="mt-6 text-sm text-brand-grey underline">
        Back to login
      </Link>
    </div>
  );
}
