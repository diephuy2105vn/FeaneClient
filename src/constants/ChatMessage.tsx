export enum EChatMessage {
    CHAT = "CHAT",
    DELETE = "DELETE",
    EDIT = "EDIT",
}

export type ChatMessageType = {
    id?: number;
    chatRoomId?: number;
    sender: string;
    content: string;
    type: EChatMessage;
    createdAt?: string;
};
