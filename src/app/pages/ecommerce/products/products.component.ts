import { Component, OnInit } from '@angular/core';
import { Options } from 'ngx-slider-v2';
import { Category } from 'src/app/core/models/category.interface';
import { Product } from 'src/app/core/models/product.interface';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';
import { Order } from 'src/app/core/models/order.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  pricevalue: number = 0;
  minVal: number = 0; // Prix minimum
  maxVal: number = 10000; // Prix maximum
  page: number = 1;
  categoryId: number = 0; // Catégorie par défaut (aucun filtre)
  searchName: string = ''; // Terme de recherche

  priceoption: Options = {
    floor: 0,
    ceil: 100000, // Prix maximum configurable
    translate: (value: number): string => `TND${value}`
  };

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = []; // Liste des catégories

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private authenticationService:AuthenticationService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'E-commerce' }, { label: 'Produits', active: true }];
    this.fetchProducts();
    this.fetchCategories(); // Récupérer les catégories au chargement
  }
  isHighestBidder(highestBidderId: any): boolean {
    const currentUser = this.decodeToken();
    return currentUser && currentUser.userId === highestBidderId;
  }
  placeBid(product: Product): void {
    const bidAmount = prompt('Entrez votre montant pour l\'enchère (TND) :');
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= product.auction.currentBid) {
      alert('Veuillez entrer un montant supérieur à l\'enchère actuelle.');
      return;
    }

    this.productService.placeBid(product.id, Number(bidAmount)).subscribe(
      () => {
        alert('Enchère placée avec succès.');
        this.fetchProducts(); // Recharger la liste des produits pour mettre à jour l'état
      },
      (error) => {
      //  console.error('Erreur lors du placement de l\'enchère :', error);
        //alert('Impossible de placer l\'enchère.');
      }
    );
  }

  fetchProducts(): void {
    this.productService.searchProducts({
      name: this.searchName,
      minPrice: this.minVal,
      maxPrice: this.maxVal,
      categoryId: this.categoryId
    }).subscribe((products) => {
      this.products = products;
      console.log("produits",products)
      this.filteredProducts = products; // Initialiser filteredProducts
    });
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories; // Charger les catégories
    });
  }

  searchFilter(event: Event): void {
    const searchStr = (event.target as HTMLInputElement).value;
    this.searchName = searchStr;
    this.fetchProducts();
  }

  valueChange(value: number, isMin: boolean): void {
    if (isMin) {
      this.minVal = value;
    } else {
      this.maxVal = value;
    }
    this.fetchProducts();
  }

  filterByCategory(categoryId: number): void {
    this.categoryId = categoryId;
    this.fetchProducts();
  }

  decodeToken(): any {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.token) {
      alert('Utilisateur non connecté');
      return null;
    }
    const payload = currentUser.token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  addToCart(productId: number): void {
    // Récupérer le token de l'utilisateur connecté
    const token = this.authenticationService.currentUserValue?.token;

    // Décoder le token pour obtenir l'userId
    const decodedToken = this.authenticationService.decodeToken(token);
    const userId = decodedToken.userId;

    // Vérifie si un utilisateur est connecté
    if (!userId) {
      alert('Vous devez être connecté pour ajouter des produits au panier.');
      return;
    }

    // Récupérer ou créer une commande (panier) pour l'utilisateur
    this.orderService.createOrder(userId, {
      date: new Date(), // Génère automatiquement la date actuelle
      status: 'PENDING',
      user: { id: userId } as User, // Crée un objet User minimal avec l'id uniquement
      products: [] // Initialise la liste des produits vide
    } as Order).subscribe(
      (order) => {
        // Utiliser l'orderId pour ajouter le produit
        this.orderService.addProductToOrder(order.id, productId).subscribe(
          (updatedOrder) => {
            console.log('Produit ajouté au panier :', updatedOrder);
            alert('Produit ajouté au panier avec succès.');
          },
          (error) => {
            console.error('Erreur lors de l\'ajout au panier :', error);
            alert('Impossible d\'ajouter le produit au panier.');
          }
        );
      },
      (error) => {
        console.error('Erreur lors de la récupération du panier :', error);
        alert('Impossible de récupérer ou de créer un panier.');
      }
    );
  }

}
