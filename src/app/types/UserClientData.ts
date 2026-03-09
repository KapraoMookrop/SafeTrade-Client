import { KycStatus, UserRole, UserStatus } from "./Enum";

export interface UserClientData {
    FullName: string;
    Email: string;
    Phone: string;
    Role: UserRole;
    KycStatus: KycStatus;
    UserStatus: UserStatus;
    IsEnabled2FA: boolean;
}
