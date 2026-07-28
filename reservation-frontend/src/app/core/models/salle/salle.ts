export class Salle {

  salleId!: number;
  nom!: string;
  capaciteMax!: number;
  description?: string;
  adresse?: string;
  ville?: string;
  telephone?: string;
  email?: string;

  constructor(
    salleId: number,
    nom: string,
    capaciteMax: number
  ) {
    this.salleId = salleId;
    this.nom = nom;
    this.capaciteMax = capaciteMax;
  }
}