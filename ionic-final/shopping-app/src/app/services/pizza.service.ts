import { Injectable } from '@angular/core';
import { Pizza, Ingredient, CustomPizza, PizzaSize, CartItem } from '../models/models.model';
import { FirestoreService } from './firestore.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  // Tamaños de pizza disponibles
  private pizzaSizes: PizzaSize[] = [
    { id: 'small', name: 'Pequeña', priceMultiplier: 1.0, slices: 6 },
    { id: 'medium', name: 'Mediana', priceMultiplier: 1.5, slices: 8 },
    { id: 'large', name: 'Grande', priceMultiplier: 2.0, slices: 10 },
    { id: 'xl', name: 'Extra Grande', priceMultiplier: 2.5, slices: 12 }
  ];

  constructor(private firestoreService: FirestoreService) {}

  // Obtener tamaños de pizza disponibles
  getPizzaSizes(): PizzaSize[] {
    return this.pizzaSizes;
  }

  // Obtener todas las pizzas predefinidas
  getPredefinedPizzas(): Observable<Pizza[]> {
    return this.firestoreService.getPizzas();
  }

  // Obtener pizzas populares
  getPopularPizzas(): Observable<Pizza[]> {
    return this.firestoreService.getPopularPizzas();
  }

  // Obtener ingredientes
  getIngredients(): Observable<Ingredient[]> {
    return this.firestoreService.getIngredients();
  }

  // Obtener ingredientes por categoría
  getIngredientsByCategory(category: string): Observable<Ingredient[]> {
    return this.firestoreService.getIngredientsByCategory(category);
  }

  // Calcular precio de pizza personalizada
  calculateCustomPizzaPrice(customPizza: CustomPizza): number {
    let basePrice = customPizza.base.price;

    // Agregar precio del queso si existe
    if (customPizza.cheese) {
      basePrice += customPizza.cheese.price;
    }

    // Agregar precio de la salsa si existe
    if (customPizza.sauce) {
      basePrice += customPizza.sauce.price;
    }

    // Agregar precio de los toppings
    const toppingsPrice = customPizza.toppings.reduce((sum, topping) => sum + topping.price, 0);

    // Aplicar multiplicador de tamaño
    const totalPrice = (basePrice + toppingsPrice) * customPizza.size.priceMultiplier;

    return Math.round(totalPrice * 100) / 100; // Redondear a 2 decimales
  }

  // Crear item de carrito para pizza predefinida
  createPredefinedPizzaCartItem(pizza: Pizza, size: PizzaSize, quantity: number = 1): CartItem {
    const unitPrice = pizza.basePrice * size.priceMultiplier;
    return {
      type: 'predefined-pizza',
      item: pizza,
      quantity: quantity,
      size: size,
      unitPrice: unitPrice,
      subtotal: unitPrice * quantity
    };
  }

  // Crear item de carrito para pizza personalizada
  createCustomPizzaCartItem(customPizza: CustomPizza, quantity: number = 1): CartItem {
    const price = this.calculateCustomPizzaPrice(customPizza);
    return {
      type: 'custom-pizza',
      item: customPizza,
      quantity: quantity,
      unitPrice: price,
      subtotal: price * quantity
    };
  }

  // Validar pizza personalizada
  validateCustomPizza(customPizza: CustomPizza): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!customPizza.size) {
      errors.push('Debe seleccionar un tamaño de pizza');
    }

    if (!customPizza.base) {
      errors.push('Debe seleccionar una base para la pizza');
    }

    if (!customPizza.sauce) {
      errors.push('Debe seleccionar una salsa');
    }

    if (customPizza.toppings.length === 0) {
      errors.push('Debe agregar al menos un ingrediente');
    }

    if (customPizza.toppings.length > 10) {
      errors.push('Máximo 10 ingredientes por pizza');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  // Obtener descripción de pizza personalizada
  getCustomPizzaDescription(customPizza: CustomPizza): string {
    const parts: string[] = [];

    parts.push(`Pizza ${customPizza.size.name}`);
    parts.push(`Base: ${customPizza.base.name}`);

    if (customPizza.sauce) {
      parts.push(`Salsa: ${customPizza.sauce.name}`);
    }

    if (customPizza.cheese) {
      parts.push(`Queso: ${customPizza.cheese.name}`);
    }

    if (customPizza.toppings.length > 0) {
      const toppingNames = customPizza.toppings.map(t => t.name).join(', ');
      parts.push(`Ingredientes: ${toppingNames}`);
    }

    return parts.join(' | ');
  }
}
