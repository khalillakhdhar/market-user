import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/core/models/order.interface';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  selectedOrder: any; // Commande sélectionnée

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Orders', active: true },
    ];

    // Récupère l'ID de la commande depuis l'URL
    const orderId = this.route.snapshot.params['id'];
    this.loadOrder(orderId);
  }

  /**
   * Charge les détails d'une commande
   * @param orderId ID de la commande
   */
  loadOrder(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe((order: Order) => {
      this.selectedOrder = order;
    });
  }

  /**
   * Met à jour la quantité d'un produit
   * @param productIndex Index du produit dans la commande
   */
  updateQuantity(productIndex: number): void {
    if (!this.selectedOrder) return;

    const product = this.selectedOrder.products[productIndex];
    if (product.quantity <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }

    this.orderService
      .addProductToOrder(this.selectedOrder.id, product.id)
      .subscribe(() => {
        alert('Product quantity updated successfully.');
      });
  }

  /**
   * Supprime un produit de la commande
   * @param productIndex Index du produit dans la commande
   */
  removeProduct(productIndex: number): void {
    if (!this.selectedOrder) return;

    const product = this.selectedOrder.products[productIndex];
    this.selectedOrder.products.splice(productIndex, 1); // Supprime du tableau local

    this.orderService.deleteOrder(product.id).subscribe(() => {
      alert('Product removed successfully.');
    });
  }
}
