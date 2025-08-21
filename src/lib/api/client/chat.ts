import { ChatRequestPayload } from "@/types/chat";
import {api} from "./api";

export const chatApi = {
  sendMessage: async (payload: ChatRequestPayload) => {
    console.log('chatApi.sendMessage', payload);

    const res = await api.post("/chat", payload);

    console.log('chatApi.sendMessage response', res.data);
    return res.data; 
  },
  
  sendMessageStream: async (payload: ChatRequestPayload, onChunk: (chunk: string) => void) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  },
};