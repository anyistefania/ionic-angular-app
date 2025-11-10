import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { User } from '../../models/models.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  isEditing: boolean = false;

  // Campos editables
  displayName: string = '';
  phoneNumber: string = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      // Cargar datos desde Firestore usando el observable del servicio
      this.authService.userData$.subscribe(userData => {
        if (userData) {
          this.user = userData;
          this.displayName = userData.displayName || '';
          this.phoneNumber = userData.phoneNumber || '';
        }
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (!this.isEditing && this.user) {
      // Restaurar valores originales si se cancela
      this.displayName = this.user.displayName || '';
      this.phoneNumber = this.user.phoneNumber || '';
    }
  }

  async saveProfile() {
    if (!this.user) return;

    const loading = await this.loadingController.create({
      message: 'Guardando cambios...'
    });
    await loading.present();

    try {
      // Actualizar en Firebase Auth y Firestore
      await this.authService.updateUserProfile(
        this.displayName,
        undefined,
        this.phoneNumber
      );

      await loading.dismiss();
      this.isEditing = false;
      this.showToast('Perfil actualizado correctamente');
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', 'No se pudo actualizar el perfil');
    }
  }

  async changeProfilePicture() {
    const alert = await this.alertController.create({
      header: 'Cambiar Foto de Perfil',
      message: 'Ingresa la URL de tu foto',
      inputs: [
        {
          name: 'photoURL',
          type: 'url',
          placeholder: 'https://ejemplo.com/foto.jpg',
          value: this.user?.photoURL || ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.photoURL && this.user) {
              const loading = await this.loadingController.create({
                message: 'Actualizando foto...'
              });
              await loading.present();

              await this.authService.updateUserProfile(undefined, data.photoURL);
              await loading.dismiss();
              this.showToast('Foto actualizada');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          handler: async () => {
            await this.authService.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  goToPizzas() {
    this.router.navigate(['/pizzas']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }
}
