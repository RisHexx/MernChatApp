import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const animals = [
  "fox",
  "wolf",
  "owl",
  "raven",
  "lynx",
  "otter",
  "viper",
  "moth",
  "bear",
  "crow",
  "shark",
  "cobra",
  "tiger",
  "falcon",
  "koala",
  "rhino",
];

function generateUsername() {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const rand = Math.random().toString(36).slice(2, 7); // slice 2 because avoid (0 and . )
  return `${animal}-${rand}`;
}

export default function Entry() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  // Generating and Fetching userName
  useEffect(() => {
    const stored = localStorage.getItem("chat_username");
    if (stored && stored.trim()) {
      setUsername(stored);
      return;
    }
    const fresh = generateUsername();
    localStorage.setItem("chat_username", fresh);
    setUsername(fresh);
  }, []);

  const isValid = useMemo(() => username.trim().length > 0, [username]);

  const handleContinue = () => {
    const trimmed = username.trim();
    if (!trimmed) return;
    localStorage.setItem("chat_username", trimmed);
    navigate("/join");
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 flex items-center justify-center font-mono">
      <div className="w-full max-w-md border border-zinc-700 p-8">
        <div className="text-sm tracking-wide mb-6 text-zinc-400">
          This is a private chat app
        </div>
        <label className="block text-xs uppercase text-zinc-500 mb-2">
          Username
        </label>
        <div className="w-full bg-black border border-zinc-700 px-3 py-2 text-zinc-200">
          {username}
        </div>
        <button
          className="mt-6 w-full border border-yellow-500 py-2 text-yellow-300 hover:text-yellow-100"
          onClick={handleContinue}
          disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
