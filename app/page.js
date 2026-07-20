"use client";

impor  { useState } from "react";
import { Send } from "lucide-react";

export default function CorrespondenceBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="h-96 overflow-y-auto border p-4 mb-4">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-blue-600" : "text-green-600"}>
            <strong>{m.role}:</strong> {m.content}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          className="border p-2 flex-grow" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="سولني..."
        />
        <button onClick={handleSendMessage} className="bg-black text-white p-2">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
