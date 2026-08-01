import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservations/reservation';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private readonly API_URL = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) { }

  /**
   * Récupérer toutes les réservations
   */
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.API_URL);
  }

  /**
   * Récupérer une réservation par son ID
   */
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.API_URL}/${id}`);
  }

  /**
   * Ajouter une nouvelle réservation
   * Mappé sur POST /api/reservations
   */
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.API_URL, reservation);
  }

  /**
   * Modifier une réservation existante
   */
  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.API_URL}/${id}`, reservation);
  }

  /**
   * Supprimer une réservation par son ID
   */
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Rechercher les réservations par date (Format YYYY-MM-DD)
   */
  findByDate(date: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.API_URL}/date/${date}`);
  }

  /**
   * Vérifier si une réservation existe à une date donnée
   */
  existsReservationByDate(date: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/exists/${date}`);
  }
}