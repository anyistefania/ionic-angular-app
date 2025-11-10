import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { CartItem, Pizza, CustomPizza, Drink } from '../../models/models.model';
import { PizzaService } from '../../services/pizza.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  deliveryFee: number = 0;
  total: number = 0;

  constructor(
    private cartService: CartService,
    private pizzaService: PizzaService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Suscribirse a cambios del carrito en tiempo real
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.subtotal = this.cartService.getSubtotal();
    });

    this.cartService.total$.subscribe(total => {
      this.total = total;
      this.deliveryFee = this.cartService.getDeliveryFee();
    });
  }

  getItemName(item: CartItem): string {
    if (item.type === 'custom-pizza') {
      return 'Pizza Personalizada';
    } else if (item.type === 'predefined-pizza') {
      return (item.item as Pizza).name;
    } else {
      return (item.item as Drink).name;
    }
  }

  getItemImage(item: CartItem): string {
    if (item.type === 'custom-pizza') {
      return 'assets/custom-pizza.jpg';
    } else if (item.type === 'predefined-pizza') {
      return (item.item as Pizza).imageUrl;
    } else {
      return (item.item as Drink).imageUrl;
    }
  }

  getCustomPizzaDescription(item: CartItem): string {
    if (item.type !== 'custom-pizza') return '';
    const customPizza = item.item as CustomPizza;
    return this.pizzaService.getCustomPizzaDescription(customPizza);
  }

  incrementQuantity(item: CartItem) {
    if (item.id) {
      this.cartService.updateItemQuantity(item.id, item.quantity + 1);
    }
  }

  decrementQuantity(item: CartItem) {
    if (item.id) {
      if (item.quantity === 1) {
        this.removeItem(item.id);
      } else {
        this.cartService.updateItemQuantity(item.id, item.quantity - 1);
      }
    }
  }

  async removeItem(itemId: string) {
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
            this.cartService.removeItem(itemId);
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

    // Navegar a checkout
    this.router.navigate(['/checkout']);
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
