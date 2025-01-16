import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})

/**
 * Ecommerce add-product component
 */
export class AddproductComponent implements OnInit {
  formulaireProduit: FormGroup;
  categories: any[] = []; // Liste des catégories
  photo: File | null = null;

  constructor(
    private constructeurFormulaire: FormBuilder,
    private serviceProduit: ProductService,
    private serviceCategorie: CategoryService,
    private stockage: AngularFireStorage,
    private routeur: Router
  ) {}

  ngOnInit(): void {
    this.formulaireProduit = this.constructeurFormulaire.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(1)]],
      categorieId: ['', Validators.required] // Champ pour la catégorie
    });

    // Charger les catégories disponibles
    this.serviceCategorie.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
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

        tacheTelechargement
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.stockage.ref(cheminFichier).getDownloadURL().subscribe(resoudre, rejeter);
            })
          )
          .subscribe();
      } else {
        rejeter('Aucune photo sélectionnée');
      }
    });
  }
  async onSoumettre(): Promise<void> {
    if (this.formulaireProduit.valid && this.photo) {
      try {
        const urlPhoto = await this.telechargerPhoto();

        // Créer l'objet produit avec un objet category complet
        const donneesProduit = {
          ...this.formulaireProduit.value,
          photo: urlPhoto,
          category: { id: this.formulaireProduit.value.categorieId } // Construire l'objet attendu
        };

        this.serviceProduit.addProduct(donneesProduit).subscribe(
          () => {
            this.routeur.navigate(['../products']);
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
