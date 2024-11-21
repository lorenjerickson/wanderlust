import { Role } from "./role.js";

export interface User {
  fullName: string;
  phoneNumber: string;
  zipCode: string;
  emailAddress: string;
  roles: Role[];
  avatar?: string;
  password?: string;
  access?: {
    lastActive: string;
    active?: boolean;
    isBanned: boolean;
    isSuspended: boolean;
    isApproved: boolean;
    lastOnline: string;
  };
  social?: {
    discord: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
  revisions: {
    created: string;
    updated: string;
    createdBy: string;
    updatedBy: string
  }
};
