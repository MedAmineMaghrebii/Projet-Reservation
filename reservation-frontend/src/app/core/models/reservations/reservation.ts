import { StatutReservation } from './statut-reservation.enum';
import { Client } from '../clients/client';
import { Salle } from '../salle/salle';
import { Service } from '../service/service';
import { TarificationSalle } from '../salle/tarification-salle';
import { Contrat } from '../contrats/contrat';
import { Paiement } from '../paiement/paiement';
import { TypePeriode } from '../salle/TypePeriode.enum';

export class Reservation {
  reservationId?: number;
  numeroReservation!: string;
  date!: string; // Format YYYY-MM-DD
  statut!: StatutReservation;
  montantTotal!: number;
  tokenReservation?: string;
  notes?: string;

  // Relations
  client!: Client;
  salle!: Salle;
  services: Service[] = [];
  typePeriode?: TypePeriode;
  tarificationAppliquee?: TarificationSalle;
  contrat?: Contrat;
  paiements?: Paiement[] = [];

  // Métadonnées système
  dateCreation?: string;
  dateModification?: string;

  constructor(
    reservationId?: number,
    numeroReservation?: string,
    date?: string,
    statut?: StatutReservation,
    montantTotal?: number,
    client?: Client,
    salle?: Salle,
    services: Service[] = [],
    notes?: string,
    tokenReservation?: string,
    tarificationAppliquee?: TarificationSalle,
    contrat?: Contrat,
    paiements: Paiement[] = [],
    dateCreation?: string,
    dateModification?: string,
    typePeriode?: TypePeriode
  ) {
    if (reservationId !== undefined) this.reservationId = reservationId;
    if (numeroReservation) this.numeroReservation = numeroReservation;
    if (date) this.date = date;
    if (statut) this.statut = statut;
    if (montantTotal !== undefined) this.montantTotal = montantTotal;
    if (client) this.client = client;
    if (salle) this.salle = salle;
    this.services = services;
    if (notes) this.notes = notes;
    if (tokenReservation) this.tokenReservation = tokenReservation;
    if (tarificationAppliquee) this.tarificationAppliquee = tarificationAppliquee;
    if (contrat) this.contrat = contrat;
    this.paiements = paiements;
    if (dateCreation) this.dateCreation = dateCreation;
    if (dateModification) this.dateModification = dateModification;
    if (typePeriode) this.typePeriode = typePeriode;
  }
}