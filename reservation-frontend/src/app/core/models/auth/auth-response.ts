import { Role } from "./role";
export class AuthResponse {

  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  role: Role;

  constructor(
    accessToken: string,
    refreshToken: string,
    tokenType: string,
    userId: number,
    email: string,
    role: Role
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenType = tokenType;
    this.userId = userId;
    this.email = email;
    this.role = role;
  }
}