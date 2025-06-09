import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const decodedToken = this.decodeToken(currentUser.token);
    const userId = decodedToken?.userId;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    return this.http.post<string>(`${this.apiUrl}/${productId}/bid`, { userId, bidAmount });
  }
}
