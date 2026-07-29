import { StatutReservation } from './statut-reservation.enum';
import { Client } from '../clients/client';
import { Salle } from '../salle/salle';
import { Service } from '../service/service';
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

  // ✅ AJOUT DES SERVICES CHOISIS
  services: Service[] = [];

  dateCreation!: string;
  dateModification?: string;

  constructor(
    reservationId?: number,
    numeroReservation?: string,
    date?: string,
    heureDebut?: string,
    heureFin?: string,
    statut?: StatutReservation,
    montantTotal?: number,
    client?: Client,
    salle?: Salle,
    services: Service[] = [] // 👈 Optionnel dans le constructeur
  ) {
    if (reservationId) this.reservationId = reservationId;
    if (numeroReservation) this.numeroReservation = numeroReservation;
    if (date) this.date = date;
    if (heureDebut) this.heureDebut = heureDebut;
    if (heureFin) this.heureFin = heureFin;
    if (statut) this.statut = statut;
    if (montantTotal) this.montantTotal = montantTotal;
    if (client) this.client = client;
    if (salle) this.salle = salle;
    this.services = services;
  }
}