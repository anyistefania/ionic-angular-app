import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  displayName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async register() {
    // Validaciones
    if (!this.displayName || !this.email || !this.password || !this.confirmPassword) {
      this.showAlert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 6) {
      this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando cuenta...'
    });
    await loading.present();

    // Registrar usuario
    const result = await this.authService.register(this.email, this.password, this.displayName);
    
    if (result.success) {
      // Guardar datos adicionales en Firestore
      await this.firestoreService.saveUserData(result.user.uid, {
        uid: result.user.uid,
        email: this.email,
        displayName: this.displayName
      });

      await loading.dismiss();
      this.showAlert('Éxito', '¡Cuenta creada exitosamente!');
      this.router.navigate(['/products']);
    } else {
      await loading.dismiss();
      this.showAlert('Error', result.error);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}