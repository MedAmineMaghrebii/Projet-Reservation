import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TransactionService {

// URL de base correspondant à votre @RequestMapping("/api/clients")
  private readonly apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  //transactions summary
  getAllTransactionsSummary(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  /**
   * Récupère la liste de tous les transactions
   */
  getAllTransactions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Récupère une transaction par son ID
   */
  getTransactionsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée une nouvelle Transaction
   */
  createTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, transaction);
  }

  /**
   * Met à jour une transaction existante
   */
  updateTransaction(id: number, transaction: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, transaction);
  }

  /**
   * Supprime une transaction par son ID
   */
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
  /**
   * Recherche un user par son Email
   */
  getByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email/${email}`);
  }

  

}
