import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CategoryService } from 'src/app/core/services/category.service';
import { Product } from 'src/app/core/models/product.interface';
import { Category } from 'src/app/core/models/category.interface';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})

/**
 * Ecommerce add-product component
 */
export class AddproductComponent implements OnInit {
  categories: Category[] = []; // Liste des catégories
  photo: File | null = null;
produit: Product = {
  id: 0, // ou une autre valeur par défaut
  name: '',
  description: '',
  price: 0,
  stock: 0,
  photo: '',
  initialPrice: 0,
  category: { id: 0, name: '' } as Category  // Assure-toi que category est initialisé
};
  category: Category = {} as Category;

  constructor(
    private serviceProduit: ProductService,
    private serviceCategorie: CategoryService,
    private stockage: AngularFireStorage,
    private routeur: Router
  ) {}

ngOnInit(): void {
  // Charger les catégories disponibles
  this.serviceCategorie.getAllCategories().subscribe((categories) => {
    this.categories = categories;
    console.log('Catégories chargées :', this.categories);

    // Initialiser la catégorie par défaut si nécessaire
    if (!this.produit.category) {
      this.produit.category = this.categories.length > 0 ? this.categories[0] : { id: 0, name: '', description: '' } as Category;
    }
  });
}


  // Méthode pour gérer le changement de catégorie
onCategorieChange(categorieId: string): void {
  if (categorieId) {
    // Trouver la catégorie par son ID
    this.category = this.categories.find(cat => cat.id === parseInt(categorieId, 10));

    if (this.category) {
      console.log('Catégorie sélectionnée :', this.category);
      this.produit.category = this.category; // Assigner la catégorie trouvée au produit
    } else {
      console.error('Catégorie non trouvée');
    }
  } else {
    alert('Veuillez sélectionner une catégorie');
  }
}


  // Gestion de la sélection de fichier pour le téléchargement de photo
  onPhotoSelectionnee(event: any): void {
    const fichier = event.target.files[0];
    if (fichier) {
      this.photo = fichier;
    }
  }

  // Télécharge la photo sélectionnée sur Firebase et retourne l'URL de téléchargement
  telechargerPhoto(): Promise<string> {
    return new Promise((resoudre, rejeter) => {
      if (this.photo) {
        const cheminFichier = `produits/${Date.now()}_${this.photo.name}`;
        const tacheTelechargement = this.stockage.upload(cheminFichier, this.photo);

        tacheTelechargement.snapshotChanges().pipe(
          finalize(() => {
            this.stockage.ref(cheminFichier).getDownloadURL().subscribe(resoudre, rejeter);
          })
        ).subscribe();
      } else {
        rejeter('Aucune photo sélectionnée');
      }
    });
  }

  // Gestion de la soumission du formulaire et de la création du produit
  async onSoumettre(): Promise<void> {
    if (this.photo) {
      try {
        const urlPhoto = await this.telechargerPhoto();
        // Assigner l'URL de la photo au produit
        this.produit.photo = urlPhoto;

        // Envoyer le produit au backend
        this.serviceProduit.addProduct(this.produit).subscribe(
          () => {
            this.routeur.navigate(['./products']);
          },
          (erreur) => {
            console.error('Erreur lors de la création du produit :', erreur);
          }
        );
      } catch (erreur) {
        console.error('Erreur lors du téléchargement de la photo :', erreur);
      }
    } else {
      console.error('Le formulaire est invalide ou aucune photo n’a été sélectionnée');
    }
  }
}
