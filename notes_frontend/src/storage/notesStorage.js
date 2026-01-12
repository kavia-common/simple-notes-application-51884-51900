const STORAGE_KEY = "simple_notes_app__notes_v1";

/**
 * Notes are stored as a single JSON object:
 * {
 *   version: 1,
 *   notes: [
 *     { id, title, content, created_at, updated_at }
 *   ]
 * }
 */

function nowIso() {
  return new Date().toISOString();
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function generateId() {
  // Prefer crypto.randomUUID when available.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback: timestamp + random. (Good enough for local notes.)
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getEmptyState() {
  return { version: 1, notes: [] };
}

function readState() {
  if (typeof window === "undefined" || !window.localStorage) return getEmptyState();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return getEmptyState();

  const parsed = safeParseJson(raw);
  if (!parsed || !Array.isArray(parsed.notes)) return getEmptyState();

  return {
    version: 1,
    notes: parsed.notes,
  };
}

function writeState(state) {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeForStorage(note) {
  return {
    id: String(note.id),
    title: typeof note.title === "string" ? note.title : "",
    content: typeof note.content === "string" ? note.content : "",
    created_at: note.created_at || nowIso(),
    updated_at: note.updated_at || nowIso(),
  };
}

// PUBLIC_INTERFACE
export function listNotes() {
  /** Returns all notes (array), unsorted. */
  const state = readState();
  return [...state.notes];
}

// PUBLIC_INTERFACE
export function getNote(id) {
  /** Returns a note by id, or null if not found. */
  const state = readState();
  const found = state.notes.find((n) => String(n.id) === String(id));
  return found ? { ...found } : null;
}

// PUBLIC_INTERFACE
export function createNote(payload) {
  /** Creates a note and returns the created note. */
  const title = typeof payload?.title === "string" ? payload.title : "";
  const content = typeof payload?.content === "string" ? payload.content : "";

  const state = readState();
  const created = normalizeForStorage({
    id: generateId(),
    title,
    content,
    created_at: nowIso(),
    updated_at: nowIso(),
  });

  state.notes.push(created);
  writeState(state);

  return { ...created };
}

// PUBLIC_INTERFACE
export function updateNote(id, payload) {
  /** Updates a note and returns the updated note. Throws if not found. */
  const state = readState();
  const idx = state.notes.findIndex((n) => String(n.id) === String(id));
  if (idx === -1) {
    throw new Error("Note not found.");
  }

  const prev = state.notes[idx];
  const next = normalizeForStorage({
    ...prev,
    title: typeof payload?.title === "string" ? payload.title : prev.title,
    content: typeof payload?.content === "string" ? payload.content : prev.content,
    created_at: prev.created_at || nowIso(),
    updated_at: nowIso(),
  });

  state.notes[idx] = next;
  writeState(state);

  return { ...next };
}

// PUBLIC_INTERFACE
export function deleteNote(id) {
  /** Deletes a note. Returns true if deleted, false if not found. */
  const state = readState();
  const before = state.notes.length;
  state.notes = state.notes.filter((n) => String(n.id) !== String(id));
  const deleted = state.notes.length !== before;

  if (deleted) writeState(state);
  return deleted;
}

// PUBLIC_INTERFACE
export function __dangerous__clearAllNotes() {
  /** Test helper: clears all notes from storage. */
  writeState(getEmptyState());
}
