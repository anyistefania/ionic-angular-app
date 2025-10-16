import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { User } from 'src/app/models/models.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
    standalone:false

})
export class ProfilePage implements OnInit {
  user: User | null = null;
  isEditing: boolean = false;
  
  // Campos editables
  displayName: string = '';
  phoneNumber: string = '';
  address: string = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      // Cargar datos desde Firestore
      this.firestoreService.getUserData(currentUser.uid).subscribe(userData => {
        this.user = userData;
        this.displayName = userData.displayName || '';
        this.phoneNumber = userData.phoneNumber || '';
        this.address = userData.address || '';
      }, error => {
        // Si no existe en Firestore, crear documento inicial
        this.user = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || undefined
        };
        this.displayName = this.user.displayName;
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    
    if (!this.isEditing && this.user) {
      // Restaurar valores originales si se cancela
      this.displayName = this.user.displayName || '';
      this.phoneNumber = this.user.phoneNumber || '';
      this.address = this.user.address || '';
    }
  }

  async saveProfile() {
    if (!this.user) return;

    const loading = await this.loadingController.create({
      message: 'Guardando cambios...'
    });
    await loading.present();

    // Actualizar en Firebase Auth
    if (this.displayName !== this.user.displayName) {
      await this.authService.updateUserProfile(this.displayName);
    }

    // Actualizar en Firestore
    const result = await this.firestoreService.updateUserData(this.user.uid, {
      displayName: this.displayName,
      phoneNumber: this.phoneNumber,
      address: this.address
    });

    await loading.dismiss();

    if (result.success) {
      this.isEditing = false;
      this.showAlert('Éxito', 'Perfil actualizado correctamente');
      this.loadUserData();
    } else {
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
              await this.firestoreService.updateUserData(this.user.uid, {
                photoURL: data.photoURL
              });

              await loading.dismiss();
              this.loadUserData();
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

  goToProducts() {
    this.router.navigate(['/products']);
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
    const alert = await this.alertController.create({
      message,
      // duration: 2000,
      buttons: ['OK']
    });
    await alert.present();
  }
}