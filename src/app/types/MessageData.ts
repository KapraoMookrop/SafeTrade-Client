import type { MessageContentType, UserRole } from "./Enum.js";

export interface MessageData {
    Id: string;
    ChatRoomId: string;
    SenderId: string;
    SenderName: string;
    SenderRole: UserRole;
    ContentType: MessageContentType;
    Content: string;
    File_Url: string;
    File_Type: string;
    CreatedAt: Date;
}