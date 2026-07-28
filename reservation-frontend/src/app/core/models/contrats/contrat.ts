import { StatutContrat } from "./statut-contrat.enum";
import { Reservation } from "../reservations/reservation";

export class Contrat {

  contratId!: string;
  numeroContrat!: string;
  titre!: string;
  description?: string;
  conditions?: string;
  engagements?: string;
  dateDebut?: string;
  dateFin?: string;
  montant?: number;
  urlDocument?: string;
  statut!: StatutContrat;

  reservation!: Reservation;

  dateCreation!: string;
  dateModification?: string;

  constructor(
    contratId: string,
    numeroContrat: string,
    titre: string,
    statut: StatutContrat,
    reservation: Reservation
  ) {
    this.contratId = contratId;
    this.numeroContrat = numeroContrat;
    this.titre = titre;
    this.statut = statut;
    this.reservation = reservation;
  }
}