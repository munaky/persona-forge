"use client";

import * as React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ChatState, Preset } from "@/types/chat";

const defaultPresets: Preset = {
    id: crypto.randomUUID(),
    name: 'None',
    description: 'Default preset.',
    config: { systemInstruction: '' },
    remember: false,
    thinking: false,

}
const presets: Preset[] = [
    defaultPresets,
    {
        id: crypto.randomUUID(),
        name: 'Creative',
        description: 'Preset for creative tasks.',
        config: { systemInstruction: 'You are a creative assistant.' },
        remember: true,
        thinking: true,
    },
];

interface PresetSelectionDialogProps {
    chatState: ChatState | null;
    setChatState: (state: ChatState | null) => void;
}


export default function PresetSelectionDialog({ chatState, setChatState }: PresetSelectionDialogProps) {
    const setPreset = (presetId: string) => {
        const newPreset = presets.find(p => p.id === presetId);

        setChatState(chatState && { ...chatState, preset: newPreset || defaultPresets });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Change Preset</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Preset Selection</DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-3">
                    {presets.map((preset) => (
                        <DialogTrigger 
                        key={preset.id}
                        onClick={() => setPreset(preset.id)}
                        className="w-full text-left max-h-[80vh]" 
                        >
                            <Card
                                className="cursor-pointer hover:bg-gray-700 transition-colors"
                            >
                                <CardContent>
                                    <h3 className="text-white font-semibold">{preset.name}</h3>
                                    <p className="text-gray-400 text-sm">{preset.description}</p>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
