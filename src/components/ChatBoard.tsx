"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { ChatRequestPayload, ChatState, Message, Preset } from "@/types/chat";
import { chatApi } from "@/lib/api/client/chat";
import { Response } from "@/components/ai-elements/response";
import { set } from "zod/v4";

interface ChatBoardProps {
  chatState: ChatState | null;
  setChatState: (state: ChatState | null) => void;
}

const findText = (parts: Array<{ text: string }>) => {
  return parts.map(part => part.text || '').join("");
}

const makeUserInput = (text: string): any => {
  return [{ text }];
}

const makeMessage = (text: string): Message => {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    parts: [{ text }],
  };
}

const makePayload = (userMessage: string, messages: Message[], preset: Preset | null): ChatRequestPayload => {
  if (!preset) {
    throw new Error("Preset is required to make a chat request payload");
  }

  return {
    preset,
    userInput: makeUserInput(userMessage),
    history: messages,
  };
}

export default function ChatBoard({ chatState, setChatState }: ChatBoardProps) {
  const preset: Preset | null = chatState?.preset || null;
  const [messages, setMessages] = useState<Message[]>(chatState?.history || []);
  
  const [input, setInput] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const setChatStateHistory = () => {
    if (chatState) {
      setChatState({ ...chatState, history: messages });
    }
  }

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    try {
      if (!input.trim()) return;

      // Add user message to chat
      setMessages(prev => [...prev, makeMessage(input)]);
      setChatStateHistory();
      setInput("");

      const payload: ChatRequestPayload = makePayload(input, messages, preset);

      const res = await chatApi.sendMessage(payload);
      console.log("Response from chat API:", res);

      // Add AI response to chat
      setMessages(prev => [...prev, res.data]);
      setChatStateHistory();

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grow flex flex-col h-[100vh] mx-auto border border-gray-800 shadow-lg bg-gray-900">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-[80%] ${msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-100"
                }`}
            >
              <Response className="max-w-[20wh]">{findText(msg.parts)}</Response>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-3 flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 resize-none rounded-xl p-3 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
        />
        <button
          onClick={handleSend}
          className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
