import { User } from "../user/user";
export class Log {

  logId!: number;
  user?: User;
  action!: string;
  entite?: string;
  entiteId?: number;
  description?: string;
  ipAddress?: string;
  dateAction!: string;

  constructor(
    logId: number,
    action: string,
    dateAction: string
  ) {
    this.logId = logId;
    this.action = action;
    this.dateAction = dateAction;
  }
}