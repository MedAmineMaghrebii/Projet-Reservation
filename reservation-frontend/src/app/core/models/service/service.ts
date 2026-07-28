import { Salle } from '../salle/salle';

export class Service {
  serviceId?: number;
  nom: string;
  description?: string;
  prix: number;
  salle?: Salle;

  constructor(
    nom: string = '',
    prix: number = 0,
    salle?: Salle,
    description?: string,
    serviceId?: number
  ) {
    this.serviceId = serviceId;
    this.nom = nom;
    this.prix = prix;
    this.salle = salle;
    this.description = description;
  }
}