// Central place for every call to the FastAPI backend.
// VITE_API_URL comes from .env (see .env.example) — defaults to local dev.
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("gtgpm_admin_token");
}

// A thin wrapper around fetch that adds the base URL, JSON headers,
// and the admin's JWT (when present) automatically.
async function request(path, { method = "GET", body, isForm = false, auth = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include", // sends/receives the anonymous like cookie
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // some responses (e.g. plain text errors) aren't JSON
  }

  if (!res.ok) {
    const message = data?.detail
      ? Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data.detail
      : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // ---- Public feed ----
  getPosts: (cursor, limit = 10) => {
    const params = new URLSearchParams();
    if (cursor) params.set("cursor", cursor);
    if (limit) params.set("limit", limit);
    return request(`/posts?${params.toString()}`);
  },
  likePost: (postId, reaction) =>
    request(`/posts/${postId}/like`, {
      method: "POST",
      isForm: true,
      body: (() => {
        const fd = new FormData();
        fd.append("reaction", reaction);
        return fd;
      })(),
    }),

  // ---- Auth ----
  signup: (payload) => request("/signup", { method: "POST", body: payload }),
  login: (payload) => request("/login", { method: "POST", body: payload }),
  verifyEmail: (token) => request(`/verify?token=${encodeURIComponent(token)}`),
  forgotPassword: (email) =>
    request("/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (token, new_password) =>
    request("/reset-password", { method: "POST", body: { token, new_password } }),

  // ---- Admin post management (all require a valid JWT) ----
  createPost: (formData) =>
    request("/admin/posts", { method: "POST", isForm: true, body: formData, auth: true }),
  updatePost: (postId, formData) =>
    request(`/admin/posts/${postId}`, { method: "PUT", isForm: true, body: formData, auth: true }),
  deletePost: (postId) =>
    request(`/admin/posts/${postId}`, { method: "DELETE", auth: true }),
};

export { getToken, BASE_URL };
