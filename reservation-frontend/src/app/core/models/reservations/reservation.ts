import { StatutReservation } from './statut-reservation.enum';
import { Client } from '../clients/client';
import { Salle } from '../salle/salle';
import { Service } from '../service/service';
import { TarificationSalle } from '../salle/tarification-salle';
import { TypePeriode } from '../salle/TypePeriode.enum';
import { Contrat } from '../contrats/contrat';
import { Paiement } from '../paiement/paiement';
import { User } from '../user/user';

export class Reservation {
  reservationId?: number;
  numeroReservation!: string;
  date!: string; // Format YYYY-MM-DD
  statut!: StatutReservation;
  montantAPayer?: number; // Corrigé de montantTotal à montantAPayer
  tokenReservation?: string;
  notes?: string;

  // Relations
  client!: Client;
  salle!: Salle;
  services: Service[] = [];
  tarificationsAppliquees: TarificationSalle[] = [];
  tarificationAppliquee?: TarificationSalle;
  typePeriode?: TypePeriode;
  contrat?: Contrat;
  paiements: Paiement[] = [];
  creePar?: User; // Ajouté pour correspondre au Java
  modifiePar?: User; // Ajouté pour correspondre au Java

  // Métadonnées système
  dateCreation?: string;
  dateModification?: string;

  constructor(
    reservationId?: number,
    numeroReservation?: string,
    date?: string,
    statut?: StatutReservation,
    montantAPayer?: number,
    client?: Client,
    salle?: Salle,
    services: Service[] = [],
    notes?: string,
    tokenReservation?: string,
    tarificationsAppliquees: TarificationSalle[] = [],
    contrat?: Contrat,
    paiements: Paiement[] = [],
    creePar?: User,
    modifiePar?: User,
    dateCreation?: string,
    dateModification?: string
  ) {
    if (reservationId !== undefined) this.reservationId = reservationId;
    if (numeroReservation) this.numeroReservation = numeroReservation;
    if (date) this.date = date;
    if (statut) this.statut = statut;
    if (montantAPayer !== undefined) this.montantAPayer = montantAPayer;
    if (client) this.client = client;
    if (salle) this.salle = salle;
    this.services = services;
    if (notes) this.notes = notes;
    if (tokenReservation) this.tokenReservation = tokenReservation;
    this.tarificationsAppliquees = tarificationsAppliquees;
    if (contrat) this.contrat = contrat;
    this.paiements = paiements;
    if (creePar) this.creePar = creePar;
    if (modifiePar) this.modifiePar = modifiePar;
    if (dateCreation) this.dateCreation = dateCreation;
    if (dateModification) this.dateModification = dateModification;
  }
}