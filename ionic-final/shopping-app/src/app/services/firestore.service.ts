import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, setDoc,
         query, where, orderBy, limit, onSnapshot, QueryConstraint } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, User, Pizza, Ingredient, Drink, Order, StoreConfig } from '../models/models.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  // Helper para convertir query snapshot a Observable
  private queryToObservable<T>(collectionRef: any): Observable<T[]> {
    return new Observable(observer => {
      const unsubscribe = onSnapshot(collectionRef,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as T));
          observer.next(data);
        },
        (error) => {
          observer.error(error);
        }
      );
      return () => unsubscribe();
    });
  }

  // Helper para convertir document snapshot a Observable
  private docToObservable<T>(documentRef: any): Observable<T> {
    return new Observable(observer => {
      const unsubscribe = onSnapshot(documentRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = {
              id: snapshot.id,
              ...snapshot.data()
            } as T;
            observer.next(data);
          }
        },
        (error) => {
          observer.error(error);
        }
      );
      return () => unsubscribe();
    });
  }

  // ============== PRODUCTOS ==============

  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    return this.queryToObservable<Product>(q);
  }

  getProduct(id: string): Observable<Product> {
    const productRef = doc(this.firestore, `products/${id}`);
    return this.docToObservable<Product>(productRef);
  }

  async createProduct(product: Product): Promise<any> {
    try {
      const productsRef = collection(this.firestore, 'products');
      const newProduct = { ...product, createdAt: new Date() };
      const docRef = await addDoc(productsRef, newProduct);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<any> {
    try {
      const productRef = doc(this.firestore, `products/${id}`);
      await updateDoc(productRef, product);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteProduct(id: string): Promise<any> {
    try {
      const productRef = doc(this.firestore, `products/${id}`);
      await deleteDoc(productRef);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const q = query(productsRef, where('category', '==', category));
    return this.queryToObservable<Product>(q);
  }

  // ============== USUARIOS ==============

  async saveUserData(uid: string, userData: Partial<User>): Promise<any> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userRef, userData, { merge: true });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  getUserData(uid: string): Observable<User> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return this.docToObservable<User>(userRef);
  }

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

  getPizzas(): Observable<Pizza[]> {
    const pizzasRef = collection(this.firestore, 'pizzas');
    const q = query(pizzasRef, where('available', '==', true));
    return this.queryToObservable<Pizza>(q).pipe(
      map((pizzas: Pizza[]) => pizzas.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  getPopularPizzas(): Observable<Pizza[]> {
    const pizzasRef = collection(this.firestore, 'pizzas');
    const q = query(pizzasRef, where('popular', '==', true), where('available', '==', true), limit(6));
    return this.queryToObservable<Pizza>(q);
  }

  getPizza(id: string): Observable<Pizza> {
    const pizzaRef = doc(this.firestore, `pizzas/${id}`);
    return this.docToObservable<Pizza>(pizzaRef);
  }

  async createPizza(pizza: Pizza): Promise<any> {
    try {
      const pizzasRef = collection(this.firestore, 'pizzas');
      const newPizza = { ...pizza, createdAt: new Date() };
      const docRef = await addDoc(pizzasRef, newPizza);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updatePizza(id: string, pizza: Partial<Pizza>): Promise<any> {
    try {
      const pizzaRef = doc(this.firestore, `pizzas/${id}`);
      await updateDoc(pizzaRef, pizza);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

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

  getIngredients(): Observable<Ingredient[]> {
    const ingredientsRef = collection(this.firestore, 'ingredients');
    const q = query(ingredientsRef, where('available', '==', true));
    return this.queryToObservable<Ingredient>(q).pipe(
      map((ingredients: Ingredient[]) => {
        return ingredients.sort((a, b) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }
          return a.name.localeCompare(b.name);
        });
      })
    );
  }

  getIngredientsByCategory(category: string): Observable<Ingredient[]> {
    const ingredientsRef = collection(this.firestore, 'ingredients');
    const q = query(ingredientsRef, where('category', '==', category), where('available', '==', true));
    return this.queryToObservable<Ingredient>(q);
  }

  async createIngredient(ingredient: Ingredient): Promise<any> {
    try {
      const ingredientsRef = collection(this.firestore, 'ingredients');
      const docRef = await addDoc(ingredientsRef, ingredient);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateIngredient(id: string, ingredient: Partial<Ingredient>): Promise<any> {
    try {
      const ingredientRef = doc(this.firestore, `ingredients/${id}`);
      await updateDoc(ingredientRef, ingredient);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ============== BEBIDAS ==============

  getDrinks(): Observable<Drink[]> {
    const drinksRef = collection(this.firestore, 'drinks');
    const q = query(drinksRef, where('available', '==', true));
    return this.queryToObservable<Drink>(q).pipe(
      map((drinks: Drink[]) => drinks.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  async createDrink(drink: Drink): Promise<any> {
    try {
      const drinksRef = collection(this.firestore, 'drinks');
      const docRef = await addDoc(drinksRef, drink);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

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

  async createOrder(order: Order): Promise<any> {
    try {
      const ordersRef = collection(this.firestore, 'orders');
      const newOrder = {
        ...order,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const docRef = await addDoc(ordersRef, newOrder);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  getUserOrders(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    return this.queryToObservable<Order>(q).pipe(
      map((orders: Order[]) => {
        return orders.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() :
                       (a.createdAt as any).toDate ? (a.createdAt as any).toDate().getTime() : 0;
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() :
                       (b.createdAt as any).toDate ? (b.createdAt as any).toDate().getTime() : 0;
          return dateB - dateA;
        });
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    return this.queryToObservable<Order>(q);
  }

  getOrder(id: string): Observable<Order> {
    const orderRef = doc(this.firestore, `orders/${id}`);
    return this.docToObservable<Order>(orderRef);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      const orderRef = doc(this.firestore, `orders/${orderId}`);
      await updateDoc(orderRef, {
        status: status,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateOrder(orderId: string, order: Partial<Order>): Promise<any> {
    try {
      const orderRef = doc(this.firestore, `orders/${orderId}`);
      await updateDoc(orderRef, {
        ...order,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // ============== CONFIGURACIÓN DE LA TIENDA ==============

  getStoreConfig(): Observable<StoreConfig> {
    const configRef = doc(this.firestore, 'config/store');
    return this.docToObservable<StoreConfig>(configRef);
  }

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
