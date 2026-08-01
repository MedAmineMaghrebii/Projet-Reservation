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
  datePaiement!: string;
  urlRecuPdf?: string;
  notes?: string;
  creePar?: User;
  dateCreation!: string;

  constructor(
    paiementId: string,
    montant: number,
    typePaiement: TypePaiement,
    methodePaiement: MethodePaiement,
    datePaiement: string
  ) {
    this.paiementId = paiementId;
    this.montant = montant;
    this.typePaiement = typePaiement;
    this.methodePaiement = methodePaiement;
    this.datePaiement = datePaiement;
  }
}