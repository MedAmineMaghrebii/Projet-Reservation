import { StatutReservation } from './statut-reservation.enum';
import { Client } from '../clients/client';
import { Salle } from '../salle/salle';

export class Reservation {

  reservationId!: number;
  numeroReservation!: string;
  date!: string;
  heureDebut!: string;      
  heureFin!: string;
  statut!: StatutReservation;
  montantTotal!: number;
  tokenReservation?: string;
  notes?: string;

  client!: Client;
  salle!: Salle;

  dateCreation!: string;
  dateModification?: string;

  constructor(
    reservationId: number,
    numeroReservation: string,
    date: string,
    heureDebut: string,
    heureFin: string,
    statut: StatutReservation,
    montantTotal: number,
    client: Client,
    salle: Salle
  ) {
    this.reservationId = reservationId;
    this.numeroReservation = numeroReservation;
    this.date = date;
    this.heureDebut = heureDebut;
    this.heureFin = heureFin;
    this.statut = statut;
    this.montantTotal = montantTotal;
    this.client = client;
    this.salle = salle;
  }
}