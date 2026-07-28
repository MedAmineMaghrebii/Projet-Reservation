import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/clients/client';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // URL de base correspondant à votre @RequestMapping("/api/clients")
  private readonly apiUrl = `${environment.apiUrl}/api/clients`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les clients
   */
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  /**
   * Récupère un client par son ID
   */
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau client
   */
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  /**
   * Met à jour un client existant
   */
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  /**
   * Supprime un client par son ID
   */
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Recherche un client par son CIN
   */
  getByCin(cin: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/cin/${cin}`);
  }

  /**
   * Recherche un client par son Email
   */
  getByEmail(email: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/email/${email}`);
  }

  /**
   * Recherche les clients par ville
   */
  getByVille(ville: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/ville/${ville}`);
  }
}