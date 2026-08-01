import { TarificationSalle } from './tarification-salle';
import { Service } from '../service/service';
import { User } from '../user/user';

export class Salle {
  salleId?: number;
  nom!: string;
  capaciteMax!: number;
  description?: string;
  adresse?: string;
  ville?: string;
  telephone?: string;
  email?: string;

  // Relations (Optionnelles côté Angular)
  tarifications?: TarificationSalle[] = [];
  services?: Service[] = [];
  users?: User[] = [];

  constructor(
    salleId?: number,
    nom?: string,
    capaciteMax?: number,
    description?: string,
    adresse?: string,
    ville?: string,
    telephone?: string,
    email?: string,
    tarifications: TarificationSalle[] = [],
    services: Service[] = [],
    users: User[] = []
  ) {
    if (salleId !== undefined) this.salleId = salleId;
    if (nom) this.nom = nom;
    if (capaciteMax !== undefined) this.capaciteMax = capaciteMax;
    if (description) this.description = description;
    if (adresse) this.adresse = adresse;
    if (ville) this.ville = ville;
    if (telephone) this.telephone = telephone;
    if (email) this.email = email;
    this.tarifications = tarifications;
    this.services = services;
    this.users = users;
  }
}