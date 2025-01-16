import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../models/user-info.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/auth'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  // Ajouter un utilisateur avec rôle USER par défaut
  addUser(userInfo: UserInfo): Observable<UserInfo> {
    userInfo.roles = 'USER_ROLE'; // Assigner le rôle par défaut
    return this.http.post<UserInfo>(`${this.apiUrl}/add`, userInfo);
  }
  getCurrentUser(userId: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/getUsers/${userId}`);
  }

  // Obtenir tous les utilisateurs
  getUsers(): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(`${this.apiUrl}/getUsers`);
  }

  // Obtenir un utilisateur par ID
  getUserById(id: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/getUsers/${id}`);
  }
}
