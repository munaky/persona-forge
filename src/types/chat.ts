export interface ChatRequestPayload {
    preset: Preset;
    userInput: Array<{
        text: string;
    }>;
    history: Message[];
}

export interface ChatState {
    preset: Preset;
    history: Message[];
}

export interface Preset {
    id: string;
    name: string;
    description: string;
    thinking: boolean;
    remember: boolean;
    config: {
        systemInstruction: string;
    };
}

export interface Message {
    id: string;
    role: "user" | "model";
    parts: Array<{
        text: string;
    }>
};