import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  Product,
  User,
  Pizza,
  Ingredient,
  Drink,
  Order,
  StoreConfig,
} from '../models/models.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  // ============== PRODUCTOS ==============

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  // Obtener un producto por ID
  getProduct(id: string): Observable<Product> {
    const productRef = doc(this.firestore, `products/${id}`);
    return docData(productRef, { idField: 'id' }) as Observable<Product>;
  }

  // Crear producto
  async createProduct(product: Product): Promise<any> {
    try {
      const productsRef = collection(this.firestore, 'products');
      const newProduct = {
        ...product,
        createdAt: new Date(),
      };
      const docRef = await addDoc(productsRef, newProduct);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Actualizar producto
  async updateProduct(id: string, product: Partial<Product>): Promise<any> {
    try {
      const productRef = doc(this.firestore, `products/${id}`);
      await updateDoc(productRef, product);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Eliminar producto
  async deleteProduct(id: string): Promise<any> {
    try {
      const productRef = doc(this.firestore, `products/${id}`);
      await deleteDoc(productRef);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Buscar productos por categoría
  getProductsByCategory(category: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const q = query(productsRef, where('category', '==', category));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  // ============== USUARIOS ==============

  // Guardar/actualizar datos de usuario
  async saveUserData(uid: string, userData: Partial<User>): Promise<any> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userRef, userData, { merge: true });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Obtener datos de usuario
  getUserData(uid: string): Observable<User> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef, { idField: 'uid' }) as Observable<User>;
  }

  // Actualizar datos de usuario
  async updateUserData(uid: string, userData: Partial<User>): Promise<any> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userRef, userData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ============== PIZZAS ==============

  // Obtener todas las pizzas
  getPizzas(): Observable<Pizza[]> {
    const pizzasRef = collection(this.firestore, 'pizzas');
    const q = query(pizzasRef, where('available', '==', true), orderBy('name'));
    return collectionData(q, { idField: 'id' }) as Observable<Pizza[]>;
  }

  // Obtener pizzas populares
  getPopularPizzas(): Observable<Pizza[]> {
    const pizzasRef = collection(this.firestore, 'pizzas');
    const q = query(
      pizzasRef,
      where('popular', '==', true),
      where('available', '==', true),
      limit(6)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Pizza[]>;
  }

  // Obtener una pizza por ID
  getPizza(id: string): Observable<Pizza> {
    const pizzaRef = doc(this.firestore, `pizzas/${id}`);
    return docData(pizzaRef, { idField: 'id' }) as Observable<Pizza>;
  }

  // Crear pizza (solo admin)
  async createPizza(pizza: Pizza): Promise<any> {
    try {
      const pizzasRef = collection(this.firestore, 'pizzas');
      const newPizza = {
        ...pizza,
        createdAt: new Date(),
      };
      const docRef = await addDoc(pizzasRef, newPizza);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Actualizar pizza (solo admin)
  async updatePizza(id: string, pizza: Partial<Pizza>): Promise<any> {
    try {
      const pizzaRef = doc(this.firestore, `pizzas/${id}`);
      await updateDoc(pizzaRef, pizza);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Eliminar pizza (solo admin)
  async deletePizza(id: string): Promise<any> {
    try {
      const pizzaRef = doc(this.firestore, `pizzas/${id}`);
      await deleteDoc(pizzaRef);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ============== INGREDIENTES ==============

  // Obtener todos los ingredientes
  // Línea 165-168 - REEMPLAZA ESTO:
  getIngredients(): Observable<Ingredient[]> {
    const ingredientsRef = collection(this.firestore, 'ingredients');
    return collectionData(ingredientsRef, { idField: 'id' }) as Observable<
      Ingredient[]
    >;
  }
  // Obtener ingredientes por categoría
  getIngredientsByCategory(category: string): Observable<Ingredient[]> {
    const ingredientsRef = collection(this.firestore, 'ingredients');
    const q = query(
      ingredientsRef,
      where('category', '==', category),
      where('available', '==', true)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Ingredient[]>;
  }

  // Crear ingrediente (solo admin)
  async createIngredient(ingredient: Ingredient): Promise<any> {
    try {
      const ingredientsRef = collection(this.firestore, 'ingredients');
      const docRef = await addDoc(ingredientsRef, ingredient);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Actualizar ingrediente (solo admin)
  async updateIngredient(
    id: string,
    ingredient: Partial<Ingredient>
  ): Promise<any> {
    try {
      const ingredientRef = doc(this.firestore, `ingredients/${id}`);
      await updateDoc(ingredientRef, ingredient);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ============== BEBIDAS ==============

  // Obtener todas las bebidas
  getDrinks(): Observable<Drink[]> {
    const drinksRef = collection(this.firestore, 'drinks');
    const q = query(drinksRef, where('available', '==', true), orderBy('name'));
    return collectionData(q, { idField: 'id' }) as Observable<Drink[]>;
  }

  // Crear bebida (solo admin)
  async createDrink(drink: Drink): Promise<any> {
    try {
      const drinksRef = collection(this.firestore, 'drinks');
      const docRef = await addDoc(drinksRef, drink);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Actualizar bebida (solo admin)
  async updateDrink(id: string, drink: Partial<Drink>): Promise<any> {
    try {
      const drinkRef = doc(this.firestore, `drinks/${id}`);
      await updateDoc(drinkRef, drink);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ============== ÓRDENES ==============

  // Crear orden
  async createOrder(order: Order): Promise<any> {
    try {
      const ordersRef = collection(this.firestore, 'orders');
      const newOrder = {
        ...order,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(ordersRef, newOrder);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Obtener órdenes de un usuario
  getUserOrders(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  // Obtener todas las órdenes (solo admin)
  getAllOrders(): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  // Obtener una orden por ID
  getOrder(id: string): Observable<Order> {
    const orderRef = doc(this.firestore, `orders/${id}`);
    return docData(orderRef, { idField: 'id' }) as Observable<Order>;
  }

  // Actualizar estado de orden
  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      const orderRef = doc(this.firestore, `orders/${orderId}`);
      await updateDoc(orderRef, {
        status: status,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Actualizar orden completa
  async updateOrder(orderId: string, order: Partial<Order>): Promise<any> {
    try {
      const orderRef = doc(this.firestore, `orders/${orderId}`);
      await updateDoc(orderRef, {
        ...order,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ============== CONFIGURACIÓN DE LA TIENDA ==============

  // Obtener configuración de la tienda
  getStoreConfig(): Observable<StoreConfig> {
    const configRef = doc(this.firestore, 'config/store');
    return docData(configRef, { idField: 'id' }) as Observable<StoreConfig>;
  }

  // Actualizar configuración de la tienda (solo admin)
  async updateStoreConfig(config: Partial<StoreConfig>): Promise<any> {
    try {
      const configRef = doc(this.firestore, 'config/store');
      await setDoc(configRef, config, { merge: true });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
