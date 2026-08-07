import { Espace } from "./espace/espace";
import { MethodePaiement } from "./paiement/MethodePaiement.enum";
import { Reservation } from "./reservations/reservation";
import { StatutTransaction } from "./StatutTransaction.enum";
import { TypeTransaction } from "./TypeTransaction.enum";


export class Transaction {
  transactionId?: number;
  libelle!: string;
  description?: string;
  montant!: number;
  type!: TypeTransaction;
  statut!: StatutTransaction;
  modePaiement?: MethodePaiement;
  dateTransaction?: string | Date;
  reservation?: Reservation | { reservationId: number };
  espace?: Espace | { espaceId: number };

  constructor(init?: Partial<Transaction>) {
    Object.assign(this, init);
  }
}