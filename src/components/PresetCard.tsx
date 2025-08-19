'use client';

import { ChatState, Preset } from "@/types/chat";
import PresetSelectionDialog from "./PresetSelectionDialog";
import { Button } from "./ui/button";
import EditPresetDialog from "./EditPresetDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

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
};

export default function PresetCard({ chatState, setChatState }: PresetCardProps) {
  const preset = chatState?.preset || defaultPresets;

  return (
    <Card className="w-[320px] h-screen bg-gray-900 text-gray-100 flex flex-col rounded-none shadow-lg">
      <CardHeader className="pb-2 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>{preset.name}</span>
          <PresetSelectionDialog chatState={chatState} setChatState={setChatState} />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 overflow-y-auto">
        {/* System Instruction (non-editable) */}
        <div>
          <p className="text-sm text-gray-400 mb-1">System Instruction</p>
          <div className="bg-gray-800 p-3 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">
            {preset.config.systemInstruction || "No system instruction provided."}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={preset.remember} disabled />
            <span className="text-sm">Remember</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={preset.thinking} disabled />
            <span className="text-sm">Thinking</span>
          </label>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Description</p>
          <p className="text-sm text-gray-300">{preset.description || "No description"}</p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center gap-3 pt-3">
        <EditPresetDialog chatState={chatState} setChatState={setChatState} />
        <Button variant="default" className="rounded-xl">
          Save Preset
        </Button>
      </CardFooter>
    </Card>
  );
}
