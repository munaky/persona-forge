"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChatState } from "@/types/chat";
import { useEffect, useState } from "react";

interface EditPresetDialogProps {
  chatState: ChatState | null;
  setChatState: (state: ChatState | null) => void;
}

export default function EditPresetDialog({
  chatState,
  setChatState,
}: EditPresetDialogProps) {
  const [name, setName] = useState<string>(chatState?.preset.name || "");
  const [description, setDescription] = useState<string>(chatState?.preset.description || "");
  const [systemInstruction, setSystemInstruction] = useState<string>(chatState?.preset.config.systemInstruction || "");
  const [remember, setRemember] = useState<boolean>(chatState?.preset.remember || false);
  const [thinking, setThinking] = useState<boolean>(chatState?.preset.thinking || false);
  const [search, setSearch] = useState<boolean>(chatState?.preset.search || false);

  useEffect(() => {
    if (chatState?.preset) {
      setName(chatState.preset.name);
      setDescription(chatState.preset.description);
      setSystemInstruction(chatState.preset.config.systemInstruction);
      setRemember(chatState.preset.remember);
      setThinking(chatState.preset.thinking);
      setSearch(chatState.preset.search || false)
    }
  }, [chatState]);

  const handleSave = () => {
    if (chatState) {
      const newPreset = {
        ...chatState.preset,
        name,
        description,
        config: { ...chatState.preset.config, systemInstruction },
        remember,
        thinking,
        search,
      };

      setChatState({ ...chatState, preset: newPreset });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Preset</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Preset Editor</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Preset name"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this preset"
              rows={3}
              className="max-h-[200px] overflow-y-auto resize-none"
            />
          </div>

          {/* System Instruction */}
          <div className="space-y-2">
            <Label htmlFor="systemInstruction">System Instruction</Label>
            <Textarea
              id="systemInstruction"
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              placeholder="Special instructions for AI behavior"
              rows={4}
              className="max-h-[200px] overflow-y-auto resize-none"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(val) => setRemember(!!val)}
            />
            <Label htmlFor="remember">Remember</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="thinking"
              checked={thinking}
              onCheckedChange={(val) => setThinking(!!val)}
            />
            <Label htmlFor="thinking">Thinking</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="search"
              checked={search}
              onCheckedChange={(val) => setSearch(!!val)}
            />
            <Label htmlFor="search">Search</Label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-2 pt-2">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSave}>
                Save
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
