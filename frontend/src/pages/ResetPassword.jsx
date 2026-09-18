import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import logo from "../assets/logo.jpg";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.resetPassword(token, newPassword);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <img src={logo} alt="GTGPM logo" className="w-16 h-16 rounded-full object-cover mb-4" />
      <h1 className="font-serif text-xl mb-6">Reset Password</h1>

      {done ? (
        <>
          <p className="text-sm text-brand-grey text-center max-w-[320px] mb-4">
            Your password has been reset. You can log in now.
          </p>
          <button
            onClick={() => navigate("/admin/login")}
            className="text-sm font-medium text-white rounded-lg py-2.5 px-6 bg-brand-red"
          >
            Go to login
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-[340px] space-y-3">
          <input
            type="password"
            required
            minLength={8}
            placeholder="New password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full text-sm rounded-lg px-3 py-2.5 border border-brand-line bg-brand-bg"
          />
          {error && <p className="text-sm text-brand-red">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !token}
            className="w-full text-sm font-medium text-white rounded-lg py-2.5 bg-brand-red disabled:opacity-60"
          >
            {submitting ? "Resetting…" : "Reset Password"}
          </button>
          {!token && <p className="text-xs text-brand-red">No reset token found in this link.</p>}
        </form>
      )}

      <Link to="/admin/login" className="mt-6 text-sm text-brand-grey underline">
        Back to login
      </Link>
    </div>
  );
}
