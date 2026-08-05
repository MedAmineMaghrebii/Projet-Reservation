import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

import { Espace } from '../models/espace/espace';

@Injectable({
  providedIn: 'root'
})
export class EspaceService {
  
  // URL de ton API Spring Boot
  private readonly apiUrl = `${environment.apiUrl}/api/espaces`;

  constructor(private http: HttpClient) {}

  // POST /api/espaces
  creerEspace(espace: Espace): Observable<Espace> {
    return this.http.post<Espace>(this.apiUrl, espace);
  }

  // GET /api/espaces
  listerTousLesEspaces(): Observable<Espace[]> {
    return this.http.get<Espace[]>(this.apiUrl);
  }

  // GET /api/espaces/{id}
  trouverEspaceParId(id: number): Observable<Espace> {
    return this.http.get<Espace>(`${this.apiUrl}/${id}`);
  }

  // PUT /api/espaces/{id}
  modifierEspace(id: number, espaceDetails: Espace): Observable<Espace> {
    return this.http.put<Espace>(`${this.apiUrl}/${id}`, espaceDetails);
  }

  // DELETE /api/espaces/{id}
  supprimerEspace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET /api/espaces/ville/{ville}
  trouverEspacesParVille(ville: string): Observable<Espace[]> {
    return this.http.get<Espace[]>(`${this.apiUrl}/ville/${ville}`);
  }

  // GET /api/espaces/search?keyword={keyword}
  rechercherEspaces(keyword: string): Observable<Espace[]> {
    return this.http.get<Espace[]>(`${this.apiUrl}/search`, {
      params: { keyword }
    });
  }

  // ✅ AJOUT : GET /api/espaces/user/{userId} (Récupérer l'espace et ses salles par l'ID utilisateur)
  trouverEspaceParUserId(userId: number): Observable<Espace> {
    return this.http.get<Espace>(`${this.apiUrl}/user/${userId}`);
  }
} 