import { useState } from "react";
import { api } from "../api/client";
import logo from "../assets/logo.jpg";

function timeAgo(dateString) {
  const diff = (Date.now() - new Date(dateString + "Z")) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function shareLinks(post) {
  const url = encodeURIComponent(window.location.origin + `/#post-${post.id}`);
  const text = encodeURIComponent(post.title);
  return {
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
  };
}

export default function PostCard({ post, isAdmin = false, onEdit, onDelete, onTagClick }) {
  const [reacted, setReacted] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const links = shareLinks(post);

  async function handleReact(emoji) {
    if (busy) return;
    setBusy(true);
    try {
      const data = await api.likePost(post.id, emoji);
      if (data.message === "Reaction removed") {
        setReacted(null);
      } else {
        setReacted(emoji);
        if (emoji === "❤️") setSparkleKey((k) => k + 1);
      }
    } catch (err) {
      console.error("Failed to record reaction:", err.message);
    } finally {
      setBusy(false);
    }
  }

  let bodyContent = null;
  const allPhotos = post.type === "photo" ? (post.photos?.slice(0, 4) || []) : [];

  if (post.type === "photo" && allPhotos.length) {
    const photos = allPhotos;

    if (photos.length === 1) {
      bodyContent = (
        <img
          src={photos[0].photo_url}
          alt={post.title}
          onClick={() => setLightboxIndex(0)}
          className="w-full aspect-square object-cover cursor-pointer"
        />
      );
    } else if (photos.length === 2) {
      bodyContent = (
        <div className="grid grid-cols-2 gap-[2px]">
          {photos.map((p, i) => (
            <img
              key={p.position}
              src={p.photo_url}
              alt=""
              onClick={() => setLightboxIndex(i)}
              className="w-full aspect-square object-cover cursor-pointer"
            />
          ))}
        </div>
      );
    } else if (photos.length === 3) {
      bodyContent = (
        <div className="grid grid-cols-2 gap-[2px]">
          <div className="row-span-2">
            <img
              src={photos[0].photo_url}
              alt=""
              onClick={() => setLightboxIndex(0)}
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
          <img
            src={photos[1].photo_url}
            alt=""
            onClick={() => setLightboxIndex(1)}
            className="w-full aspect-square object-cover cursor-pointer"
          />
          <img
            src={photos[2].photo_url}
            alt=""
            onClick={() => setLightboxIndex(2)}
            className="w-full aspect-square object-cover cursor-pointer"
          />
        </div>
      );
    } else {
      bodyContent = (
        <div className="grid grid-cols-2 gap-[2px]">
          {photos.map((p, i) => (
            <img
              key={p.position}
              src={p.photo_url}
              alt=""
              onClick={() => setLightboxIndex(i)}
              className="w-full aspect-square object-cover cursor-pointer"
            />
          ))}
        </div>
      );
    }
  } else if (post.type === "video" && post.video_detail) {
    bodyContent = (
      <video controls className="w-full aspect-video bg-black">
        <source src={post.video_detail.video_url} />
      </video>
    );
  } else if (post.type === "sermon" && post.sermon_detail) {
    bodyContent = (
      <div className="aspect-[4/3] flex flex-col items-center justify-center text-center p-6 bg-brand-ink text-brand-bg">
        <p className="text-[11px] uppercase tracking-wide text-brand-gold">Sermon Highlight</p>
        <p className="font-serif text-xl mt-2">{post.title}</p>
        <p className="text-sm opacity-70 mt-1">
          {post.sermon_detail.speaker} · {post.sermon_detail.scripture_reference}
        </p>
      </div>
    );
  } else if (post.type === "announcement" && post.announcement_detail) {
    bodyContent = (
      <div className="p-5">
        <p className="text-[11px] uppercase tracking-wide text-brand-red">Announcement</p>
        <p className="text-[15px] mt-2 leading-relaxed">{post.announcement_detail.body_text}</p>
      </div>
    );
  } else if (post.type === "upcomming_event" && post.event_detail) {
    bodyContent = post.event_detail.flier_image_url ? (
      <div className="relative aspect-[4/3]">
        <img src={post.event_detail.flier_image_url} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-5 text-white">
          <p className="text-xs uppercase tracking-wide opacity-80">
            {new Date(post.event_detail.event_date + "Z").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <p className="font-serif text-xl mt-1">{post.title}</p>
          <p className="text-sm opacity-80">{post.event_detail.venue}</p>
        </div>
      </div>
    ) : (
      <div className="aspect-[4/3] flex flex-col items-center justify-center text-center p-6 text-white bg-brand-red">
        <p className="text-[11px] uppercase tracking-wide opacity-80">
          {new Date(post.event_detail.event_date + "Z").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </p>
        <p className="font-serif text-xl mt-2">{post.title}</p>
        <p className="text-sm opacity-80 mt-1">{post.event_detail.venue}</p>
      </div>
    );
  }

  const heartFilled = reacted === "❤️";

  return (
    <article id={`post-${post.id}`} className="border-y sm:border sm:rounded-xl border-brand-line overflow-hidden bg-brand-bg">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <img src={logo} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight truncate">{post.title}</p>
          <p className="text-[11px] text-brand-grey">
            {timeAgo(post.created_at)} {post.pinned && "· 📌 Pinned"}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onEdit?.(post)} className="text-xs px-2 py-1 rounded-full border border-brand-line text-brand-grey">
              Edit
            </button>
            <button onClick={() => onDelete?.(post.id)} className="text-xs px-2 py-1 rounded-full border border-brand-red text-brand-red">
              Delete
            </button>
          </div>
        )}
      </div>

      {bodyContent}

      <div className="px-3 pt-2 pb-1 flex items-center gap-4">
        <button
          onClick={() => handleReact("❤️")}
          disabled={busy}
          className="relative leading-none disabled:opacity-60"
          aria-label="React with heart"
        >
          <span key={sparkleKey} className="relative inline-block w-6 h-6">
            {heartFilled ? (
              <svg viewBox="0 0 24 24" className="w-6 h-6 heart-pop" fill="#B91C1C">
                <path d="M12 21s-6.72-4.35-9.33-8.02C.86 10.3 1.1 6.9 3.6 5.02 5.6 3.5 8.3 3.9 10 6c.6.7 1 1.4 2 1.4s1.4-.7 2-1.4c1.7-2.1 4.4-2.5 6.4-1 2.5 1.9 2.74 5.28.93 7.96C18.7 16.65 12 21 12 21z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-6.72-4.35-9.33-8.02C.86 10.3 1.1 6.9 3.6 5.02 5.6 3.5 8.3 3.9 10 6c.6.7 1 1.4 2 1.4s1.4-.7 2-1.4c1.7-2.1 4.4-2.5 6.4-1 2.5 1.9 2.74 5.28.93 7.96C18.7 16.65 12 21 12 21z" />
              </svg>
            )}

            {heartFilled && (
              <>
                <span className="sparkle sparkle-1">✦</span>
                <span className="sparkle sparkle-2">✦</span>
                <span className="sparkle sparkle-3">✦</span>
                <span className="sparkle sparkle-4">✦</span>
              </>
            )}
          </span>
        </button>

        <button
          onClick={() => handleReact("🙏")}
          disabled={busy}
          className={`text-xl leading-none transition-transform disabled:opacity-60 ${reacted === "🙏" ? "scale-125" : "opacity-70"}`}
        >
          🙏
        </button>

        <button
          onClick={() => handleReact("👏")}
          disabled={busy}
          className={`text-xl leading-none transition-transform disabled:opacity-60 ${reacted === "👏" ? "scale-125" : "opacity-70"}`}
        >
          👏
        </button>

        <div className="flex-1" />

        <a href={links.whatsapp} target="_blank" rel="noreferrer" title="Share on WhatsApp" className="opacity-70 hover:opacity-100">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2z" />
          </svg>
        </a>

        <a href={links.facebook} target="_blank" rel="noreferrer" title="Share on Facebook" className="opacity-70 hover:opacity-100">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12a10 10 0 10-11.5 9.87v-6.98H8v-2.9h2.5V9.8c0-2.48 1.48-3.85 3.74-3.85 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.61.76-1.61 1.55v1.86h2.75l-.44 2.9h-2.31v6.98A10 10 0 0022 12z" />
          </svg>
        </a>

        <a href={links.x} target="_blank" rel="noreferrer" title="Share on X" className="opacity-70 hover:opacity-100">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6.1L18.9 2z" />
          </svg>
        </a>
      </div>

       {post.like_count > 0 && (
        <p className="px-3 pb-2 text-xs text-brand-grey">
          {post.like_count} {post.like_count === 1 ? "reaction" : "reactions"}
        </p>
      )}

      {post.tag && (
        <button onClick={() => onTagClick?.(post.tag)} className="mx-3 mb-2 text-xs text-brand-red">
          {post.tag}
        </button>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white text-3xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>

          {allPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i - 1 + allPhotos.length) % allPhotos.length);
              }}
              className="absolute left-2 sm:left-4 text-white text-4xl leading-none px-2"
              aria-label="Previous photo"
            >
              &#8249;
            </button>
          )}

          <img
            src={allPhotos[lightboxIndex].photo_url}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[85vh] object-contain"
          />

          {allPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i + 1) % allPhotos.length);
              }}
              className="absolute right-2 sm:right-4 text-white text-4xl leading-none px-2"
              aria-label="Next photo"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </article>
  );
}