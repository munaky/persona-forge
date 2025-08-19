import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
});

export async function POST(req: Request){
    const body = await req.json()

    const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
        ...body.preset.config,
        thinkingConfig: {
            thinkingBudget: body.preset.thinking ? -1 : 0,
        },
        responseModalities: 'TEXT'
    },
    history: body.preset.remember ? body.history : []
  });

  const res = await chat.sendMessage({
        message: body.message,
    })

    return NextResponse.json(res);
}