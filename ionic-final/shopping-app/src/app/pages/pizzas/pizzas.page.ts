import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Pizza, PizzaSize, CartItem } from '../../models/models.model';
import { PizzaService } from '../../services/pizza.service';
import { CartService } from '../../services/cart.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-pizzas',
  templateUrl: './pizzas.page.html',
  styleUrls: ['./pizzas.page.scss'],
  standalone: false,
})
export class PizzasPage implements OnInit {
  pizzas: Pizza[] = [];
  popularPizzas: Pizza[] = [];
  filteredPizzas: Pizza[] = [];
  categories: string[] = [];
  selectedCategory: string = 'Todas';
  sizes: PizzaSize[] = [];
  cartItemCount: number = 0;
  loading: boolean = true;

  constructor(
    private pizzaService: PizzaService,
    private cartService: CartService,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.sizes = this.pizzaService.getPizzaSizes();
    this.loadPizzas();
    this.loadCartCount();
  }

  loadPizzas() {
    this.loading = true;

    // Cargar todas las pizzas
    this.firestoreService.getPizzas().subscribe((pizzas) => {
      this.pizzas = pizzas;
      this.filteredPizzas = pizzas;
      this.extractCategories();
      this.loading = false;
    });

    // Cargar pizzas populares
    this.firestoreService.getPopularPizzas().subscribe((pizzas) => {
      this.popularPizzas = pizzas;
    });
  }

  loadCartCount() {
    this.cartService.cart$.subscribe(() => {
      this.cartItemCount = this.cartService.getTotalItems();
    });
  }

  extractCategories() {
    const cats = new Set(this.pizzas.map((p) => p.category));
    this.categories = ['Todas', ...Array.from(cats)];
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'Todas') {
      this.filteredPizzas = this.pizzas;
    } else {
      this.filteredPizzas = this.pizzas.filter((p) => p.category === category);
    }
  }

  async addToCart(pizza: Pizza, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    // Mostrar selector de tamaño
    const alert = await this.alertController.create({
      header: `Agregar ${pizza.name}`,
      message: 'Selecciona el tamaño:',
      cssClass: 'custom-alert', // Agregar esta línea
      inputs: this.sizes.map((size) => ({
        type: 'radio' as const,
        label: `${size.name} - $${(
          pizza.basePrice * size.priceMultiplier
        ).toFixed(2)}`,
        value: size,
        checked: size.id === 'medium',
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: (selectedSize: PizzaSize) => {
            if (selectedSize) {
              const cartItem = this.pizzaService.createPredefinedPizzaCartItem(
                pizza,
                selectedSize,
                1
              );
              this.cartService.addItem(cartItem);
              this.showToast(`${pizza.name} agregada al carrito`);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  viewPizzaDetail(pizza: Pizza) {
    this.router.navigate(['/pizza', pizza.id]);
  }

  goToCustomPizza() {
    this.router.navigate(['/custom-pizza']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    toast.present();
  }
}
