import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  // Create an order
  createOrder(userId: number, order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${userId}/create`, order);
  }

  // Add a product to an order
  addProductToOrder(orderId: number, productId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${orderId}/add-product/${productId}`, {});
  }
  updateProductQuantity(orderId: number, productId: number, quantity: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${orderId}/update-product/${productId}`,
      { quantity }
    );
  }

  // Delete an order
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get an order by ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Get all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`);
  }
}
