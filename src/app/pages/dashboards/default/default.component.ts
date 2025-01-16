import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { OrderService } from 'src/app/core/services/order.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  // Variables pour le tableau de bord
  user: any; // Utilisateur connecté
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
  };
  transactions: any[] = []; // Transactions récentes
  recentActivities: any[] = []; // Activités récentes

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadStats();
    this.loadTransactions();
    this.loadRecentActivities();
  }

  /**
   * Charge les informations de l'utilisateur connecté
   */
  private loadUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.user = parsedUser ? { name: parsedUser.email.split('@')[0] } : null; // Affiche le nom d'utilisateur avant '@'
    }
  }

  /**
   * Charge les statistiques globales (produits, commandes, catégories)
   */
  private loadStats(): void {
    this.productService.getAllProducts().subscribe((products) => {
      this.stats.totalProducts = products.length;
    });

    this.orderService.getAllOrders().subscribe((orders) => {
      this.stats.totalOrders = orders.length;
    });

    this.categoryService.getAllCategories().subscribe((categories) => {
      this.stats.totalCategories = categories.length;
    });
  }

  /**
   * Charge les transactions récentes
   */
  private loadTransactions(): void {
    this.orderService.getAllOrders().subscribe((orders) => {
      this.transactions = orders.slice(0, 5).map((order) => ({
        id: order.id,
        productName: order.products[0]?.name || 'Produit inconnu',
        price: order.products[0]?.price || 0,
        quantity: 1,
        date: order.date,
      }));
    });
  }

  /**
   * Charge les activités récentes
   */
  private loadRecentActivities(): void {
    // Exemple d'activités simulées
    this.recentActivities = [
      { date: new Date(), description: 'Nouvelle commande créée' },
      { date: new Date(new Date().setDate(new Date().getDate() - 1)), description: 'Produit ajouté à une catégorie' },
      { date: new Date(new Date().setDate(new Date().getDate() - 2)), description: 'Nouvelle catégorie créée' },
    ];
  }
}
