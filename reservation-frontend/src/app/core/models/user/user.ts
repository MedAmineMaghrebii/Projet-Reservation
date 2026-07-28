import { Role } from "../auth/role";
export class User {

  userId!: number;
  email!: string;
  lastname!: string;
  firstname!: string;
  role!: Role;

  constructor(
    userId: number,
    email: string,
    lastname: string,
    firstname: string,
    role: Role
  ) {
    this.userId = userId;
    this.email = email;
    this.lastname = lastname;
    this.firstname = firstname;
    this.role = role;
  }
}