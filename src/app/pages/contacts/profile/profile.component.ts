import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { OrderService } from 'src/app/core/services/order.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  user: any = {}; // Utilisateur connecté
  stats: any = {}; // Statistiques basées sur produits, commandes, catégories
  auctions: any[] = []; // Liste des enchères auxquelles l'utilisateur participe

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Profil' }, { label: 'Mon profil', active: true }];

    // Récupérer les informations utilisateur depuis le token
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const decodedToken = this.decodeToken(currentUser.token);
    const userId = decodedToken.userId;

    // Charger les informations utilisateur depuis la base de données
    this.userService.getCurrentUser(userId).subscribe(
      (userInfo) => {
        this.user = userInfo;
        this.auctions = userInfo.auctions || []; // Charger les enchères
      },
      (error) => {
        console.error('Erreur lors du chargement des informations utilisateur :', error);
      }
    );

    // Charger les statistiques
    this.loadStats();
  }

  /**
   * Décoder le token JWT
   */
  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  /**
   * Charger les statistiques
   */
  private loadStats() {
    // Récupérer le nombre total de produits
    this.productService.getAllProducts().subscribe((products) => {
      this.stats.totalProducts = products.length;
    });

    // Récupérer le nombre total de catégories
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.stats.totalCategories = categories.length;
    });

    // Récupérer le nombre total de commandes
    this.orderService.getAllOrders().subscribe((orders) => {
      this.stats.totalOrders = orders.length;
    });
  }
}
