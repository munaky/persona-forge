'use client';

import ChatBoard from "@/components/ChatBoard";
import FullScreenLoader from "@/components/FullScreenLoading";
import PresetCard from "@/components/PresetCard";
import { ChatState } from "@/types/chat";
import { useEffect, useState } from "react";

const defaultChatState: ChatState = {
  preset: {
    id: "new",
    name: "Default",
    description: "Default preset for chat",
    thinking: false,
    remember: true,
    config: {
      systemInstruction: "You are a helpful assistant.",
    },
  },
  history: [],
}


export default function Main() {
  const [chatState, setChatState] = useState<ChatState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const chatStateFromStorage = localStorage.getItem("chatState");
    if (chatStateFromStorage) {
      setChatState(JSON.parse(chatStateFromStorage));
    } else {
      setChatState(defaultChatState);
    }
    setLoading(false);
  }, [])

  useEffect(() => {
    if (chatState) {
      localStorage.setItem("chatState", JSON.stringify(chatState));
    }
  }, [chatState]);

  return (
    <>
    <div className="grid grid-cols-12 overflow-hidden h-screen max-h-screen max-w-screen">
      <FullScreenLoader loading={loading} />
      <div className="col-span-9">
        <ChatBoard chatState={chatState} setChatState={setChatState} />
      </div>
      <div className="col-span-3">
        <PresetCard chatState={chatState} setChatState={setChatState} />
      </div>
    </div>
    </>
  )
}