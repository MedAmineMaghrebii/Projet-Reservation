import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservations/reservation';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  // URL de ton API Spring Boot
  private readonly API_URL = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) { }





  /**
   * Récupérer toutes les réservations
   * @GetMapping
   */
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.API_URL);
  }


// list reservation par clientId
getReservationsByClient( 
    clientId: number,
    page: number,
    size: number) {

      const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<{
    content: Reservation[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
  }>(
      `${this.API_URL}/client/${clientId}`,
      { params }
    );
  }



  /**
   * Récupérer une réservation par son ID
   * @GetMapping("/{id}")
   */
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.API_URL}/${id}`);
  }

  /**
   * Ajouter une nouvelle réservation
   * @PostMapping("/add")
   */
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.API_URL}/add`, reservation);
  }

  /**
   * Modifier une réservation existante
   * @PutMapping("/{id}")
   */
  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.API_URL}/${id}`, reservation);
  }

  /**
   * Supprimer une réservation par son ID
   * @DeleteMapping("/{id}")
   */
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Rechercher les réservations par date (Format YYYY-MM-DD)
   * @GetMapping("/date/{date}")
   */
  findByDate(date: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.API_URL}/date/${date}`);
  }

  /**
   * Vérifier si une réservation existe à une date donnée
   * @GetMapping("/exists/{date}")
   */
  existsReservationByDate(date: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/exists/${date}`);
  }
}