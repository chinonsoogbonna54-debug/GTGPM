// tags: array of strings, e.g. ["#YouthConference", "#SundayService"]
// activeTag / onSelect let the parent Feed filter posts by the chosen tag.
export default function TagBar({ tags, activeTag, onSelect }) {
  if (!tags || tags.length === 0) return null;

  return (
    <section className="mt-5 px-4 flex gap-2 overflow-x-auto scrollbar-none">
      {tags.map((tag) => {
        const isActive = tag === activeTag;
        return (
          <button
            key={tag}
            onClick={() => onSelect?.(isActive ? null : tag)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={{
              background: isActive ? "#B91C1C" : "transparent",
              color: isActive ? "#fff" : "#525252",
              borderColor: isActive ? "#B91C1C" : "#E5E5E5",
            }}
          >
            {tag}
          </button>
        );
      })}
    </section>
  );
}
