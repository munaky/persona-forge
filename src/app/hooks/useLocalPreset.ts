'use client';

import { Preset } from "@/types/chat";
import { useEffect, useState } from "react";

export function useLocalPreset() {
    const getPresets = (): Preset[] => {
        if (typeof window === "undefined") return [];

        const preset = localStorage.getItem('presets');
        const storedPresets = preset ? JSON.parse(preset) : [];
        return storedPresets;
    }

    const addPreset = (preset: Preset) => {
        if (typeof window === "undefined") return;

        let presets = getPresets();

        presets.push({
            ...preset,
            id: crypto.randomUUID(),
            local: true,
        });

        localStorage.setItem('presets', JSON.stringify(presets));
    }

    const deletePreset = (presetId: string) => {
        if (typeof window === "undefined") return;

        let presets = getPresets();
        presets = presets.filter((p: Preset) => p.id !== presetId);
        localStorage.setItem('presets', JSON.stringify(presets));
    }

    return { getPresets, addPreset, deletePreset };
}