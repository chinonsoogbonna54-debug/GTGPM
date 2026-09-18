import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import logo from "../assets/logo.jpg";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing a token.");
      return;
    }
    api
      .verifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message);
      });
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <img src={logo} alt="GTGPM logo" className="w-16 h-16 rounded-full object-cover mb-4" />
      {status === "loading" && <p className="text-sm text-brand-grey">Verifying your email…</p>}
      {status === "success" && (
        <>
          <h1 className="font-serif text-xl mb-2 text-brand-red">Email Verified</h1>
          <p className="text-sm text-brand-grey">{message}</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="font-serif text-xl mb-2 text-brand-red">Verification Failed</h1>
          <p className="text-sm text-brand-grey">{message}</p>
        </>
      )}
      <Link to="/admin/login" className="mt-6 text-sm text-brand-red underline">
        Go to login
      </Link>
    </div>
  );
}
