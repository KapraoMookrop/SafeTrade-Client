import type { MessageData } from "./MessageData.js";

export interface MessageDataList {
    Messages: MessageData[];
    NextCursor: Date;
    HasMore: boolean;
    CurrentUserName: string;
    OtherUserName: string;
}