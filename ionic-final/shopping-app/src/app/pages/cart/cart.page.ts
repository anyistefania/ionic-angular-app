import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { CartItem } from 'src/app/models/models.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
    standalone:false

})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.total$.subscribe(total => {
      this.total = total;
    });
  }

  async updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      const alert = await this.alertController.create({
        header: 'Confirmar',
        message: '¿Eliminar este producto del carrito?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.cartService.removeFromCart(productId);
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  incrementQuantity(item: CartItem) {
    const newQuantity = item.quantity + 1;
    if (newQuantity <= item.product.stock) {
      this.cartService.updateQuantity(item.product.id!, newQuantity);
    } else {
      this.showAlert('Stock insuficiente', `Solo hay ${item.product.stock} unidades disponibles`);
    }
  }

  decrementQuantity(item: CartItem) {
    this.updateQuantity(item.product.id!, item.quantity - 1);
  }

  async removeItem(productId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Eliminar este producto del carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.cartService.removeFromCart(productId);
            this.showToast('Producto eliminado del carrito');
          }
        }
      ]
    });
    await alert.present();
  }

  async clearCart() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Vaciar todo el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Vaciar',
          handler: () => {
            this.cartService.clearCart();
            this.showToast('Carrito vaciado');
          }
        }
      ]
    });
    await alert.present();
  }

  async checkout() {
    if (this.cartItems.length === 0) {
      this.showAlert('Carrito vacío', 'Agrega productos antes de continuar');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Compra',
      message: `Total: $${this.total.toFixed(2)}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Aquí puedes agregar lógica para procesar la orden
            this.showAlert('¡Éxito!', 'Compra realizada exitosamente');
            this.cartService.clearCart();
            this.router.navigate(['/products']);
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

  getSubtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }
}