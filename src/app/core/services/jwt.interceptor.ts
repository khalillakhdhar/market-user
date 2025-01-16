import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRequest } from '../models/auth-request.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = '/auth';

    constructor(private http: HttpClient) {}

    login(authRequest: AuthRequest): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/login`, authRequest);
    }

    addUser(user: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add`, user);
    }

    refreshToken(token: string): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/refresh-token`, { token });
    }
}
