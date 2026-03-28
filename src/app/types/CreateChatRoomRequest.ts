import { ChatRoomStatus } from "./Enum.js";

export interface CreateChatRoomRequest {
    CreatorId: string;
    InviteeId: string;
    Status: ChatRoomStatus
}
