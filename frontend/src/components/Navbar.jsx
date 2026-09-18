import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

export default function Navbar({ search, onSearchChange }) {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-bg">
      <div className="max-w-[935px] mx-auto flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="GTGPM logo" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          <span className="font-serif text-[17px] font-medium tracking-tight hidden sm:block truncate">
            Glory To God Power Ministries
          </span>
          <span className="font-serif text-[17px] font-medium tracking-tight sm:hidden">GTGPM</span>
        </Link>

        <div className="hidden md:flex items-center flex-1 max-w-[280px] mx-6 relative">
          <svg className="absolute left-3 w-4 h-4 text-brand-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search posts or dates"
            className="w-full text-sm rounded-lg pl-9 pr-3 py-1.5 border border-brand-line bg-brand-bg text-brand-ink"
          />
        </div>

        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium">Feed</Link>
          <Link to="/about" className="text-sm text-brand-grey">About</Link>
          {isLoggedIn && (
            <>
              <Link to="/admin/dashboard" className="text-sm font-medium text-brand-red">Dashboard</Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-sm text-brand-grey"
              >
                Log out
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile search row */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <svg className="absolute left-3 top-2 w-4 h-4 text-brand-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search posts or dates"
            className="w-full text-sm rounded-lg pl-9 pr-3 py-2 border border-brand-line bg-brand-bg text-brand-ink"
          />
        </div>
      </div>
    </header>
  );
}