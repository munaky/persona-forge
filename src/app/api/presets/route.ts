export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { resError, resSuccess } from "@/lib/response-format";
import { getDatabase } from "@/lib/mongodb";
import { Preset } from "@/types/chat";



export async function GET(req: Request) {
    try {
        const db = await getDatabase();

    const presets = await db.collection<Preset>("default_presets").find().toArray();

    return NextResponse.json(resSuccess({
        data: presets
    }))
    } catch (error) {
       console.error("Error fetching presets:", error); 
       return NextResponse.json(resError({
        message: "Failed to fetch presets",
        data: error,
    }))
    }
}