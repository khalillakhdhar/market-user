import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Product } from '../models/product.interface';
@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  searchProducts(params: { name?: string; minPrice?: number; maxPrice?: number; categoryId?: number }): Observable<Product[]> {
    const queryParams = {
      name: params.name || '', // Default to an empty string
      minPrice: params.minPrice !== undefined ? params.minPrice.toString() : '', // Default to no parameter
      maxPrice: params.maxPrice !== undefined ? params.maxPrice.toString() : '', // Default to no parameter
      categoryId: params.categoryId || '0', // Default to "0" for no category filter
    };

    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params: queryParams });
  }

  addProduct(product: Product): Observable<Product> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const decodedToken = this.decodeToken(currentUser.token);
    const userId = decodedToken?.userId;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    return this.http.post<Product>(`${this.apiUrl}/add?userId=${userId}`, product);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  placeBid(productId: number, bidAmount: number): Observable<string> {
    // Retrieve the current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // Decode the token to extract user information
    const decodedToken = this.decodeToken(currentUser.token);
    const userId = decodedToken?.userId;

    // Debug: Log the extracted userId for verification
    console.log('Decoded userId:', userId);

    // Handle the case where userId is not found
    if (!userId) {
        console.error('Error: User ID not found in token.');
        throw new Error('User ID not found in token');
    }

    // Build the request body
    const requestBody = {
        userId,
        bidAmount
    };

    // Debug: Log the request being sent to the server
    console.log('Place bid request:', requestBody);

    // Make the HTTP POST request to submit the bid
    return this.http.post<string>(`${this.apiUrl}/${productId}/bid?userId=${userId}&bidAmount=${bidAmount}`,null).pipe(
        // Debug: Log the response for debugging
        tap(response => console.log('Place bid response:', response)),
        // Catch and log any errors during the HTTP request
        catchError(error => {
            console.error('Place bid error:', error);
            // Rethrow the error for higher-level handling
            return throwError(() => new Error('Failed to place bid'));
        })
    );
}

}
