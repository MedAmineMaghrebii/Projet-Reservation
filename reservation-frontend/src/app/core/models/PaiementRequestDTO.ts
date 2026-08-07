import { MethodePaiement } from "./paiement/MethodePaiement.enum";
import { TypePaiement } from "./paiement/TypePaiement.enum";


export interface PaiementRequestDTO {
  montant: number;
  datePaiement: string;
  typePaiement: TypePaiement;
  methodePaiement: MethodePaiement;
  reservationId: number;
  notes?: string;
}