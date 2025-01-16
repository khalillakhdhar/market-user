import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cart } from './cart.model';
import { cartData } from './data';
import { Order } from 'src/app/core/models/order.interface';
import { OrderService } from 'src/app/core/services/order.service';
import { Product } from 'src/app/core/models/product.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

/**
 * Ecommerce Cart component
 */
export class CartComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  orders: Order[] = []; // List of all orders

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Orders', active: true },
    ];

    // Load all orders on initialization
    this.loadAllOrders();
  }

  /**
   * Fetch all orders from the backend
   */
  loadAllOrders(): void {
    this.orderService.getAllOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
      console.log("orders",orders);
    });
  }
  calculateTotalPrice( products:Product[])
  {
    let total = 0;
    products.forEach(product => {
      total += product.price;
    });
    return total;
  }
  /**
   * Delete an order
   * @param orderId The ID of the order to delete
   */
  deleteOrder(orderId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deleteOrder(orderId).subscribe(() => {
          this.orders = this.orders.filter((order) => order.id !== orderId);
          Swal.fire('Deleted!', 'The order has been deleted.', 'success');
        });
      }
    });
  }
}
