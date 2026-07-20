"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  const send = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: input }] })
    });
    const data = await res.json();
    alert(data.reply);
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
