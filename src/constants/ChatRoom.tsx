import { UserType } from "../redux/userReducer";
import { ChatMessageType } from "./ChatMessage";

export type ChatRoomType = {
    id: number;
    messages: ChatMessageType[];
    receivers: UserType[];
    sender: UserType;
};
