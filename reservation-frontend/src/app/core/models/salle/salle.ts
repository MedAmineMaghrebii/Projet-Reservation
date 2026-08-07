import { TarificationSalle } from './tarification-salle';
import { Service } from '../service/service';
import { Espace } from '../espace/espace'; // Ajuste le chemin selon ton arborescence

export class Salle {
  salleId?: number;
  nom?: string;
  capaciteMax?: number;
  description?: string;
  adresse?: string;
  ville?: string;
  telephone?: string;
  email?: string;

  // Relations
  espace?: Espace;
    tarifications?: TarificationSalle[] = [];
  services?: Service[] = [];

  constructor(
    salleId?: number,
    nom: string = '',
    capaciteMax: number = 0,
    espace?: Espace,
    tarifications: TarificationSalle[] = [],
    services: Service[] = []
  ) {
    if (salleId !== undefined) this.salleId = salleId;
    this.nom = nom;
    this.capaciteMax = capaciteMax;
    if (espace) this.espace = espace;
    this.tarifications = tarifications;
    this.services = services;
  }
}