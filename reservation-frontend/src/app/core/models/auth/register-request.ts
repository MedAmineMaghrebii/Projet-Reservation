export class RegisterRequest {

  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;

  constructor(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  ) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
  }
}