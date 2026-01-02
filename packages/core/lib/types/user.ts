import { Role } from './role.js'

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned',
  Suspended = 'suspended',
}

export interface User {
  username: string
  fullName: string
  phoneNumber: string
  zipCode: string
  emailAddress: string
  roles: Role[]
  avatar?: string
  password?: string
  status: UserStatus
  invitation?: {
    invitationCode: string
    email: string
    invitedBy: string
  }
  // access?: {
  //   lastActive: string;
  //   active?: boolean;
  //   isBanned: boolean;
  //   isSuspended: boolean;
  //   isApproved: boolean;
  //   lastOnline: string;
  // };
  // social?: {
  //   discord: string;
  //   twitter: string;
  //   instagram: string;
  //   facebook: string;
  // };
  // revisions: {
  //   createdOn: string;
  //   createdBy: string;
  //   updatedOn: string;
  //   updatedBy: string
  // }
}
