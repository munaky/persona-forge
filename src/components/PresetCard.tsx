'use client';

import { useState } from "react";
import { ChatState, Preset } from "@/types/chat";
import PresetSelectionDialog from "./PresetSelectionDialog";

interface PresetCardProps {
    chatState: ChatState | null;
    setChatState: (state: ChatState | null) => void;
}

const defaultPresets: Preset = {
    id: crypto.randomUUID(),
    name: 'None',
    description: 'Default preset.',
    config: { systemInstruction: '' },
    remember: false,
    thinking: false,

}

export default function PresetCard({ chatState, setChatState }: PresetCardProps) {
    const preset = chatState?.preset || defaultPresets;

    const setSystemInstruction = (char: string) => {
        if (chatState) {
            const newPreset = { ...preset, config: { ...preset.config, systemInstruction: char } };
            setChatState({ ...chatState, preset: newPreset });
        };
    }

    const setRemember = () => {
        if (chatState) {
            const newPreset = { ...preset, remember: !preset.remember };
            setChatState({ ...chatState, preset: newPreset });
        };
    }

    const setThinking = () => {
        if (chatState) {
            const newPreset = { ...preset, thinking: !preset.thinking };
            setChatState({ ...chatState, preset: newPreset });
        }
    }

    return (
        <div className="w-[300px] h-screen bg-gray-800 text-white p-4 flex flex-col gap-4">
            {/* Select Menu */}
            <PresetSelectionDialog chatState={chatState} setChatState={setChatState} />

            {/* Preset Name */}
            <h2 className="text-lg font-semibold border-b-2">Current Preset: {preset.name}</h2>

            {/* System Instruction */}
            <div className="flex flex-col">
                <label className="mb-1">System Instruction</label>
                <textarea
                    className="bg-gray-700 p-2 rounded resize-none h-24"
                    value={preset?.config.systemInstruction || ""}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={preset.remember} onChange={setRemember} />
                    Remember
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={preset.thinking} onChange={setThinking} />
                    Thinking
                </label>
            </div>

            {/* Description */}
            <div>
                <p className="text-white">Description</p>
                <p className="text-gray-400">{preset?.description || "Description"}</p>
            </div>
        </div>
    );
}
