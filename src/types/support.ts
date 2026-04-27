export interface ISupportTicket {
  _id: string;
  userId: UserInfo;
  name: string;
  email: string;
  subject: string;
  message: string;
  attachment?: string;
  updatedAt: string;
  status: SupportStatus;
  profileImage?: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  role: UserRole;
  email: string;
  profileImage: string;
}
export enum SupportStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "SUPER_ADMIN",
}
