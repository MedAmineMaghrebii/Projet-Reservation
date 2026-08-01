import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service/service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private readonly API_URL = `${environment.apiUrl}/api/services`;

  constructor(private http: HttpClient) {}

  /**
   * Créer un nouveau service
   */
  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.API_URL, service);
  }

  /**
   * Récupérer tous les services
   */
  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.API_URL);
  }

  /**
   * Récupérer un service par son ID
   */
  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.API_URL}/${id}`);
  }

  /**
   * Récupérer les services associés à une salle
   */
  getServicesBySalleId(salleId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.API_URL}/salle/${salleId}`);
  }

  /**
   * Mettre à jour un service existant
   */
  updateService(id: number, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.API_URL}/${id}`, service);
  }

  /**
   * Supprimer un service par son ID
   */
  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}