import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = 'http://localhost:8080/auth'; // Backend API URL

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Retourne l'utilisateur actuellement connecté
   */
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  /**
   * Connexion de l'utilisateur
   * @param email Email de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { userName: email, password }, { responseType: 'text' }).pipe(
      map((response: string) => {
        if (response) {
          // Store the user details and JWT token in local storage
          const user = { email, token: response }; // response is the token itself
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return response; // Return the token for further use
      })
    );
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  /**
   * Inscription d'un nouvel utilisateur
   * @param user Données de l'utilisateur
   */
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, user);
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    // Supprimer l'utilisateur du localStorage et réinitialiser le BehaviorSubject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  /**
   * Renouvellement du token JWT
   * @param token Token existant
   */
  refreshToken(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, { headers });
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  /**
   * Redirection après authentification
   */
  redirectToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
