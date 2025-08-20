"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChatState, Preset } from "@/types/chat";
import { useEffect, useState, useMemo, use } from "react";
import { presetsApi } from "@/lib/api/client/preset";
import { useLocalPreset } from "@/app/hooks/useLocalPreset";
import { Trash2Icon } from "lucide-react";

const customPreset: Preset = {
    id: crypto.randomUUID(),
    name: "Custom",
    description: "Build your own preset.",
    config: { systemInstruction: "" },
    remember: false,
    thinking: false,
};

interface PresetSelectionDialogProps {
    chatState: ChatState | null;
    setChatState: (state: ChatState | null) => void;
}

export default function PresetSelectionDialog({
    chatState,
    setChatState,
}: PresetSelectionDialogProps) {
    const { getPresets ,deletePreset } = useLocalPreset();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "builtin" | "local">("all");
    const [open, setOpen] = useState(false);
    const [presets, setPresets] = useState<Preset[]>([customPreset]);


    const setChatStatePreset = (presetId: string) => {
        const newPreset = presets.find((p) => p.id === presetId);
        if (!newPreset || !chatState) return;
        setChatState({ ...chatState, preset: newPreset });
        setOpen(false);
    };

    const handleDeletePreset = (presetId: string) => {
        deletePreset(presetId);
        setPresets((prev) => prev.filter((p) => p.id !== presetId));
    };

    useEffect(() => {
        if(!open) return;
        setPresets([
            ...presets.filter((p) => !p.local),
            ...getPresets()
        ]);
    }, [open]);

    // Fetch built-in presets
    useEffect(() => {
        async function fn() {
            try {
                const res = await presetsApi.getPresets();
                const formattedPresets = res.data.map((preset: any) => ({
                    ...preset,
                    id: preset._id,
                }));
                setPresets(prev => [...prev, ...formattedPresets]);
            } catch (error) {
                console.error("Error fetching presets:", error);
            }
        }
        fn();
    }, []);

    const filteredPresets = useMemo(() => {
        let list = presets;

        if (filter === "builtin") {
            list = list.filter((p) => !p.local);
        } else if (filter === "local") {
            list = list.filter((p) => p.local);
        }

        return list.filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
        );
    }, [presets, search, filter]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">Change Preset</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Preset Selection</DialogTitle>
                </DialogHeader>

                {/* 🔍 Filter Section */}
                <div className="mt-4 space-y-4">
                    {/* Search Input */}
                    <Input
                        placeholder="Search presets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Radio Filter */}
                    <RadioGroup
                        value={filter}
                        onValueChange={(val) =>
                            setFilter(val as "all" | "builtin" | "local")
                        }
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="builtin" id="builtin" />
                            <Label htmlFor="builtin">BuiltIn</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="local" id="local" />
                            <Label htmlFor="local">Local</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Preset List */}
                <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {filteredPresets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => setChatStatePreset(preset.id)}
                            className="w-full text-left"
                        >
                            <Card className="relative cursor-pointer hover:bg-gray-700 transition-colors">
                                {preset.local && (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePreset(preset.id);
                                        }}
                                        className="absolute top-2 right-2 p-1 rounded bg-red-500 hover:bg-red-600"
                                    >
                                        <Trash2Icon className="w-5 h-5" />
                                    </div>
                                )}
                                <CardContent>
                                    <h3 className="text-white font-semibold">{preset.name}</h3>
                                    <p className="text-gray-400 text-sm">{preset.description}</p>
                                </CardContent>
                            </Card>
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
