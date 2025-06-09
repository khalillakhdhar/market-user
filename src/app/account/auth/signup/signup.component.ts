import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { UserInfo } from 'src/app/core/models/user-info.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup; // Formulaire
  submitted = false; // Indicateur de soumission
  successmsg = false; // Indicateur de succès
  error: string = ''; // Gestion des erreurs
  year: number = new Date().getFullYear(); // Année actuelle pour le footer

  constructor(private formBuilder: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roles: ['USER_ROLE'], // Rôle par défaut
    });
  }

  // Getter pour un accès facile aux champs du formulaire
  get f() {
    return this.signupForm.controls;
  }

  // Méthode appelée à la soumission du formulaire
  onSubmit(): void {
    this.submitted = true;

    // Vérifier la validité du formulaire
    if (this.signupForm.invalid) {
      return;
    }

    // Créer un objet UserInfo avec les données du formulaire
    const userInfo: UserInfo = {
      id: 0, // ID sera généré par le backend
      name: this.f.name.value,
      email: this.f.email.value,
      password: this.f.password.value,
      roles: this.f.roles.value,

    };

    // Appel au service pour enregistrer l'utilisateur
    this.userService.addUser(userInfo).subscribe(
      (response) => {
        console.log('Utilisateur créé avec succès', response);
        this.successmsg = true; // Affiche le message de succès
        this.error = ''; // Réinitialise l'erreur
        this.signupForm.reset(); // Réinitialise le formulaire
        this.submitted = false;
      },
      (error) => {
        console.error('Erreur lors de la création de l\'utilisateur', error);
        this.error = 'Erreur lors de la création de l\'utilisateur'; // Affiche l'erreur
        this.successmsg = false;
      }
    );
  }
}
