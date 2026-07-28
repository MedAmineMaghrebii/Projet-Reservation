import { User } from "../user/user";
import { TypeNotification } from "./TypeNotification.enum";




export class Notification {

  notificationId!: string;
  user!: User;
  titre!: string;
  message?: string;
  type!: TypeNotification;
  lue: boolean = false;
  url?: string;
  dateCreation!: string;

  constructor(
    notificationId: string,
    user: User,
    titre: string,
    type: TypeNotification
  ) {
    this.notificationId = notificationId;
    this.user = user;
    this.titre = titre;
    this.type = type;
  }
}