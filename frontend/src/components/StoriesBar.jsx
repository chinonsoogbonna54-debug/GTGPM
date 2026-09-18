import { useState } from "react";

// stories: array of {
//   id,
//   label,
//   coverUrl,
//   type,
//   mediaUrl
// }
//
// Stories are displayed in a horizontal bar.
// Tapping a story opens a full-screen viewer.

export default function StoriesBar({ stories }) {

  const [selectedStory, setSelectedStory] = useState(null);

  if (!stories || stories.length === 0) return null;

  return (
    <>
      <section className="mt-6">

        <div className="flex gap-4 px-4 overflow-x-auto scrollbar-none">

          {stories.map((s) => (

            <button
              key={s.id}
              onClick={() => setSelectedStory(s)}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >

              <div className="story-ring w-16 h-16 rounded-full p-[2px]">

                <div className="w-full h-full rounded-full p-[2px] bg-brand-bg overflow-hidden relative">

                  {/* Fix: a video file can't be shown with <img> — that's what
                      was producing the broken-image icon. A muted <video>
                      element renders the actual first frame instead. */}
                  {s.type === "video" ? (
                    <video
                      src={s.coverUrl}
                      className="w-full h-full rounded-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={s.coverUrl}
                      alt={s.label}
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}

                  {s.type === "video" && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg className="w-5 h-5 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  )}

                </div>

              </div>

              <span className="text-[11px] max-w-[64px] truncate">
                {s.label}
              </span>

            </button>

          ))}

        </div>

      </section>

      {selectedStory && (

        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">

          <button
            onClick={() => setSelectedStory(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white text-2xl flex items-center justify-center"
            aria-label="Close story"
          >
            ×
          </button>

          <div className="w-full h-full flex items-center justify-center">

            {selectedStory.type === "video" ? (

              <video
                src={selectedStory.mediaUrl}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-full object-contain"
              />

            ) : (

              <img
                src={selectedStory.mediaUrl}
                alt={selectedStory.label}
                className="max-w-full max-h-full object-contain"
              />

            )}

          </div>

        </div>

      )}

    </>
  );
}