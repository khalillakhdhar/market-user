import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserInfo } from 'src/app/core/models/user-info.interface';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-usergrid',
  templateUrl: './usergrid.component.html',
  styleUrls: ['./usergrid.component.scss'],
})
export class UsergridComponent implements OnInit {
  // Breadcrumb items
  breadCrumbItems: Array<{}>;

  modalRef?: BsModalRef;
  userForm: UntypedFormGroup;
  submitted = false;

  userGridData: UserInfo[] = []; // Stockage des données utilisateurs
  selectValue: string[] = ['Admin', 'User', 'Editor']; // Rôles disponibles

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Users Grid', active: true }];
    this.userForm = this.formBuilder.group({
      id: [null], // Pour identifier un utilisateur lors de l'édition
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      roles: ['', [Validators.required]],
    });

    // Charger les utilisateurs
    this.loadUsers();
  }

  // Raccourci pour accéder aux contrôles du formulaire
  get form() {
    return this.userForm.controls;
  }

  /**
   * Charger les utilisateurs depuis le backend
   */
  private loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.userGridData = users;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
      },
    });
  }

  /**
   * Ouvrir le modal pour ajouter ou éditer un utilisateur
   * @param content Modal content
   * @param user Utilisateur à éditer (facultatif)
   */
  openModal(content: any, user?: UserInfo) {
    if (user) {
      // Pré-remplir le formulaire pour l'édition
      this.userForm.patchValue(user);
    } else {
      this.userForm.reset(); // Réinitialiser le formulaire pour une nouvelle création
    }
    this.modalRef = this.modalService.show(content);
  }

  /**
   * Enregistrer un utilisateur (création ou modification)
   */
  saveUser() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;

    if (userData.id) {
      // Mise à jour d'un utilisateur existant
      this.userService.getUserById(userData.id).subscribe({
        next: () => {
          const index = this.userGridData.findIndex((u) => u.id === userData.id);
          if (index !== -1) {
            this.userGridData[index] = userData;
          }
          this.modalRef?.hide();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
        },
      });
    } else {
      // Création d'un nouvel utilisateur
      this.userService.addUser(userData).subscribe({
        next: (newUser) => {
          this.userGridData.push(newUser);
          this.modalRef?.hide();
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
        },
      });
    }
  }

  /**
   * Supprimer un utilisateur
   * @param userId ID de l'utilisateur à supprimer
   */
  deleteUser(userId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.getUserById(userId).subscribe({
        next: () => {
          this.userGridData = this.userGridData.filter((user) => user.id !== userId);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
        },
      });
    }
  }
}
