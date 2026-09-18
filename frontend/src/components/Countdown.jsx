import { useEffect, useState } from "react";

// Shows "X days away" until under 48 hours, then flips to a live HH:MM:SS
// ticker. targetDate should be a real Date (or parseable string) coming
// from the next pinned/upcoming event post.
export default function Countdown({ title, targetDate }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!targetDate) return null;

  const target = new Date(targetDate);
  const diff = target - now;

  let display;
  if (diff <= 0) {
    display = <p className="text-lg font-semibold">Happening now</p>;
  } else {
    const days = Math.floor(diff / 86400000);
    if (days > 1) {
      display = (
        <>
          <p className="text-2xl font-semibold tabular-nums text-brand-gold">{days}d</p>
          <p className="text-[11px] opacity-70">to go</p>
        </>
      );
    } else {
      const h = String(Math.floor((diff / 3600000) % 24)).padStart(2, "0");
      const m = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      display = (
        <>
          <p className="text-xl font-semibold tabular-nums text-brand-gold">{h}:{m}:{s}</p>
          <p className="text-[11px] opacity-70">to go</p>
        </>
      );
    }
  }

  return (
    <section className="mx-4 mt-4 rounded-2xl p-4 flex items-center justify-between bg-brand-ink text-brand-bg">
      <div>
        <p className="text-[11px] uppercase tracking-wide opacity-70">Next big event</p>
        <p className="font-serif text-lg leading-tight">{title}</p>
      </div>
      <div className="text-right">{display}</div>
    </section>
  );
}
