import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product } from '../models/models.model';

@Injectable({
  providedIn: 'root'
})
export  class CartService {
   cartItems: CartItem[] = [];
   cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

   totalSubject = new BehaviorSubject<number>(0);
  public total$: Observable<number> = this.totalSubject.asObservable();

  constructor() {
    // Cargar carrito desde localStorage si existe
    this.loadCart();
  }

  // Obtener items del carrito
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Agregar producto al carrito
  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Si ya existe, incrementar cantidad
      existingItem.quantity += quantity;
    } else {
      // Si no existe, agregarlo
      this.cartItems.push({ product, quantity });
    }

    this.updateCart();
  }

  // Actualizar cantidad de un producto
  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  // Eliminar producto del carrito
  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  // Vaciar carrito
  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  // Obtener total del carrito
  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  // Obtener cantidad total de items
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Verificar si un producto está en el carrito
  isInCart(productId: string): boolean {
    return this.cartItems.some(item => item.product.id === productId);
  }

  // Obtener cantidad de un producto en el carrito
  getProductQuantity(productId: string): number {
    const item = this.cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  // Actualizar carrito y notificar cambios
  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.totalSubject.next(this.getTotal());
    this.saveCart();
  }

  // Guardar carrito en localStorage
  private saveCart(): void {
    localStorage.setItem('shopping-cart', JSON.stringify(this.cartItems));
  }

  // Cargar carrito desde localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.updateCart();
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        this.cartItems = [];
      }
    }
  }
}