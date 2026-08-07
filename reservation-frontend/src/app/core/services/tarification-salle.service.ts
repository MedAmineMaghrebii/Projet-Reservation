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
  createTarification(tarification: TarificationSalle): Observable<any> {
    return this.http.post<any>(this.apiUrl, tarification);
  }

  /**
   * Modifier une tarification existante
   */
  updateTarification(id: number, tarification: TarificationSalle): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tarification);
  }

  /**
   * Supprimer une tarification par ID
   */
  deleteTarification(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}