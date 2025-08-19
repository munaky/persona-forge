import { ChatRequestPayload } from "@/types/chat";
import {api} from "./api";

export const chatApi = {
  sendMessage: async (payload: ChatRequestPayload) => {
    console.log('chatApi.sendMessage', payload);

    const res = await api.post("/chat", payload);

    console.log('chatApi.sendMessage response', res.data);
    return res.data; 
  },
};