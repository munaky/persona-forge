import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { ChatRequestPayload } from "@/types/chat";
import { resSuccess } from "@/lib/response-format";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
});

export async function POST(req: Request) {
    const body: ChatRequestPayload = await req.json()

    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            ...body.preset.config,
            thinkingConfig: {
                thinkingBudget: body.preset.thinking ? -1 : 0,
            },
            responseModalities: ['TEXT']
        },
        history: body.preset.remember ? body.history : []
    });

    const res = await chat.sendMessage({
        message: body.userInput,
    })

    return NextResponse.json(resSuccess({
        data: {
            id: crypto.randomUUID(),
            role: "model",
            parts: [
                { text: res.text || "No response from AI" }
            ],
        }
    }));
}