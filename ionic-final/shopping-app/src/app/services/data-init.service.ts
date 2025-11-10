import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Pizza, Ingredient, Drink, StoreConfig } from '../models/models.model';

@Injectable({
  providedIn: 'root'
})
export class DataInitService {

  constructor(private firestoreService: FirestoreService) {}

  // Inicializar todos los datos
  async initializeAllData(): Promise<void> {
    console.log('Iniciando inicialización de datos...');

    try {
      await this.initializeIngredients();
      await this.initializePizzas();
      await this.initializeDrinks();
      await this.initializeStoreConfig();

      console.log('Datos inicializados exitosamente');
    } catch (error) {
      console.error('Error inicializando datos:', error);
      throw error;
    }
  }

  // Inicializar ingredientes
  private async initializeIngredients(): Promise<void> {
    const ingredients: Ingredient[] = [
      // Bases
      {
        name: 'Masa Tradicional',
        price: 3.00,
        category: 'base',
        imageUrl: 'assets/ingredients/masa-tradicional.jpg',
        available: true
      },
      {
        name: 'Masa Delgada',
        price: 3.00,
        category: 'base',
        imageUrl: 'assets/ingredients/masa-delgada.jpg',
        available: true
      },
      {
        name: 'Masa Integral',
        price: 3.50,
        category: 'base',
        imageUrl: 'assets/ingredients/masa-integral.jpg',
        available: true
      },
      {
        name: 'Masa Gruesa',
        price: 3.50,
        category: 'base',
        imageUrl: 'assets/ingredients/masa-gruesa.jpg',
        available: true
      },

      // Quesos
      {
        name: 'Mozzarella',
        price: 2.00,
        category: 'cheese',
        imageUrl: 'assets/ingredients/mozzarella.jpg',
        available: true
      },
      {
        name: 'Parmesano',
        price: 2.50,
        category: 'cheese',
        imageUrl: 'assets/ingredients/parmesano.jpg',
        available: true
      },
      {
        name: 'Queso Azul',
        price: 3.00,
        category: 'cheese',
        imageUrl: 'assets/ingredients/queso-azul.jpg',
        available: true
      },
      {
        name: 'Queso Cheddar',
        price: 2.50,
        category: 'cheese',
        imageUrl: 'assets/ingredients/cheddar.jpg',
        available: true
      },

      // Salsas
      {
        name: 'Salsa de Tomate',
        price: 1.00,
        category: 'sauce',
        imageUrl: 'assets/ingredients/salsa-tomate.jpg',
        available: true
      },
      {
        name: 'Salsa BBQ',
        price: 1.50,
        category: 'sauce',
        imageUrl: 'assets/ingredients/salsa-bbq.jpg',
        available: true
      },
      {
        name: 'Salsa Blanca',
        price: 1.50,
        category: 'sauce',
        imageUrl: 'assets/ingredients/salsa-blanca.jpg',
        available: true
      },
      {
        name: 'Pesto',
        price: 2.00,
        category: 'sauce',
        imageUrl: 'assets/ingredients/pesto.jpg',
        available: true
      },

      // Carnes
      {
        name: 'Pepperoni',
        price: 2.00,
        category: 'meat',
        imageUrl: 'assets/ingredients/pepperoni.jpg',
        available: true
      },
      {
        name: 'Jamón',
        price: 1.80,
        category: 'meat',
        imageUrl: 'assets/ingredients/jamon.jpg',
        available: true
      },
      {
        name: 'Salchicha Italiana',
        price: 2.20,
        category: 'meat',
        imageUrl: 'assets/ingredients/salchicha.jpg',
        available: true
      },
      {
        name: 'Carne Molida',
        price: 2.00,
        category: 'meat',
        imageUrl: 'assets/ingredients/carne-molida.jpg',
        available: true
      },
      {
        name: 'Pollo',
        price: 2.00,
        category: 'meat',
        imageUrl: 'assets/ingredients/pollo.jpg',
        available: true
      },
      {
        name: 'Tocino',
        price: 2.20,
        category: 'meat',
        imageUrl: 'assets/ingredients/tocino.jpg',
        available: true
      },

      // Vegetales
      {
        name: 'Champiñones',
        price: 1.20,
        category: 'vegetable',
        imageUrl: 'assets/ingredients/champinones.jpg',
        available: true
      },
      {
        name: 'Pimientos',
        price: 1.00,
        category: 'vegetable',
        imageUrl: 'assets/ingredients/pimientos.jpg',
        available: true
      },
      {
        name: 'Cebolla',
        price: 0.80,
        category: 'vegetable',
        imageUrl: 'assets/ingredients/cebolla.jpg',
        available: true
      },
      {
        name: 'Tomate',
        price: 1.00,
        category: 'vegetable',
        imageUrl: 'assets/ingredients/tomate.jpg',
        available: true
      },
      {
        name: 'Aceitunas Negras',
        price: 1.50,
        category: 'vegetable',
        imageUrl: 'assets/ingredients/aceitunas.jpg',
        available: true
      },
      {
        name: 'Jalapeños',
        price: 1.20,
        category: 'vegetable',
        imageUrl: 'assets/ingredients/jalapenos.jpg',
        available: true
      },
      {
        name: 'Piña',
        price: 1.50,
        category: 'vegetable',
        imageUrl: 'assets/ingredients/pina.jpg',
        available: true
      },
      {
        name: 'Espinaca',
        price: 1.20,
        category: 'vegetable',
        imageUrl: 'assets/ingredients/espinaca.jpg',
        available: true
      },

      // Extras
      {
        name: 'Orégano',
        price: 0.50,
        category: 'extra',
        imageUrl: 'assets/ingredients/oregano.jpg',
        available: true
      },
      {
        name: 'Ajo',
        price: 0.80,
        category: 'extra',
        imageUrl: 'assets/ingredients/ajo.jpg',
        available: true
      },
      {
        name: 'Albahaca Fresca',
        price: 1.00,
        category: 'extra',
        imageUrl: 'assets/ingredients/albahaca.jpg',
        available: true
      }
    ];

    console.log('Creando ingredientes...');
    for (const ingredient of ingredients) {
      await this.firestoreService.createIngredient(ingredient);
    }
    console.log(`${ingredients.length} ingredientes creados`);
  }

  // Inicializar pizzas predefinidas
  private async initializePizzas(): Promise<void> {
    // Nota: Los IDs de ingredientes deberían obtenerse dinámicamente
    // Por simplicidad, usaremos nombres descriptivos
    const pizzas: Pizza[] = [
      {
        name: 'Margarita',
        description: 'Clásica pizza italiana con mozzarella, tomate y albahaca',
        basePrice: 12.99,
        imageUrl: 'assets/pizzas/margarita.jpg',
        category: 'Clásicas',
        ingredients: ['mozzarella', 'salsa-tomate', 'albahaca'],
        popular: true,
        available: true
      },
      {
        name: 'Pepperoni',
        description: 'La favorita de todos, con generosas rodajas de pepperoni',
        basePrice: 14.99,
        imageUrl: 'assets/pizzas/pepperoni.jpg',
        category: 'Clásicas',
        ingredients: ['mozzarella', 'salsa-tomate', 'pepperoni'],
        popular: true,
        available: true
      },
      {
        name: 'Hawaiana',
        description: 'Jamón y piña para los que se atreven',
        basePrice: 13.99,
        imageUrl: 'assets/pizzas/hawaiana.jpg',
        category: 'Especiales',
        ingredients: ['mozzarella', 'salsa-tomate', 'jamon', 'pina'],
        popular: false,
        available: true
      },
      {
        name: 'Cuatro Quesos',
        description: 'Mezcla perfecta de mozzarella, parmesano, cheddar y queso azul',
        basePrice: 15.99,
        imageUrl: 'assets/pizzas/cuatro-quesos.jpg',
        category: 'Gourmet',
        ingredients: ['mozzarella', 'parmesano', 'cheddar', 'queso-azul', 'salsa-blanca'],
        popular: true,
        available: true
      },
      {
        name: 'Carnívora',
        description: 'Para los amantes de la carne: pepperoni, salchicha, tocino y carne molida',
        basePrice: 17.99,
        imageUrl: 'assets/pizzas/carnivora.jpg',
        category: 'Especiales',
        ingredients: ['mozzarella', 'salsa-tomate', 'pepperoni', 'salchicha', 'tocino', 'carne-molida'],
        popular: true,
        available: true
      },
      {
        name: 'Vegetariana',
        description: 'Fresca y saludable con champiñones, pimientos, cebolla y aceitunas',
        basePrice: 13.99,
        imageUrl: 'assets/pizzas/vegetariana.jpg',
        category: 'Vegetarianas',
        ingredients: ['mozzarella', 'salsa-tomate', 'champinones', 'pimientos', 'cebolla', 'aceitunas', 'tomate'],
        popular: false,
        available: true
      },
      {
        name: 'BBQ Chicken',
        description: 'Pollo con salsa BBQ, cebolla y tocino',
        basePrice: 16.99,
        imageUrl: 'assets/pizzas/bbq-chicken.jpg',
        category: 'Especiales',
        ingredients: ['mozzarella', 'salsa-bbq', 'pollo', 'cebolla', 'tocino'],
        popular: true,
        available: true
      },
      {
        name: 'Mexicana',
        description: 'Picante y deliciosa con jalapeños, carne molida y pimientos',
        basePrice: 15.99,
        imageUrl: 'assets/pizzas/mexicana.jpg',
        category: 'Especiales',
        ingredients: ['mozzarella', 'salsa-tomate', 'carne-molida', 'jalapenos', 'pimientos', 'cebolla'],
        popular: false,
        available: true
      }
    ];

    console.log('Creando pizzas...');
    for (const pizza of pizzas) {
      await this.firestoreService.createPizza(pizza);
    }
    console.log(`${pizzas.length} pizzas creadas`);
  }

  // Inicializar bebidas
  private async initializeDrinks(): Promise<void> {
    const drinks: Drink[] = [
      {
        name: 'Coca-Cola',
        description: 'Refresco clásico',
        price: 2.50,
        imageUrl: 'assets/drinks/coca-cola.jpg',
        size: '500ml',
        available: true
      },
      {
        name: 'Coca-Cola',
        description: 'Refresco clásico',
        price: 3.50,
        imageUrl: 'assets/drinks/coca-cola-1l.jpg',
        size: '1L',
        available: true
      },
      {
        name: 'Sprite',
        description: 'Refresco de limón',
        price: 2.50,
        imageUrl: 'assets/drinks/sprite.jpg',
        size: '500ml',
        available: true
      },
      {
        name: 'Fanta Naranja',
        description: 'Refresco de naranja',
        price: 2.50,
        imageUrl: 'assets/drinks/fanta.jpg',
        size: '500ml',
        available: true
      },
      {
        name: 'Agua Mineral',
        description: 'Agua natural',
        price: 1.50,
        imageUrl: 'assets/drinks/agua.jpg',
        size: '500ml',
        available: true
      },
      {
        name: 'Jugo de Naranja',
        description: 'Jugo natural de naranja',
        price: 3.00,
        imageUrl: 'assets/drinks/jugo-naranja.jpg',
        size: '350ml',
        available: true
      },
      {
        name: 'Té Helado',
        description: 'Té frío de limón',
        price: 2.80,
        imageUrl: 'assets/drinks/te-helado.jpg',
        size: '500ml',
        available: true
      },
      {
        name: 'Cerveza',
        description: 'Cerveza artesanal',
        price: 4.50,
        imageUrl: 'assets/drinks/cerveza.jpg',
        size: '355ml',
        available: true
      }
    ];

    console.log('Creando bebidas...');
    for (const drink of drinks) {
      await this.firestoreService.createDrink(drink);
    }
    console.log(`${drinks.length} bebidas creadas`);
  }

  // Inicializar configuración de la tienda
  private async initializeStoreConfig(): Promise<void> {
    const storeConfig: StoreConfig = {
      name: 'MakePizza - Centro',
      address: {
        street: 'Calle 72 #10-34',
        city: 'Bogotá',
        state: 'Cundinamarca',
        zipCode: '110221',
        country: 'Colombia'
      },
      latitude: 4.6536,
      longitude: -74.0573,
      deliveryRadius: 10, // 10 km
      baseDeliveryFee: 2.00,
      perKmFee: 0.50,
      phone: '+57 1 234 5678',
      email: 'info@makepizza.com',
      openingHours: [
        { day: 'Lunes', open: '11:00', close: '22:00' },
        { day: 'Martes', open: '11:00', close: '22:00' },
        { day: 'Miércoles', open: '11:00', close: '22:00' },
        { day: 'Jueves', open: '11:00', close: '22:00' },
        { day: 'Viernes', open: '11:00', close: '23:00' },
        { day: 'Sábado', open: '11:00', close: '23:00' },
        { day: 'Domingo', open: '12:00', close: '21:00' }
      ]
    };

    console.log('Creando configuración de tienda...');
    await this.firestoreService.updateStoreConfig(storeConfig);
    console.log('Configuración de tienda creada');
  }

  // Limpiar todos los datos (útil para desarrollo)
  async clearAllData(): Promise<void> {
    console.warn('Esta función debería implementarse con cuidado en producción');
    // Implementar solo si es necesario para desarrollo
  }
}
