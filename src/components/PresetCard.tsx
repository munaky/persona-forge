'use client';

import { ChatState, Preset } from "@/types/chat";
import PresetSelectionDialog from "./PresetSelectionDialog";
import { Button } from "./ui/button";
import EditPresetDialog from "./EditPresetDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useLocalPreset } from "@/hooks/useLocalPreset";
import { Label } from "@radix-ui/react-label";

interface PresetCardProps {
    chatState: ChatState | null;
    setChatState: (state: ChatState | null) => void;
}

const defaultPresets: Preset = {
    id: crypto.randomUUID(),
    name: "None",
    description: "Default preset.",
    config: { systemInstruction: "" },
    remember: false,
    thinking: false,
    search: false,
};

export default function PresetCard({ chatState, setChatState }: PresetCardProps) {
    const preset = chatState?.preset || defaultPresets;
    const { addPreset } = useLocalPreset();

    return (
        <Card className="max-lg:w-[100vw] w-full h-screen bg-gray-900 text-gray-100 flex flex-col rounded-none shadow-lg border-0 border-l border-gray-700">
            <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-lg font-semibold flex flex-col items-center gap-6">
                    <PresetSelectionDialog
                        chatState={chatState}
                        setChatState={setChatState}
                    />
                    <span>{preset.name}</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 flex-1 overflow-y-auto">
                <div>
                    <p className="text-sm text-gray-400 mb-1">System Instruction</p>
                    <div className="max-h-[50vh] overflow-auto bg-gray-800 p-3 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">
                        {preset.config.systemInstruction || "No system instruction provided."}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Checkbox checked={preset.remember} disabled id="remember" />
                            <Label htmlFor="remember" className="text-sm cursor-pointer">
                                Remember
                            </Label>
                        </div>
                        <p className="text-xs text-gray-400 pl-6">
                            Stores and recalls past conversations.
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={preset.thinking}
                                disabled
                                id="thinking"
                            />
                            <Label htmlFor="thinking" className="text-sm cursor-pointer">
                                Thinking
                            </Label>
                        </div>
                        <p className="text-xs text-gray-400 pl-6">
                            Improves reasoning before answering.
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={preset.search}
                                disabled
                                id="search"
                            />
                            <Label className="text-sm cursor-pointer">
                                Search
                            </Label>
                        </div>
                        <p id="search-desc" className="text-xs text-gray-400 pl-6">
                            Finds up-to-date info from the web.
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={preset.functionCalling ? true : false}
                                disabled
                                id="function-calling"
                            />
                            <Label htmlFor="function-calling" className="text-sm cursor-pointer">
                                Function Calling
                            </Label>
                        </div>
                        <p className="text-xs text-gray-400 pl-6">
                            Executes external functions or APIs.
                        </p>
                    </div>
                </div>
                {preset.functionCalling && (
                    <>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Function Declarations</p>
                            <div className="max-h-[50vh] overflow-auto bg-gray-800 p-3 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">
                                {JSON.stringify(preset.functionCalling.functionDeclarations) || '[]'}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Webhook Url</p>
                            <div className="max-h-[50vh] overflow-auto bg-gray-800 p-3 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">
                                {preset.functionCalling.webhookUrl || 'No Webhook Url provided.'}
                            </div>
                        </div>
                    </>
                )}

                {/* Description */}
                <div>
                    <p className="text-sm text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-300">{preset.description || "No description"}</p>
                </div>
            </CardContent>

            <CardFooter className="flex justify-center gap-3 pt-3">
                <EditPresetDialog chatState={chatState} setChatState={setChatState} />
                <Button
                    onClick={() => addPreset(preset)}
                    variant="default">
                    Save Preset
                </Button>
            </CardFooter>
        </Card>
    );
}
