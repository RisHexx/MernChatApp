import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket.js";


// we are not managing timer logic of frontend since it can modified by endusers.


// formating how our secods which is coming should look
// 123 seconds  -> 02 : 03 
function formatTime(seconds) {
  const safe = Math.max(0, seconds || 0);
  const m = String(Math.floor(safe / 60)).padStart(2, "0");
  const s = String(safe % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, roomCode, duration } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [isCreator, setIsCreator] = useState(false);
  const [copied, setCopied] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    if (!username || !roomCode || !duration) {
      navigate("/");
      return;
    }

    // since we did autoconnect: false , we have to do this here.
    socket.connect();

    // room-joined event listner 
    const handleJoined = (payload) => {
      setIsCreator(Boolean(payload?.isCreator));
      if (typeof payload?.remainingSeconds === "number") {
        setRemaining(payload.remainingSeconds);
      }
    };


    // When message event emmited.
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleDestroyed = () => {
      navigate("/");
    };


    // updating remaing time
    const handleTimer = (payload) => {
      if (typeof payload?.remainingSeconds === "number") {
        setRemaining(payload.remainingSeconds);
      }
    };


    /* “useEffect is only used to set up the listeners while mounting . The listeners themselves live independently 
    afterward.” 
    They keep listning to server side emits */
    socket.on("room-joined", handleJoined);
    socket.on("message", handleMessage);
    socket.on("room-destroyed", handleDestroyed);
    socket.on("timer-update", handleTimer);

    socket.emit("join-room", { username, roomCode, duration });

    //cleaning 
    return () => {
      socket.off("room-joined", handleJoined);
      socket.off("message", handleMessage);
      socket.off("room-destroyed", handleDestroyed);
      socket.off("timer-update", handleTimer);
      socket.disconnect();
    };
  }, [username, roomCode, duration, navigate]);


  // whenver new message comes we smooth scrolled to this ref div we placed end of message.
  // so we see latest message everytime
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    socket.emit("send-message", { roomCode, text });
    setInput("");
  };

  const handleDestroy = () => {
    socket.emit("destroy-room", { roomCode });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono flex flex-col">
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-zinc-500 flex items-center gap-2">
          Room: <span className="text-zinc-300">{roomCode}</span>
          <button
            className="border border-zinc-700 px-2 py-0.5 text-zinc-400 hover:text-white"
            onClick={() => {
              navigator.clipboard.writeText(roomCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-zinc-400 text-sm">{formatTime(remaining)}</div>
          {/* he can only destroy if he is creator */}
          {isCreator && (
            <button
              className="border border-red-600 px-3 py-1 text-xs text-red-400 hover:text-red-200"
              onClick={handleDestroy}
            >
              Destroy
            </button>
          )}
        </div>
      </div>
      {/* flex 1 means it will take all remaining height left */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => {
            // checking if msg is mine or not to get it location of left or right
            const mine = msg?.senderId === socket.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
              >
                <div className="text-xs text-zinc-500 mb-1">
                  {msg.username}
                </div>
                <div
                  className={`max-w-[75%] border border-zinc-700 px-3 py-2 text-sm whitespace-pre-wrap ${
                    mine ? "text-zinc-100" : "text-zinc-300"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          {/* for smooth scroolling we added above */}
          <div ref={endRef} />  

        </div>
      </div>

      <div className="border-t border-zinc-800 px-6 py-4 flex gap-3">
        <input
          className="flex-1 bg-black border border-zinc-700 px-3 py-2 text-zinc-200 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          className="border border-yellow-500 px-4 text-yellow-300 hover:text-yellow-100"
          onClick={handleSend}
          disabled={!canSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
