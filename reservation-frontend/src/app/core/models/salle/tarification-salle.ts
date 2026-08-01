import { Salle } from "./salle";
import { TypePeriode } from "./TypePeriode.enum";

export class TarificationSalle {
  id?: number;
  typePeriode!: TypePeriode; // Alignations sur @JsonProperty("typePeriode")
  prix!: number;
  salle?: Salle;
  salleId?: number; // Pratique pour les formulaires Angular (Optionnel)

  constructor(
    id?: number,
    typePeriode?: TypePeriode,
    prix?: number,
    salle?: Salle,
    salleId?: number
  ) {
    if (id !== undefined) this.id = id;
    if (typePeriode) this.typePeriode = typePeriode;
    if (prix !== undefined) this.prix = prix;
    if (salle) this.salle = salle;
    if (salleId !== undefined) this.salleId = salleId;
  }
}