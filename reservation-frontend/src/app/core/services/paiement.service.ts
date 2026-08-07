import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paiement } from '../models/paiement/paiement';
import { PaiementRequestDTO } from '../models/PaiementRequestDTO';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private apiUrl = 'http://localhost:8099/api/paiements';

  constructor(private http: HttpClient) { }

  // Tous les paiements
  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(this.apiUrl);
  }

  // Paiement par ID
  getPaiementById(id: string): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/${id}`);
  }

  // Ajouter (avec DTO)
  createPaiement(paiement: PaiementRequestDTO): Observable<Paiement> {
    return this.http.post<Paiement>(this.apiUrl, paiement);
  }

  // Modifier
  updatePaiement(id: string, paiement: Paiement): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/${id}`, paiement);
  }

  // Supprimer
  deletePaiement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Paiements d'une réservation
  getPaiementsByReservation(reservationId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(
      `${this.apiUrl}/reservation/${reservationId}`
    );
  }

  // Total payé d'une réservation
  calculerTotalPaye(reservationId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/reservation/${reservationId}/total`
    );
  }
}