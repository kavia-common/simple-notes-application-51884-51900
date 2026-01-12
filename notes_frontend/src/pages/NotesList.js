import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listNotes } from "../api/client";
import { Button, Card, Container, InlineMessage, styles } from "../components/ui";

function snippet(text, maxLen = 120) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  return clean.length > maxLen ? `${clean.slice(0, maxLen)}…` : clean;
}

function normalizeNote(n) {
  // Be tolerant to backend field naming differences.
  return {
    id: n.id ?? n.note_id ?? n.uuid,
    title: n.title ?? "",
    content: n.content ?? n.body ?? "",
    updated_at: n.updated_at ?? n.updatedAt ?? n.modified_at ?? null,
    created_at: n.created_at ?? n.createdAt ?? null,
  };
}

// PUBLIC_INTERFACE
export default function NotesList() {
  /** Notes list page: fetches and displays notes, links to /notes/:id and /new. */
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState("");

  const sortedNotes = useMemo(() => {
    // If timestamps are present, sort newest first; otherwise keep returned order.
    const copy = [...notes];
    copy.sort((a, b) => {
      const ta = new Date(a.updated_at || a.created_at || 0).getTime();
      const tb = new Date(b.updated_at || b.created_at || 0).getTime();
      return tb - ta;
    });
    return copy;
  }, [notes]);

  async function refresh() {
    setStatus("loading");
    setError("");
    try {
      const data = await listNotes();
      const arr = Array.isArray(data) ? data : data?.items || [];
      setNotes(arr.map(normalizeNote).filter((n) => n.id != null));
      setStatus("success");
    } catch (e) {
      setError(e?.message || "Failed to load notes.");
      setStatus("error");
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: styles.colors.background }}>
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: styles.colors.text, fontSize: 26 }}>
              Notes
            </h1>
            <div style={{ marginTop: 6, color: styles.colors.subtleText, fontSize: 14 }}>
              Create, edit, and organize your notes.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" onClick={refresh} disabled={status === "loading"}>
              Refresh
            </Button>
            <Button variant="primary" onClick={() => navigate("/new")}>
              New note
            </Button>
          </div>
        </div>

        {status === "error" ? (
          <div style={{ marginBottom: 12 }}>
            <InlineMessage kind="error">
              {error}{" "}
              <button
                onClick={refresh}
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
                Retry
              </button>
            </InlineMessage>
          </div>
        ) : null}

        <Card style={{ padding: 14 }}>
          {status === "loading" ? (
            <div style={{ padding: 14, color: styles.colors.subtleText }}>
              Loading notes…
            </div>
          ) : null}

          {status !== "loading" && sortedNotes.length === 0 ? (
            <div style={{ padding: 14 }}>
              <InlineMessage kind="info">
                No notes yet. Click <strong>New note</strong> to create your first one.
              </InlineMessage>
            </div>
          ) : null}

          {sortedNotes.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {sortedNotes.map((n) => (
                <Link
                  key={n.id}
                  to={`/notes/${encodeURIComponent(n.id)}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      border: `1px solid ${styles.colors.border}`,
                      borderRadius: 12,
                      background: "white",
                      padding: 14,
                      transition: "transform 120ms ease, box-shadow 120ms ease",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: styles.colors.text,
                        marginBottom: 6,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={n.title || "Untitled"}
                    >
                      {n.title || "Untitled"}
                    </div>
                    <div style={{ fontSize: 13, color: styles.colors.subtleText, lineHeight: 1.5 }}>
                      {snippet(n.content) || <span style={{ fontStyle: "italic" }}>No content</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </Card>

        <div style={{ marginTop: 14, color: styles.colors.subtleText, fontSize: 12 }}>
          API base:{" "}
          <code>
            {process.env.REACT_APP_API_BASE_URL ||
              process.env.REACT_APP_API_BASE ||
              "http://localhost:3001"}
          </code>
        </div>
      </Container>
    </div>
  );
}
