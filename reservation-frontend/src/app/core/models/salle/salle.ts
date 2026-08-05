import { TarificationSalle } from './tarification-salle';
import { Service } from '../service/service';

export class Salle {
  salleId?: number;
  nom!: string;
  capaciteMax!: number;
  description?: string;
  adresse?: string;
  ville?: string;
  telephone?: string;
  email?: string;

  // Relations
  tarifications: TarificationSalle[] = [];
  services: Service[] = [];

  constructor(
    salleId?: number,
    nom: string = '',
    capaciteMax: number = 0,
    tarifications: TarificationSalle[] = [],
    services: Service[] = []
  ) {
    if (salleId !== undefined) this.salleId = salleId;
    this.nom = nom;
    this.capaciteMax = capaciteMax;
    this.tarifications = tarifications;
    this.services = services;
  }
}