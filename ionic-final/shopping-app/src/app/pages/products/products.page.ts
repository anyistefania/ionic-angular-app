import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from 'src/app/models/models.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
    standalone:false

})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  cartItemCount: number = 0;

  constructor(
    private firestoreService: FirestoreService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCartCount();
  }

  loadProducts() {
    this.firestoreService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadCartCount() {
    this.cartService.cart$.subscribe(() => {
      this.cartItemCount = this.cartService.getTotalItems();
    });
  }

  async addProduct() {
    const alert = await this.alertController.create({
      header: 'Nuevo Producto',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre del producto'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción'
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'Precio'
        },
        {
          name: 'imageUrl',
          type: 'url',
          placeholder: 'URL de la imagen'
        },
        {
          name: 'stock',
          type: 'number',
          placeholder: 'Stock disponible'
        },
        {
          name: 'category',
          type: 'text',
          placeholder: 'Categoría'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (data.name && data.price) {
              const loading = await this.loadingController.create({
                message: 'Creando producto...'
              });
              await loading.present();

              const product: Product = {
                name: data.name,
                description: data.description || '',
                price: parseFloat(data.price),
                imageUrl: data.imageUrl || 'https://via.placeholder.com/300',
                stock: parseInt(data.stock) || 0,
                category: data.category || 'General'
              };

              const result = await this.firestoreService.createProduct(product);
              await loading.dismiss();

              if (result.success) {
                this.showToast('Producto creado exitosamente');
              } else {
                this.showToast('Error al crear producto');
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editProduct(product: Product) {
    const alert = await this.alertController.create({
      header: 'Editar Producto',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: product.name,
          placeholder: 'Nombre del producto'
        },
        {
          name: 'description',
          type: 'textarea',
          value: product.description,
          placeholder: 'Descripción'
        },
        {
          name: 'price',
          type: 'number',
          value: product.price,
          placeholder: 'Precio'
        },
        {
          name: 'stock',
          type: 'number',
          value: product.stock,
          placeholder: 'Stock disponible'
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
            const loading = await this.loadingController.create({
              message: 'Actualizando...'
            });
            await loading.present();

            const result = await this.firestoreService.updateProduct(product.id!, {
              name: data.name,
              description: data.description,
              price: parseFloat(data.price),
              stock: parseInt(data.stock)
            });

            await loading.dismiss();

            if (result.success) {
              this.showToast('Producto actualizado');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteProduct(product: Product) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Eliminar ${product.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando...'
            });
            await loading.present();

            const result = await this.firestoreService.deleteProduct(product.id!);
            await loading.dismiss();

            if (result.success) {
              this.showToast('Producto eliminado');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    this.showToast(`${product.name} agregado al carrito`);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async logout() {
    await this.authService.logout();
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