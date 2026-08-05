import { User } from '../user/user';
import { Salle } from '../salle/salle';
export class Espace {

  espaceId?: number;
  nom!: string;
  description?: string;
  adresse?: string;
  ville?: string;
  telephone?: string;

  salles: Salle[] = [];
  users: User[] = [];

  constructor(
    espaceId: number,
    nom: string
  ) {
    this.espaceId = espaceId;
    this.nom = nom;
  }

}