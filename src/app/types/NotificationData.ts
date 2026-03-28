import { NotificationType } from "./Enum";

export interface NotificationData {
    Id: string;
    UserId: string;
    Type: NotificationType;
    Title: string;
    Message: string;
    RelatedId: string;
    CreatedAt: Date;
    IsRead: boolean;
}