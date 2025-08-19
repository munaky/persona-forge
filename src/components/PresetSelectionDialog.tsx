"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ChatState, Preset } from "@/types/chat";
import { useEffect, useState } from "react";
import { presetsApi } from "@/lib/api/client/preset";

const defaultPresets: Preset = {
    id: crypto.randomUUID(),
    name: 'Custom',
    description: 'Build your own preset.',
    config: { systemInstruction: '' },
    remember: false,
    thinking: false,

}

interface PresetSelectionDialogProps {
    chatState: ChatState | null;
    setChatState: (state: ChatState | null) => void;
}

export default function PresetSelectionDialog({ chatState, setChatState }: PresetSelectionDialogProps) {
    const [presets, setPresets] = useState<Preset[]>([]);

    const setPreset = (presetId: string) => {
        const newPreset = presets.find(p => p.id === presetId);

        setChatState(chatState && { ...chatState, preset: newPreset || defaultPresets });
    }

    useEffect(() => {
        async function fn() {
            try {
                const res = await presetsApi.getPresets();
                console.log('Fetched presets:', res.data);
                setPresets([defaultPresets, ...res.data]);
            } catch (error) {
                console.error("Error fetching presets:", error);
            }
        }

        fn();
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Change Preset</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" aria-describedby={undefined}>
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
