'use client';

import ChatBoard from "@/components/ChatBoard";
import PresetCard from "@/components/PresetCard";
import { ChatState } from "@/types/chat";
import { useState } from "react";

export default function Main() {
  const [chatState, setChatState] = useState<ChatState | null>({
  preset: {
    id: "default",
    name: "Default",
    description: "Default preset for chat",
    thinking: false,
    remember: true,
    config: {
      systemInstruction: "You are a helpful assistant.",
    },
  },
  history: [],
});

  return (
    <>
    <div className="flex">
      <ChatBoard chatState={chatState} setChatState={setChatState} />
      <PresetCard chatState={chatState} setChatState={setChatState} />
    </div>
    </>
  )
}