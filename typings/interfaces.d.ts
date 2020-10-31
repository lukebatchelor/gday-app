// For shared global interface types.

declare global {
  interface IUser {
    id: string;
    userName: string;
    displayName: string;
    email: string;
    avatarUrl: string;
    status: string;
    isAdmin: boolean;
  }
}

export type ExpressRequestUser = IUser;
