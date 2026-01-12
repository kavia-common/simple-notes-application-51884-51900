import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createNote, deleteNote, getNote, updateNote } from "../storage/notesStorage";
import { Button, Card, Container, InlineMessage, Input, TextArea, styles } from "../components/ui";

function isNonEmptyString(s) {
  return typeof s === "string" && s.trim().length > 0;
}

// PUBLIC_INTERFACE
export default function NoteEditor() {
  /** Note editor page for both create (/new) and edit (/notes/:id). */
  const { id } = useParams();
  const isNew = !id;

  const navigate = useNavigate();

  const [status, setStatus] = useState("idle"); // idle | loading | saving | deleting | error
  const [loadError, setLoadError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [fieldErrors, setFieldErrors] = useState({ title: "", content: "" });
  const [bannerError, setBannerError] = useState("");
  const [bannerInfo, setBannerInfo] = useState("");

  const initialSnapshot = useRef({ title: "", content: "" });

  const isDirty = useMemo(() => {
    return title !== initialSnapshot.current.title || content !== initialSnapshot.current.content;
  }, [title, content]);

  function load() {
    if (isNew) {
      setStatus("idle");
      setLoadError("");
      setTitle("");
      setContent("");
      initialSnapshot.current = { title: "", content: "" };
      return;
    }

    setStatus("loading");
    setLoadError("");
    setBannerError("");
    setBannerInfo("");

    try {
      const note = getNote(id);
      if (!note) {
        setLoadError("Note not found (it may have been deleted).");
        setStatus("error");
        return;
      }

      setTitle(note.title || "");
      setContent(note.content || "");
      initialSnapshot.current = { title: note.title || "", content: note.content || "" };
      setStatus("idle");
    } catch (e) {
      setLoadError(e?.message || "Failed to load note.");
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function validate() {
    const errors = { title: "", content: "" };

    // Title optional but encouraged; content can be empty. Keep validation lightweight.
    if (title.length > 200) errors.title = "Title is too long (max 200 characters).";
    if (content.length > 20000) errors.content = "Content is too long (max 20000 characters).";

    setFieldErrors(errors);
    return !isNonEmptyString(errors.title) && !isNonEmptyString(errors.content);
  }

  function onSave() {
    setBannerError("");
    setBannerInfo("");

    if (!validate()) return;

    setStatus("saving");
    try {
      if (isNew) {
        const created = createNote({ title: title.trim(), content });
        const createdId = created?.id;
        setBannerInfo("Saved.");

        if (createdId != null) {
          navigate(`/notes/${encodeURIComponent(createdId)}`, { replace: true });
        } else {
          setStatus("idle");
        }
      } else {
        updateNote(id, { title: title.trim(), content });
        initialSnapshot.current = { title, content };
        setBannerInfo("Saved.");
        setStatus("idle");
      }
    } catch (e) {
      setBannerError(e?.message || "Save failed.");
      setStatus("idle");
    }
  }

  function onDelete() {
    if (isNew) return;

    setBannerError("");
    setBannerInfo("");

    const ok = window.confirm("Delete this note? This cannot be undone.");
    if (!ok) return;

    setStatus("deleting");
    try {
      deleteNote(id);
      navigate("/", { replace: true });
    } catch (e) {
      setBannerError(e?.message || "Delete failed.");
      setStatus("idle");
    }
  }

  const heading = isNew ? "New note" : "Edit note";

  return (
    <div style={{ minHeight: "100vh", background: styles.colors.background }}>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: styles.colors.text, fontSize: 22 }}>
              {heading}
            </h1>
            <div style={{ marginTop: 6, color: styles.colors.subtleText, fontSize: 13 }}>
              <Link to="/" style={{ color: styles.colors.primary, textDecoration: "none" }}>
                ← Back to list
              </Link>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {!isNew ? (
              <Button
                variant="danger"
                onClick={onDelete}
                disabled={status === "deleting" || status === "loading"}
              >
                {status === "deleting" ? "Deleting…" : "Delete"}
              </Button>
            ) : null}

            <Button
              variant="primary"
              onClick={onSave}
              disabled={status === "saving" || status === "loading" || (!isNew && !isDirty)}
            >
              {status === "saving" ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        {loadError ? (
          <div style={{ marginBottom: 12 }}>
            <InlineMessage kind="error">
              {loadError}{" "}
              <button
                onClick={() => {
                  if (loadError.toLowerCase().includes("not found")) {
                    navigate("/", { replace: true });
                    return;
                  }
                  load();
                }}
                style={{
                  marginLeft: 8,
                  border: "none",
                  background: "transparent",
                  color: "#1d4ed8",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {loadError.toLowerCase().includes("not found") ? "Go to list" : "Retry"}
              </button>
            </InlineMessage>
          </div>
        ) : null}

        {bannerError ? (
          <div style={{ marginBottom: 12 }}>
            <InlineMessage kind="error">{bannerError}</InlineMessage>
          </div>
        ) : null}

        {bannerInfo ? (
          <div style={{ marginBottom: 12 }}>
            <InlineMessage kind="success">{bannerInfo}</InlineMessage>
          </div>
        ) : null}

        <Card style={{ padding: 16 }}>
          {status === "loading" ? (
            <div style={{ color: styles.colors.subtleText }}>Loading…</div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              <Input
                label="Title"
                placeholder="Untitled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={fieldErrors.title}
                aria-label="Title"
              />

              <TextArea
                label="Content"
                placeholder="Write your note here…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                error={fieldErrors.content}
                aria-label="Content"
              />

              {!isNew ? (
                <div style={{ fontSize: 12, color: styles.colors.subtleText }}>
                  Note id: <code>{id}</code>
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}
