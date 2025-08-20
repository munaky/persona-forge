"use client";

import React, { useState, useRef, useEffect } from "react";
import { FileUp, RotateCcw, Send, Trash2Icon } from "lucide-react";
import { ChatRequestPayload, ChatState, Message, Part, Preset } from "@/types/chat";
import { chatApi } from "@/lib/api/client/chat";
import { Response } from "@/components/ai-elements/response";
import ListFileCard from "./ListFileCard";
import { fileToBase64, getFileId } from "@/lib/utils";

interface ChatBoardProps {
  chatState: ChatState | null;
  setChatState: (state: any) => void;
}

const findText = (parts: Part[]) => {
  return parts.map(part => (part as any).text || '').join("");
}

const makeMessage = (parts: Part[]): Message => {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    parts: [...parts],
  };
}

const makePayload = (userInput: Part[], messages: Message[], preset: Preset | null): ChatRequestPayload => {
  if (!preset) {
    throw new Error("Preset is required to make a chat request payload");
  }

  return {
    preset,
    userInput,
    history: messages,
  };
}

const textToParts = (text: string) => {
  return [
    { text }
  ]
}

const filesToParts = async (files: File[]) => {
  let parts: Part[] = [];

  for (const file of files) {
    const base64 = await fileToBase64(file)

    if (!base64 || typeof base64 != 'string') continue
    parts.push({
      inlineData: {
        mimeType: file.type,
        data: base64
      }
    })
  }

  return parts
}

const countFilesInParts = (parts: Part[]) => {
  return parts.filter(part => !(part as any).text).length;
}

export default function ChatBoard({ chatState, setChatState }: ChatBoardProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const preset: Preset | null = chatState?.preset || null;
  const allowedMimeType: string[] = ['application/pdf', 'image/png', 'image/jpeg'];
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files?.[0]
    if (!selectedFiles) return;
    if (files.find(f => getFileId(f) == getFileId(selectedFiles))) return;
    console.log("Selected files:", selectedFiles);

    setFiles(prev => [...prev, selectedFiles]);

    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleClearChat = () => {
    setInput("");
    if (!chatState) return;
    setChatState({ ...chatState, history: [] });

  }

  const handleSend = async () => {
    try {
      if (!input.trim() || !chatState) return;
      setLoading(true);

      const textPart = textToParts(input);
      const fileParts = await filesToParts(files);
      const message = makeMessage([...textPart, ...fileParts])

      // Store use chat to ChatState
      setChatState((prev: ChatState) => ({
        ...prev,
        history: [...prev.history, message]
      }));

      setInput("");
      setFiles([]);

      const payload: ChatRequestPayload = makePayload([...textPart, ...fileParts], chatState.history, preset);

      const res = await chatApi.sendMessage(payload);
      console.log("Response from chat API:", res);

      // Add AI response to chat
      setChatState((prev: ChatState) => ({
        ...prev,
        history: [...prev.history, res.data]
      }));

      setLoading(false);
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

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatState?.history]);

  return (
    <div className="grow flex flex-col h-[100vh] mx-auto border border-gray-800 shadow-lg bg-gray-900">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {chatState?.history.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`relative rounded-2xl px-4 py-2 max-w-[80%] ${msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-100"
                }`}
            >
              <Response className="max-w-[20wh]">{findText(msg.parts)}</Response>
              {msg.parts.length > 1 && (
                <p
                  className="absolute right-3 -bottom-4 font-semibold text-xs text-gray-400"
                >
                  with {countFilesInParts(msg.parts)} files.
                </p>)}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-3 flex items-center gap-2">
        <div className="relative w-full">
          {files.length > 0 && (
            <div className="absolute right-0   bottom-full origin-bottom">
              <ListFileCard files={files} setFiles={setFiles} />
            </div>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Type your message..."
            className="flex-1 w-full resize-none rounded-xl p-3 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={loading}
          className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition"
        >
          <Send size={20} />
        </button>
        <label
          htmlFor="fileInput"
          className="p-3 bg-green-600 hover:bg-green-700 rounded-xl text-white transition"
        >
          <FileUp size={20} />
          <input
            ref={inputFileRef}
            onChange={handleInputFile}
            type="file"
            id="fileInput"
            className="hidden"
          />
        </label>
        <button
          onClick={handleClearChat}
          disabled={loading}
          className="p-3 bg-red-600 hover:bg-red-700 rounded-xl text-white transition"
        >
          <Trash2Icon size={20} />
        </button>
      </div>
    </div>
  );
}
