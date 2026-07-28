import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service/service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  // URL correspondant au @RequestMapping("/api/services") de Spring Boot
  private readonly API_URL = `${environment.apiUrl}/api/services`;

  constructor(private http: HttpClient) {}

  // --- CREATE ---
  // POST /api/services
  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.API_URL, service);
  }

  // --- READ ALL ---
  // GET /api/services
  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.API_URL);
  }

  // --- READ BY ID ---
  // GET /api/services/{id}
  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.API_URL}/${id}`);
  }

  // --- READ BY SALLE ID ---
  // GET /api/services/salle/{salleId}
  getServicesBySalleId(salleId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.API_URL}/salle/${salleId}`);
  }

  // --- UPDATE ---
  // PUT /api/services/{id}
  updateService(id: number, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.API_URL}/${id}`, service);
  }

  // --- DELETE ---
  // DELETE /api/services/{id}
  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}