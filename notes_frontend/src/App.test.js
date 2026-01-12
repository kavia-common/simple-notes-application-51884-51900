import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { __dangerous__clearAllNotes, createNote } from "./storage/notesStorage";

beforeEach(() => {
  __dangerous__clearAllNotes();
});

test("renders notes list heading", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  const heading = screen.getByRole("heading", { name: /notes/i });
  expect(heading).toBeInTheDocument();
});

test("shows an existing note title after creating one in storage", () => {
  createNote({ title: "Test Note", content: "Hello" });

  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText("Test Note")).toBeInTheDocument();
});
