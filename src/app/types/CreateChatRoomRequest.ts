import { ChatRoomStatus } from "./Enum.js";

export interface CreateChatRoomRequest {
    BuyerId: string;
    SellerId: string;
    Status: ChatRoomStatus
}
