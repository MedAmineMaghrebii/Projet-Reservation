import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/auth/register-request';
import { AuthResponse } from '../models/auth/auth-response';
import { LoginRequest } from '../models/auth/LoginRequest';
import { RefreshTokenRequest } from '../models/auth/RefreshTokenRequest';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient
  ) {}

  register(
    request: RegisterRequest
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.API_URL}/register`,
      request
    );
  }

  login(
    request: LoginRequest
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.API_URL}/login`,
      request
    );
  }

  refreshToken(
    request: RefreshTokenRequest
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.API_URL}/refresh`,
      request
    );
  }
}