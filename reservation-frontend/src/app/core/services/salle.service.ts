import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salle } from '../models/salle/salle';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class SalleService {

  // URL de base correspondant à @RequestMapping("/api/salles")
  private readonly apiUrl = `${environment.apiUrl}/api/salles`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/salles
   * Récupérer toutes les salles
   */
  getAllSalles(): Observable<Salle[]> {
    return this.http.get<Salle[]>(this.apiUrl);
  }

  /**
   * GET /api/salles/{id}
   * Récupérer une salle par ID
   */
  getSalleById(id: number): Observable<Salle> {
    return this.http.get<Salle>(`${this.apiUrl}/${id}`);
  }

  /**
   * POST /api/salles
   * Ajouter une nouvelle salle
   */
  createSalle(salle: Salle): Observable<Salle> {
    return this.http.post<Salle>(this.apiUrl, salle);
  }

  /**
   * PUT /api/salles/{id}
   * Modifier une salle existante
   */
  updateSalle(id: number, salle: Salle): Observable<Salle> {
    return this.http.put<Salle>(`${this.apiUrl}/${id}`, salle);
  }

  /**
   * DELETE /api/salles/{id}
   * Supprimer une salle
   */
  deleteSalle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * GET /api/salles/ville/{ville}
   * Rechercher les salles par ville
   */
  findByVille(ville: string): Observable<Salle[]> {
    return this.http.get<Salle[]>(`${this.apiUrl}/ville/${ville}`);
  }

  /**
   * GET /api/salles/capacite/{capacite}
   * Rechercher les salles par capacité minimale
   */
  findByCapacite(capacite: number): Observable<Salle[]> {
    return this.http.get<Salle[]>(`${this.apiUrl}/capacite/${capacite}`);
  }

  /**
   * GET /api/salles/recherche?ville=...&capacite=...
   * Recherche multicritère (ville et capacité)
   */
  rechercherSalleDisponible(ville: string, capacite: number): Observable<Salle[]> {
    const params = new HttpParams()
      .set('ville', ville)
      .set('capacite', capacite.toString());

    return this.http.get<Salle[]>(`${this.apiUrl}/recherche`, { params });
  }
}