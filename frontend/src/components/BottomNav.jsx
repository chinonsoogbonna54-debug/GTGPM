import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BottomNav() {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-brand-line bg-brand-bg flex items-center justify-around h-14">
      <Link to="/" className="flex flex-col items-center text-[10px] gap-0.5">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Feed
      </Link>
      <Link to="/about" className="flex flex-col items-center text-[10px] gap-0.5 text-brand-grey">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        About
      </Link>
      {isLoggedIn && (
        <Link
          to="/admin/dashboard"
          className="flex flex-col items-center text-[10px] gap-0.5 text-brand-red"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Dashboard
        </Link>
      )}
    </nav>
  );
}