import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Join() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [duration, setDuration] = useState(20);


  // Check if user is not directly going to /join 
  // if he is it will redirect to entry page and let his set username
  useEffect(() => {
    const stored = localStorage.getItem("chat_username");
    if (!stored || !stored.trim()) {
      navigate("/");
    }
  }, [navigate]);

  const canJoin = useMemo(() => roomCode.trim().length > 0, [roomCode]);

  const handleJoin = () => {
    const username = localStorage.getItem("chat_username") || "";
    const code = roomCode.trim().toUpperCase();
    const mins = Math.max(1, Math.min(60, Number(duration) || 1));
    if (!code) return;
    navigate("/chat", {
      state: {
        username: username.trim(),
        roomCode: code,
        duration: mins,
      },
    });
  };

  const handleGenerate = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(id);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 flex items-center justify-center font-mono">
      <div className="w-full max-w-md border border-zinc-700 p-8">
        <div className="text-xs uppercase text-zinc-500 mb-2">Room Code</div>
        <div className="flex gap-3">
          <input
            className="flex-1 bg-black border border-zinc-700 px-3 py-2 text-zinc-200 focus:outline-none"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="ABC123"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="button"
            className="border border-zinc-700 px-3 text-xs text-zinc-300 hover:text-white"
            onClick={handleGenerate}
          >
            Generate
          </button>
        </div>
        <div className="text-xs uppercase text-zinc-500 mt-6 mb-2">
          Duration (minutes)
        </div>
        <input
          type="number"
          min={1}
          max={60}
          className="w-full bg-black border border-zinc-700 px-3 py-2 text-zinc-200 focus:outline-none"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button
          className="mt-6 w-full border border-yellow-500 py-2 text-yellow-300 hover:text-yellow-100"
          onClick={handleJoin}
          disabled={!canJoin}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
