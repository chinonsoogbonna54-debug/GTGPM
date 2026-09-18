import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import PostCard from "../components/PostCard";
import PostFormModal from "../components/PostFormModal";

// The admin dashboard reuses the exact same PostCard component the public
// feed uses (per the spec: "admin can use the app like other users too"),
// just with isAdmin={true} so edit/delete/pin controls appear, plus a
// floating "New Post" button and the create/edit modal.
export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // { mode: "create" } | { mode: "edit", post }

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.getPosts(cursor, 10);
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.next_cursor);
      if (!data.next_cursor || data.posts.length === 0) setHasMore(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasMore, loading]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(postId) {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    try {
      await api.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert(err.message);
    }
  }

  function refreshAfterSave() {
    setModal(null);
    // Simplest correct approach: reload the whole first page fresh,
    // since a new/edited post can change ordering.
    setPosts([]);
    setCursor(null);
    setHasMore(true);
  }

  // Re-trigger the initial load whenever the feed gets reset above.
  useEffect(() => {
    if (posts.length === 0 && cursor === null && hasMore) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length, cursor, hasMore]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-[630px] mx-auto pb-24 px-0 sm:px-4">
        <div className="flex items-center justify-between px-4 sm:px-0 mt-4 mb-2">
          <h1 className="font-serif text-xl">Dashboard</h1>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="text-sm font-medium text-white rounded-lg px-4 py-2 bg-brand-red"
          >
            + New Post
          </button>
        </div>

        <section className="mt-3 space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isAdmin
              onEdit={(p) => setModal({ mode: "edit", post: p })}
              onDelete={handleDelete}
            />
          ))}
        </section>

        {error && <p className="text-center text-sm text-brand-red py-4">{error}</p>}
        {loading && <p className="text-center text-sm text-brand-grey py-6">Loading…</p>}
        {!hasMore && !loading && posts.length > 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-brand-grey mb-2">End of posts.</p>
          </div>
        )}
        {hasMore && !loading && posts.length > 0 && (
          <div className="text-center py-4">
            <button onClick={loadMore} className="text-sm text-brand-red underline">
              Load more
            </button>
          </div>
        )}
        {!loading && posts.length === 0 && !error && (
          <p className="text-center text-sm text-brand-grey py-10">
            No posts yet — create your first one above.
          </p>
        )}
      </main>

      {modal && (
        <PostFormModal
          mode={modal.mode}
          editingPost={modal.post}
          onClose={() => setModal(null)}
          onSaved={refreshAfterSave}
        />
      )}

      <BottomNav />
    </div>
  );
}
