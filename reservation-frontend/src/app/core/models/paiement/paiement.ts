import { Reservation } from "../reservations/reservation";
import { TypePaiement } from "./TypePaiement.enum";
import { MethodePaiement } from "./MethodePaiement.enum";
import { User } from "../user/user";

export class Paiement {
  paiementId?: string;
  reservation!: Reservation;
  montant!: number;
  typePaiement!: TypePaiement;
  methodePaiement!: MethodePaiement;
  datePaiement!: string; // ou Date selon comment tu gères les dates (souvent string avec l'API REST JSON)
  urlRecuPdf?: string;
  notes?: string;
  creePar?: User;
  dateCreation!: string;

  constructor(
    paiementId?: string,
    montant: number = 0,
    typePaiement?: TypePaiement,
    methodePaiement?: MethodePaiement,
    datePaiement: string = ''
  ) {
    this.paiementId = paiementId;
    this.montant = montant;
    if (typePaiement) this.typePaiement = typePaiement;
    if (methodePaiement) this.methodePaiement = methodePaiement;
    this.datePaiement = datePaiement;
  }
}