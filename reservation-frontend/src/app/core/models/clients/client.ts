import { Reservation } from "../reservations/reservation";
import { TypeClient } from "./typeClient.enum";


export class Client {
  clientId?: number;
  cin!: string;
  imageCin?: string;
  nom!: string;
  prenom!: string;
  telephone?: string;
  typeClient?: TypeClient; // Ajouté pour correspondre au backend
  email?: string;
  adresse?: string;
  ville?: string;
  reservations: Reservation[] = [];

  constructor(
    clientId?: number,
    cin: string = '',
    nom: string = '',
    prenom: string = ''
  ) {
    this.clientId = clientId;
    this.cin = cin;
    this.nom = nom;
    this.prenom = prenom;
  }
}