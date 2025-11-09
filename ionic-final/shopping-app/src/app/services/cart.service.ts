import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product, Drink, Address } from '../models/models.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  public total$: Observable<number> = this.totalSubject.asObservable();

  private deliveryAddress: Address | null = null;
  private deliveryFee: number = 0;

  constructor() {
    // Cargar carrito desde localStorage si existe
    this.loadCart();
  }

  // Obtener items del carrito
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Agregar item al carrito (pizza o bebida)
  addItem(item: CartItem): void {
    // Generar ID único para el item si no tiene
    if (!item.id) {
      item.id = this.generateItemId();
    }

    // Para pizzas personalizadas, siempre agregar como nuevo item
    if (item.type === 'custom-pizza') {
      this.cartItems.push(item);
    } else {
      // Para pizzas predefinidas y bebidas, verificar si ya existe
      const existingItemIndex = this.findExistingItemIndex(item);

      if (existingItemIndex !== -1) {
        // Si ya existe, incrementar cantidad y actualizar subtotal
        this.cartItems[existingItemIndex].quantity += item.quantity;
        this.cartItems[existingItemIndex].subtotal =
          this.cartItems[existingItemIndex].unitPrice *
          this.cartItems[existingItemIndex].quantity;
      } else {
        // Si no existe, agregarlo
        this.cartItems.push(item);
      }
    }

    this.updateCart();
  }

  // Encontrar índice de item existente
  private findExistingItemIndex(newItem: CartItem): number {
    return this.cartItems.findIndex(item => {
      if (item.type !== newItem.type) return false;

      // Comparar por ID del item
      if (item.type === 'predefined-pizza' && newItem.type === 'predefined-pizza') {
        const itemPizza = item.item as any;
        const newItemPizza = newItem.item as any;
        return itemPizza.id === newItemPizza.id &&
               item.size?.id === newItem.size?.id;
      }

      if (item.type === 'drink' && newItem.type === 'drink') {
        const itemDrink = item.item as Drink;
        const newItemDrink = newItem.item as Drink;
        return itemDrink.id === newItemDrink.id;
      }

      return false;
    });
  }

  // Generar ID único para item del carrito
  private generateItemId(): string {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Actualizar cantidad de un item
  updateItemQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.id === itemId);

    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        item.subtotal = item.unitPrice * quantity;
        this.updateCart();
      }
    }
  }

  // Eliminar item del carrito
  removeItem(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCart();
  }

  // Vaciar carrito
  clearCart(): void {
    this.cartItems = [];
    this.deliveryAddress = null;
    this.deliveryFee = 0;
    this.updateCart();
  }

  // Obtener subtotal (sin delivery)
  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.subtotal;
    }, 0);
  }

  // Obtener total del carrito (con delivery)
  getTotal(): number {
    return this.getSubtotal() + this.deliveryFee;
  }

  // Obtener cantidad total de items
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Establecer dirección de entrega
  setDeliveryAddress(address: Address): void {
    this.deliveryAddress = address;
    this.saveCart();
  }

  // Obtener dirección de entrega
  getDeliveryAddress(): Address | null {
    return this.deliveryAddress;
  }

  // Establecer costo de delivery
  setDeliveryFee(fee: number): void {
    this.deliveryFee = fee;
    this.totalSubject.next(this.getTotal());
    this.saveCart();
  }

  // Obtener costo de delivery
  getDeliveryFee(): number {
    return this.deliveryFee;
  }

  // Verificar si el carrito tiene items
  isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  // Contar items por tipo
  getItemCountByType(type: 'predefined-pizza' | 'custom-pizza' | 'drink'): number {
    return this.cartItems.filter(item => item.type === type).length;
  }

  // Actualizar carrito y notificar cambios
  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.totalSubject.next(this.getTotal());
    this.saveCart();
  }

  // Guardar carrito en localStorage
  private saveCart(): void {
    const cartData = {
      items: this.cartItems,
      deliveryAddress: this.deliveryAddress,
      deliveryFee: this.deliveryFee
    };
    localStorage.setItem('makepizza-cart', JSON.stringify(cartData));
  }

  // Cargar carrito desde localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem('makepizza-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        this.cartItems = cartData.items || [];
        this.deliveryAddress = cartData.deliveryAddress || null;
        this.deliveryFee = cartData.deliveryFee || 0;
        this.updateCart();
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        this.cartItems = [];
      }
    }
  }

  // ===== MÉTODOS DE COMPATIBILIDAD CON CÓDIGO EXISTENTE =====

  // Agregar producto (para compatibilidad)
  addToCart(product: Product, quantity: number = 1): void {
    const cartItem: CartItem = {
      id: this.generateItemId(),
      type: 'predefined-pizza',
      item: product as any,
      quantity: quantity,
      unitPrice: product.price,
      subtotal: product.price * quantity
    };
    this.addItem(cartItem);
  }

  // Actualizar cantidad por ID de producto (para compatibilidad)
  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => {
      const itemData = item.item as any;
      return itemData.id === productId;
    });

    if (item && item.id) {
      this.updateItemQuantity(item.id, quantity);
    }
  }

  // Eliminar por ID de producto (para compatibilidad)
  removeFromCart(productId: string): void {
    const item = this.cartItems.find(item => {
      const itemData = item.item as any;
      return itemData.id === productId;
    });

    if (item && item.id) {
      this.removeItem(item.id);
    }
  }

  // Verificar si producto está en carrito (para compatibilidad)
  isInCart(productId: string): boolean {
    return this.cartItems.some(item => {
      const itemData = item.item as any;
      return itemData.id === productId;
    });
  }

  // Obtener cantidad de producto (para compatibilidad)
  getProductQuantity(productId: string): number {
    const item = this.cartItems.find(item => {
      const itemData = item.item as any;
      return itemData.id === productId;
    });
    return item ? item.quantity : 0;
  }
}