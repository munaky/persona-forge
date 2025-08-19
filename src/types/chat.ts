export interface ChatRequestPayload {
    preset: Preset;
    userInput: Array<{
        text: string;
    }>;
    history: Message[];
}

export interface Preset {
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