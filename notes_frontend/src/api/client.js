const DEFAULT_API_BASE_URL = "http://localhost:3001";

/**
 * Determine API base URL from environment variables.
 * Supports both REACT_APP_API_BASE_URL (requested) and existing REACT_APP_API_BASE (already present in .env.example).
 */
function getApiBaseUrl() {
  return (
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_BASE ||
    DEFAULT_API_BASE_URL
  );
}

function joinUrl(base, path) {
  const baseTrimmed = (base || "").replace(/\/+$/, "");
  const pathTrimmed = (path || "").replace(/^\/+/, "");
  return `${baseTrimmed}/${pathTrimmed}`;
}

async function parseJsonSafely(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const url = joinUrl(getApiBaseUrl(), path);

  const resp = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : null),
      ...(options.headers || {}),
    },
  });

  if (!resp.ok) {
    const data = await parseJsonSafely(resp);
    const message =
      (data && (data.detail || data.message)) ||
      `Request failed: ${resp.status} ${resp.statusText}`;
    const err = new Error(message);
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  // No content (e.g. DELETE)
  if (resp.status === 204) return null;

  const data = await parseJsonSafely(resp);
  return data;
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** List all notes: GET /notes */
  return request("/notes", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a note by id: GET /notes/{id} */
  return request(`/notes/${encodeURIComponent(id)}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a note: POST /notes */
  return request("/notes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update a note: PUT /notes/{id} */
  return request(`/notes/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note: DELETE /notes/{id} */
  return request(`/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
}
