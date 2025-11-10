import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Drink, CartItem } from '../../models/models.model';
import { FirestoreService } from '../../services/firestore.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.page.html',
  styleUrls: ['./drinks.page.scss'],
  standalone:false
})
export class DrinksPage implements OnInit {
  drinks: Drink[] = [];
  loading: boolean = true;

  constructor(
    private firestoreService: FirestoreService,
    private cartService: CartService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.firestoreService.getDrinks().subscribe(drinks => {
      this.drinks = drinks;
      this.loading = false;
    });
  }

  async addToCart(drink: Drink) {
    const cartItem: CartItem = {
      id: `drink-${Date.now()}`,
      type: 'drink',
      item: drink,
      quantity: 1,
      unitPrice: drink.price,
      subtotal: drink.price
    };

    this.cartService.addItem(cartItem);

    const toast = await this.toastController.create({
      message: `${drink.name} agregada al carrito`,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }
}
