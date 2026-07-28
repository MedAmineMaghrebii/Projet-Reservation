import { Reservation } from "../reservations/reservation";
export class Client {

  clientId!: number;
  cin!: string;
  imageCin?: string;
  nom!: string;
  prenom!: string;
  telephone?: string;
  reservations: Reservation[] = [];
  email?: string;
  adresse?: string;
  ville?: string;

  constructor(
    clientId: number,
    cin: string,
    nom: string,
    prenom: string
  ) {
    this.clientId = clientId;
    this.cin = cin;
    this.nom = nom;
    this.prenom = prenom;
  }
}