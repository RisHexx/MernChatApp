import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Entry from "./pages/Entry.jsx";
import Join from "./pages/Join.jsx";
import Chat from "./pages/Chat.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Entry />} />
      <Route path="/join" element={<Join />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
