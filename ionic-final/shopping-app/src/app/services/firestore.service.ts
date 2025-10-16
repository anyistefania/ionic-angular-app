import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, 
         updateDoc, deleteDoc, setDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product, User } from '../models/models.model';

@Injectable({
  providedIn: 'root'
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
        createdAt: new Date()
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
}