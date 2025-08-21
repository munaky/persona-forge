import { NextResponse } from "next/server";
import { GoogleGenAI, HarmBlockMethod, HarmBlockThreshold, HarmCategory, HarmProbability } from "@google/genai";
import { ChatRequestPayload } from "@/types/chat";
import { resSuccess } from "@/lib/response-format";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
});

export async function POST(req: Request) {
    const body: ChatRequestPayload = await req.json()
    const id: string = crypto.randomUUID()

    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            ...body.preset.config,
            thinkingConfig: {
                thinkingBudget: body.preset.thinking ? -1 : 0,
            },
            responseModalities: ['TEXT'],
        },
        history: body.preset.remember ? body.history : []
    });

    const res = await chat.sendMessageStream({
        message: body.userInput,
    })

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of res) {
                controller.enqueue(new TextEncoder().encode(chunk.text));
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