import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NotesList from "./pages/NotesList";
import NoteEditor from "./pages/NoteEditor";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  /** Root application component providing routing for the Notes UI. */
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<NotesList />} />
        <Route path="/new" element={<NoteEditor />} />
        <Route path="/notes/:id" element={<NoteEditor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
