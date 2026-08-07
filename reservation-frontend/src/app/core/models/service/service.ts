import { Salle } from '../salle/salle';
import { Reservation } from '../reservations/reservation';

export class Service {
  serviceId?: number;
  nom!: string;
  description?: string;
  categorie? : string;
  statut? : string;
  prix!: number;
  salleId?: number;
  reservations?: Reservation[] = [];
  salle?: Salle;

  constructor(
    serviceId?: number,
    nom?: string,
    prix?: number,
    description?: string,
    categorie?: string,
    statut?: string,
    salleId?: number,
    reservations: Reservation[] = [],
    salle?: Salle
  ) {
    if (serviceId !== undefined) this.serviceId = serviceId;
    if (nom) this.nom = nom;
    if (prix !== undefined) this.prix = prix;
    if (description) this.description = description;
    if (salleId) this.salleId = salleId;
    if (categorie) this.categorie = categorie;
    if (statut) this.statut = statut;
    if (salle) this.salle = salle;

    this.reservations = reservations;
  }
}