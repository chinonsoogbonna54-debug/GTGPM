import { useEffect, useRef, useState } from "react";

// events: array of { id, title, venue, dateLabel, imageUrl }
// Pulled from posts where type === "upcomming_event", reappears every
// several posts per the spec — the parent Feed decides when to render it.
export default function EventCarousel({ events }) {
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    // Simulate the brief loading window (real images fetching) with the
    // glass shimmer, then reveal the track. In production this flips to
    // true once the images have actually loaded.
    const t = setTimeout(() => setLoaded(true), 700);
    return () => clearTimeout(t);
  }, [events]);

  useEffect(() => {
    if (!loaded || events.length < 2) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % events.length);
    }, 4500);
    return () => clearInterval(id);
  }, [loaded, events.length]);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: trackRef.current.clientWidth * current, behavior: "smooth" });
  }, [current]);

  if (!events || events.length === 0) return null;

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-sm font-semibold text-brand-grey">Upcoming Events</h2>
        <div className="flex gap-1">
          {events.map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ background: i === current ? "#B91C1C" : "#E5E5E5" }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-4 rounded-2xl overflow-hidden aspect-[16/9]">
        {!loaded && <div className="glass-loading absolute inset-0 z-10" />}

        <div
          ref={trackRef}
          className={`carousel-track flex h-full overflow-x-auto scrollbar-none transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {events.map((ev) => (
            <div
              key={ev.id}
              className="carousel-slide w-full flex-shrink-0 h-full relative flex items-end p-5 text-white bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.65), rgba(0,0,0,.05) 55%), url('${ev.imageUrl || ""}')`,
                backgroundColor: "#7F1414",
              }}
            >
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80">{ev.dateLabel}</p>
                <p className="font-serif text-xl mt-1">{ev.title}</p>
                {ev.venue && <p className="text-sm opacity-80">{ev.venue}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
