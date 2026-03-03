import { DealStatus } from "./Enum.js";

export interface CreateDealRequest {
    ChatRoomId: string;
    BuyerId: string;
    SellerId: string;
    Title: string;
    Description: string;
    Amount: number;
    Status: DealStatus;
}
