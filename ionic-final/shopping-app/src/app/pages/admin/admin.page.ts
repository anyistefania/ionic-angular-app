import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { DataInitService } from '../../services/data-init.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private dataInitService: DataInitService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      this.router.navigate(['/pizzas']);
    }
  }

  async initializeData() {
    const confirm = await this.alertController.create({
      header: 'Inicializar Datos',
      message: '¿Estás seguro? Esto creará:\n\n• 30+ ingredientes\n• 8 pizzas predefinidas\n• 8 bebidas\n• Configuración de tienda',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Inicializar',
          handler: async () => {
            await this.executeInitialization();
          }
        }
      ]
    });

    await confirm.present();
  }

  async executeInitialization() {
    const loading = await this.loadingController.create({
      message: 'Inicializando datos...',
      spinner: 'circles'
    });

    await loading.present();

    try {
      await this.dataInitService.initializeAllData();
      await loading.dismiss();

      const success = await this.alertController.create({
        header: '¡Éxito!',
        message: 'Los datos se han inicializado correctamente.\n\n✓ Ingredientes creados\n✓ Pizzas creadas\n✓ Bebidas creadas\n✓ Configuración guardada',
        buttons: ['OK']
      });

      await success.present();
    } catch (error: any) {
      await loading.dismiss();

      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: `Hubo un error al inicializar los datos:\n\n${error.message || error}`,
        buttons: ['OK']
      });

      await errorAlert.present();
    }
  }
}
