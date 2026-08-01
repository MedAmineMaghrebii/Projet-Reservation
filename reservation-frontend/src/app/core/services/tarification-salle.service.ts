import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TarificationSalle } from '../models/salle/tarification-salle';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TarificationSalleService {

  private readonly apiUrl = `${environment.apiUrl}/api/tarifications`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les tarifications
   */
  getAllTarifications(): Observable<TarificationSalle[]> {
    return this.http.get<TarificationSalle[]>(this.apiUrl);
  }

  /**
   * Récupérer une tarification par ID
   */
  getTarificationById(id: number): Observable<TarificationSalle> {
    return this.http.get<TarificationSalle>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer les tarifications d'une salle spécifique
   */
  findBySalleId(salleId: number): Observable<TarificationSalle[]> {
    return this.http.get<TarificationSalle[]>(`${this.apiUrl}/salle/${salleId}`);
  }

  /**
   * Créer une nouvelle tarification
   */
  createTarification(tarification: TarificationSalle): Observable<TarificationSalle> {
    return this.http.post<TarificationSalle>(this.apiUrl, tarification);
  }

  /**
   * Modifier une tarification existante
   */
  updateTarification(id: number, tarification: TarificationSalle): Observable<TarificationSalle> {
    return this.http.put<TarificationSalle>(`${this.apiUrl}/${id}`, tarification);
  }

  /**
   * Supprimer une tarification par ID
   */
  deleteTarification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}