import { Behavior, GoogleGenAI, Type } from "@google/genai";
import { ChatRequestPayload } from "@/types/chat";
import axios from "axios";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
});

export async function POST(req: Request) {
    const body: ChatRequestPayload = await req.json()

    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: body.preset.config.systemInstruction,
            thinkingConfig: {
                thinkingBudget: body.preset.thinking ? -1 : 0,
            },
            responseModalities: ['TEXT'],
            tools: [
                body.preset.search ? {
                    googleSearch: {}
                } : {},
                body.preset.functionCalling ? {
                    functionDeclarations: body.preset.functionCalling.functionDeclarations
                } : {},
            ]
        },
        history: body.preset.remember ? body.history : []
    });

    const res = await chat.sendMessageStream({
        message: body.userInput,
    })

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of res) {
                let text = chunk.text || '';

                if(chunk.functionCalls && chunk.functionCalls.length > 0){
                    try {
                        const res = await axios.post('http://localhost:4000/execute', chunk.functionCalls[0]);
                        const callResult = res.data    
                        text += `\n\nFunction Call Result:\n${callResult}\n\n`
                    } catch (error) {
                        text += `\n\nFunction Call Error:\n${error}\n\n`
                    }
                }

                controller.enqueue(new TextEncoder().encode(text));
            }
            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
        },
    });
}