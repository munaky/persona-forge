export interface ChatRequestPayload {
    preset: Preset;
    userInput: Part[];
    history: Message[];
}

export interface ChatState {
    preset: Preset;
    history: Message[];
}

export interface Preset {
    id: string;
    local?: boolean;
    name: string;
    description: string;
    thinking: boolean;
    remember: boolean;
    search?: boolean;
    functionCalling?: {
        functionDeclarations: any[]
    };
    config: {
        systemInstruction: string;
    };
}

export type Part = {
    text: string;
} | {
    inlineData: {
        mimeType: string;
        data: string;
    }
}

export interface Message {
    id: string;
    role: "user" | "model";
    parts: Part[]
};