export enum EMessage {
    SUCCESS = "MESSAGE_SUCCESS",
    ERROR = "MESSAGE_ERROR",
}

export type MessageType = {
    status: EMessage;
    message: string;
};
