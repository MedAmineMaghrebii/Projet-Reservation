import { Salle } from '../salle/salle';
import { Reservation } from '../reservations/reservation';

export class Service {
  serviceId?: number;
  nom!: string;
  description?: string;
  prix!: number;
  salle?: Salle;
  reservations?: Reservation[] = [];

  constructor(
    serviceId?: number,
    nom?: string,
    prix?: number,
    description?: string,
    salle?: Salle,
    reservations: Reservation[] = []
  ) {
    if (serviceId !== undefined) this.serviceId = serviceId;
    if (nom) this.nom = nom;
    if (prix !== undefined) this.prix = prix;
    if (description) this.description = description;
    if (salle) this.salle = salle;
    this.reservations = reservations;
  }
}