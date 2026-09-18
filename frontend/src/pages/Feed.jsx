
import { useEffect, useRef, useState, useCallback, Fragment } from "react";
import { api } from "../api/client";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import Countdown from "../components/Countdown";
import EventCarousel from "../components/EventCarousel";
import StoriesBar from "../components/StoriesBar";
import TagBar from "../components/TagBar";
import PostCard from "../components/PostCard";

const CAROUSEL_INTERVAL = 6;

export default function Feed({ isAdminView = false }) {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError("");

    try {
      const data = await api.getPosts(cursor, 10);

      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.next_cursor);

      if (!data.next_cursor || data.posts.length === 0) {
        setHasMore(false);
      }
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

  useEffect(() => {
    const el = sentinelRef.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [loadMore]);

  // --------------------------------------------------
  // EVENTS
  // --------------------------------------------------

  const events = posts
    .filter(
      (p) =>
        p.type === "upcomming_event" &&
        p.event_detail
    )
    .map((p) => ({
      id: p.id,
      title: p.title,
      venue: p.event_detail.venue,
      dateLabel: new Date(
        p.event_detail.event_date + "Z"
      ).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      imageUrl: p.event_detail.flier_image_url,
    }));

  // --------------------------------------------------
  // STORIES
  // Only photo/video posts from the last 24 hours
  // --------------------------------------------------

  const twentyFourHoursAgo =
    Date.now() - 24 * 60 * 60 * 1000;

  const stories = posts
    .filter((p) => {
      const isPhoto =
        p.type === "photo" &&
        p.photos?.length;

      const isVideo =
        p.type === "video" &&
        p.video_detail;

      if (!isPhoto && !isVideo) {
        return false;
      }

      const createdAt = new Date(
        p.created_at + "Z"
      ).getTime();

      return createdAt >= twentyFourHoursAgo;
    })
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      label: p.title,
      type: p.type,

      coverUrl:
        p.type === "photo"
          ? p.photos[0].photo_url
          : p.video_detail.video_url,

      mediaUrl:
        p.type === "photo"
          ? p.photos[0].photo_url
          : p.video_detail.video_url,
    }));

  // --------------------------------------------------
  // TAGS
  // --------------------------------------------------

  const tags = [
    ...new Set(
      posts
        .map((p) => p.tag)
        .filter(Boolean)
    ),
  ];

  // --------------------------------------------------
  // NEXT UPCOMING EVENT
  // --------------------------------------------------

  const nextEvent = events
    .filter((event) => {
      const post = posts.find(
        (p) => p.id === event.id
      );

      return (
        post?.event_detail?.event_date &&
        new Date(
          post.event_detail.event_date + "Z"
        ) > new Date()
      );
    })
    .sort((a, b) => {
      const postA = posts.find(
        (p) => p.id === a.id
      );

      const postB = posts.find(
        (p) => p.id === b.id
      );

      return (
        new Date(
          postA.event_detail.event_date + "Z"
        ) -
        new Date(
          postB.event_detail.event_date + "Z"
        )
      );
    })[0];

  // --------------------------------------------------
  // SEARCH + TAG FILTER
  // --------------------------------------------------

  const visiblePosts = posts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesTag =
      !activeTag ||
      p.tag === activeTag;

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen">
      <Navbar
        search={search}
        onSearchChange={setSearch}
      />

      <main className="max-w-[630px] mx-auto pb-24">

        {/* NEXT EVENT COUNTDOWN */}
        {nextEvent && (
          <Countdown
            title={nextEvent.title}
            targetDate={
              posts.find(
                (p) => p.id === nextEvent.id
              )?.event_detail?.event_date
            }
          />
        )}

        {/* EVENT CAROUSEL */}
        {events.length > 0 && (
          <EventCarousel events={events} />
        )}

        {/* STORIES */}
        {stories.length > 0 && (
          <StoriesBar stories={stories} />
        )}

        {/* TAGS */}
        {tags.length > 0 && (
          <TagBar
            tags={tags}
            activeTag={activeTag}
            onSelect={setActiveTag}
          />
        )}

        {/* POSTS */}
        <section className="mt-5 space-y-6 px-0 sm:px-4">
          {visiblePosts.map((post, idx) => (
            <Fragment key={post.id}>
              <PostCard
                post={post}
                onTagClick={setActiveTag}
              />

              {/* Insert event carousel every 6 posts */}
              {events.length > 0 &&
                (idx + 1) % CAROUSEL_INTERVAL === 0 && (
                  <EventCarousel events={events} />
                )}
            </Fragment>
          ))}
        </section>

        {/* ERROR */}
        {error && (
          <p className="text-center text-sm text-brand-red py-4">
            {error}
          </p>
        )}

        {/* INFINITE SCROLL SENTINEL */}
        <div
          ref={sentinelRef}
          className="h-10"
        />

        {/* LOADING */}
        {loading && (
          <p className="text-center text-sm text-brand-grey py-6">
            Loading more…
          </p>
        )}

        {/* END OF FEED */}
        {!hasMore &&
          !loading &&
          posts.length > 0 && (
            <p className="text-center text-sm text-brand-grey py-8">
              You're all caught up ✝️
            </p>
          )}

        {/* EMPTY FEED */}
        {!loading &&
          posts.length === 0 &&
          !error && (
            <p className="text-center text-sm text-brand-grey py-10">
              No posts yet — check back soon.
            </p>
          )}
      </main>

      <BottomNav />
    </div>
  );
}
