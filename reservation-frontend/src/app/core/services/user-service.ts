import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user/user';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class UserService {
// URL de base correspondant à votre @RequestMapping("/api/clients")
  private readonly apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  //Clients summary
  getAllUsersSummary(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  /**
   * Récupère la liste de tous les Users
   */
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Récupère un User par son ID
   */
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau User
   */
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  /**
   * Met à jour un User existant
   */
  updateUser(id: number, user: User): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Supprime un user par son ID
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
  /**
   * Recherche un user par son Email
   */
  getByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email/${email}`);
  }

  

}
