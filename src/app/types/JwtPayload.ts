import { KycStatus, UserRole, UserStatus } from "./Enum";

export interface JwtPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  kycStatus: KycStatus;
  userStatus: UserStatus;
  isEnabled2FA: boolean;
}