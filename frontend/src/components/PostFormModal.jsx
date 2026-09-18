import { useState } from "react";
import { api } from "../api/client";

const POST_TYPES = [
  { value: "upcomming_event", label: "Event" },
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "sermon", label: "Sermon" },
  { value: "announcement", label: "Announcement" },
];

// mode: "create" | "edit"
// editingPost: required when mode === "edit" — the post being edited.
// Note: the backend's edit endpoint only updates title/pinned + type-specific
// TEXT fields — it does not support changing photos/video/flier on an
// existing post (that mirrors what you actually built server-side).
export default function PostFormModal({ mode = "create", editingPost, onClose, onSaved }) {
  const [type, setType] = useState(editingPost?.type || "sermon");
  const [title, setTitle] = useState(editingPost?.title || "");
  const [pinned, setPinned] = useState(editingPost?.pinned || false);
  const [scheduledFor, setScheduledFor] = useState("");

  // Event fields
  const [eventDate, setEventDate] = useState(
    editingPost?.event_detail?.event_date ? editingPost.event_detail.event_date.slice(0, 16) : ""
  );
  const [venue, setVenue] = useState(editingPost?.event_detail?.venue || "");
  const [flierImage, setFlierImage] = useState(null);

  // Photo fields
  const [photos, setPhotos] = useState([]);

  // Video fields
  const [video, setVideo] = useState(null);

  // Sermon fields
  const [speaker, setSpeaker] = useState(editingPost?.sermon_detail?.speaker || "");
  const [topic, setTopic] = useState(editingPost?.sermon_detail?.topic || "");
  const [scriptureRef, setScriptureRef] = useState(editingPost?.sermon_detail?.scripture_reference || "");

  // Announcement fields
  const [bodyText, setBodyText] = useState(editingPost?.announcement_detail?.body_text || "");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handlePhotosChange(e) {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      setError("You can upload a maximum of 4 photos.");
      return;
    }
    setError("");
    setPhotos(files);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();

    try {
      if (mode === "create") {
        formData.append("type", type);
        formData.append("title", title);
        formData.append("pinned", pinned);
        if (scheduledFor) formData.append("scheduled_for", scheduledFor);

        if (type === "upcomming_event") {
          formData.append("event_date", eventDate);
          formData.append("venue", venue);
          if (flierImage) formData.append("flier_image", flierImage);
        } else if (type === "photo") {
          photos.forEach((f) => formData.append("photos", f));
        } else if (type === "video") {
          if (video) formData.append("video", video);
        } else if (type === "sermon") {
          formData.append("speaker", speaker);
          formData.append("topic", topic);
          formData.append("scripture_reference", scriptureRef);
        } else if (type === "announcement") {
          formData.append("body_text", bodyText);
        }

        await api.createPost(formData);
      } else {
        // edit — only the fields the backend actually supports updating
        formData.append("title", title);
        formData.append("pinned", pinned);
        if (editingPost.type === "upcomming_event") {
          if (eventDate) formData.append("event_date", eventDate);
          if (venue) formData.append("venue", venue);
        } else if (editingPost.type === "sermon") {
          if (speaker) formData.append("speaker", speaker);
          if (topic) formData.append("topic", topic);
          if (scriptureRef) formData.append("scripture_reference", scriptureRef);
        } else if (editingPost.type === "announcement") {
          if (bodyText) formData.append("body_text", bodyText);
        }

        await api.updatePost(editingPost.id, formData);
      }

      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const activeType = mode === "create" ? type : editingPost.type;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-brand-bg w-full sm:max-w-[480px] sm:rounded-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-brand-line sticky top-0 bg-brand-bg">
          <h2 className="font-serif text-lg">{mode === "create" ? "New Post" : "Edit Post"}</h2>
          <button onClick={onClose} className="text-brand-grey text-sm">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {mode === "create" && (
            <div>
              <label className="text-xs text-brand-grey">Post type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-sm rounded-lg px-3 py-2 border border-brand-line bg-brand-bg mt-1"
              >
                {POST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-brand-grey">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2 border border-brand-line bg-brand-bg mt-1"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
            Pin this post
          </label>

          {mode === "create" && (
            <div>
              <label className="text-xs text-brand-grey">Schedule for later (optional)</label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full text-sm rounded-lg px-3 py-2 border border-brand-line bg-brand-bg mt-1"
              />
              <p className="text-[11px] text-brand-grey mt-1">Leave blank to publish immediately.</p>
            </div>
          )}

          {/* ---- Event fields ---- */}
          {activeType === "upcomming_event" && (
            <>
              <div>
                <label className="text-xs text-brand-grey">Event date & time</label>
                <input
                  type="datetime-local"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-brand-line bg-brand-bg mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-brand-grey">Venue</label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-brand-line bg-brand-bg mt-1"
                />
              </div>
              {mode === "create" && (
                <div>
                  <label className="text-xs text-brand-grey">Event flier image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFlierImage(e.target.files[0] || null)}
                    className="w-full text-sm mt-1"
                  />
                </div>
              )}
              {mode === "edit" && (
                <p className="text-[11px] text-brand-grey">
                  The flier image can't be changed here — delete and recreate the post to swap it.
                </p>
              )}
            </>
          )}

          {/* ---- Photo fields (create only) ---- */}
          {mode === "create" && activeType === "photo" && (
            <div>
              <label className="text-xs text-brand-grey">Photos (up to 4, select together)</label>
              <input type="file" accept="image/*" multiple onChange={handlePhotosChange} className="w-full text-sm mt-1" />
              {photos.length > 0 && <p className="text-[11px] text-brand-grey mt-1">{photos.length} photo(s) selected</p>}
            </div>
          )}

          {/* ---- Video fields (create only) ---- */}
          {mode === "create" && activeType === "video" && (
            <div>
              <label className="text-xs text-brand-grey">Video file</label>
              <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0] || null)} className="w-full text-sm mt-1" />
            </div>
          )}

          {/* ---- Sermon fields ---- */}
          {activeType === "sermon" && (
            <>
              <div>
                <label className="text-xs text-brand-grey">Speaker</label>
                <input
                  type="text"
                  required={mode === "create"}
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-brand-line bg-brand-bg mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-brand-grey">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-brand-line bg-brand-bg mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-brand-grey">Scripture reference</label>
                <input
                  type="text"
                  value={scriptureRef}
                  onChange={(e) => setScriptureRef(e.target.value)}
                  placeholder="e.g. Luke 10:14"
                  className="w-full text-sm rounded-lg px-3 py-2 border border-brand-line bg-brand-bg mt-1"
                />
              </div>
            </>
          )}

          {/* ---- Announcement fields ---- */}
          {activeType === "announcement" && (
            <div>
              <label className="text-xs text-brand-grey">Announcement text</label>
              <textarea
                required={mode === "create"}
                rows={4}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full text-sm rounded-lg px-3 py-2 border border-brand-line bg-brand-bg mt-1"
              />
            </div>
          )}

          {error && <p className="text-sm text-brand-red">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-sm font-medium text-white rounded-lg py-2.5 bg-brand-red disabled:opacity-60"
          >
            {submitting ? "Saving…" : mode === "create" ? "Publish Post" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
