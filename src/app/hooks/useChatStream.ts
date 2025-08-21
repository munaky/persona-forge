import { useState } from "react";
import { chatApi } from "@/lib/api/client/chat";
import { ChatRequestPayload } from "@/types/chat";

export function useChatStream() {
  const [response, setResponse] = useState<any>("");
  const [done, setDone] = useState(true);

  async function sendChatMessage(payload: ChatRequestPayload) {
    setResponse("");
    setDone(false);

    await chatApi.sendMessageStream(payload, (chunk) => {
        setResponse(chunk);
    });

    setDone(true);
  }

  return { response, done, sendChatMessage };
}
