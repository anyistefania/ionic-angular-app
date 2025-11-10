import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { CustomPizza, PizzaSize, Ingredient } from '../../models/models.model';
import { PizzaService } from '../../services/pizza.service';
import { CartService } from '../../services/cart.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-custom-pizza',
  templateUrl: './custom-pizza.page.html',
  styleUrls: ['./custom-pizza.page.scss'],
  standalone: false,
})
export class CustomPizzaPage implements OnInit {
  sizes: PizzaSize[] = [];
  bases: Ingredient[] = [];
  cheeses: Ingredient[] = [];
  sauces: Ingredient[] = [];
  meats: Ingredient[] = [];
  vegetables: Ingredient[] = [];
  extras: Ingredient[] = [];

  customPizza: CustomPizza = {
    size: null as any, // ✅ Cambio: null as any → undefined
    base: null as any, // ✅ Cambio: null as any → undefined
    cheese: undefined,
    sauce: undefined,
    toppings: [],
    totalPrice: 0,
  };

  currentStep: number = 1;
  totalSteps: number = 5;
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
    this.loadIngredients();
  }

// En custom-pizza.page.ts
loadIngredients() {
  this.loading = true;

  this.firestoreService.getIngredients().subscribe({
    next: (ingredients) => {
      console.log('✅ Ingredientes cargados:', ingredients);
      this.bases = ingredients.filter(i => i.category === 'base');
      this.cheeses = ingredients.filter(i => i.category === 'cheese');
      this.sauces = ingredients.filter(i => i.category === 'sauce');
      this.meats = ingredients.filter(i => i.category === 'meat');
      this.vegetables = ingredients.filter(i => i.category === 'vegetable');
      this.extras = ingredients.filter(i => i.category === 'extra');
      this.loading = false;
    },
    error: (error) => {
      console.error('❌ Error loading ingredients:', error);
      this.showToast('Error al cargar ingredientes. Revisa la consola.', 'danger');
      this.loading = false;
    }
  });
}

  selectSize(size: PizzaSize) {
    this.customPizza.size = size;
    this.calculatePrice();
    this.nextStep();
  }

  selectBase(base: Ingredient) {
    this.customPizza.base = base;
    this.calculatePrice();
    this.nextStep();
  }


  selectCheese(cheese: any) {
  this.customPizza.cheese = cheese;
    this.calculatePrice(); // ✅ Aquí sí está

  // Remover esta línea si existe: this.nextStep();
}

  selectSauce(sauce: Ingredient) {
    this.customPizza.sauce = sauce;
    this.calculatePrice();
    this.nextStep();
  }

  toggleTopping(topping: Ingredient) {
    const index = this.customPizza.toppings.findIndex(
      (t) => t.id === topping.id
    );

    if (index > -1) {
      this.customPizza.toppings.splice(index, 1);
    } else {
      if (this.customPizza.toppings.length >= 1) {
        this.showToast('Máximo 10 ingredientes permitidos', 'warning');
        return;
      }
      this.customPizza.toppings.push(topping);
    }

    this.calculatePrice();
  }



  isToppingSelected(topping: Ingredient): boolean {
    return this.customPizza.toppings.some((t) => t.id === topping.id);
  }

  calculatePrice() {
    if (this.customPizza.size && this.customPizza.base) {
      this.customPizza.totalPrice = this.pizzaService.calculateCustomPizzaPrice(
        this.customPizza
      );
    }
  }

  skipCheese() {
  this.customPizza.cheese = undefined; // o undefined
  this.nextStep();
}


  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  async addToCart() {
    const validation = this.pizzaService.validateCustomPizza(this.customPizza);

    if (!validation.valid) {
      const alert = await this.alertController.create({
        header: 'Pizza Incompleta',
        message: validation.errors.join('<br>'),
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const cartItem = this.pizzaService.createCustomPizzaCartItem(
      this.customPizza,
      1
    );
    this.cartService.addItem(cartItem);

    await this.showToast('Pizza personalizada agregada al carrito', 'success');
    this.router.navigate(['/cart']);
  }

  reset() {
    this.customPizza = {
      size: null as any,
      base: null as any,
      cheese: undefined,
      sauce: undefined,
      toppings: [],
      totalPrice: 0,
    };
    this.currentStep = 1;
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }

  getStepStatus(step: number): string {
    if (step < this.currentStep) return 'complete';
    if (step === this.currentStep) return 'active';
    return 'inactive';
  }


}
