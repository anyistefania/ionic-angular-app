// Tipos de roles de usuario
export type UserRole = 'admin' | 'user';

// Usuario extendido con rol y dirección
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  addresses?: Address[];
  createdAt?: Date;
}

// Dirección de entrega
export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

// Ingrediente para pizzas
export interface Ingredient {
  id?: string;
  name: string;
  price: number;
  category: 'base' | 'cheese' | 'meat' | 'vegetable' | 'sauce' | 'extra';
  imageUrl?: string;
  available: boolean;
}

// Tamaño de pizza
export interface PizzaSize {
  id: string;
  name: string;
  priceMultiplier: number;
  slices: number;
}

// Pizza predefinida
export interface Pizza {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  category: string;
  ingredients: string[]; // IDs de ingredientes
  popular?: boolean;
  available: boolean;
  createdAt?: Date;
}

// Pizza personalizada
export interface CustomPizza {
  id?: string;
  size: PizzaSize;
  base: Ingredient;
  cheese?: Ingredient;
  sauce?: Ingredient;
  toppings: Ingredient[];
  totalPrice: number;
}

// Bebida
export interface Drink {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  size: string;
  available: boolean;
}

// Item del carrito (puede ser pizza predefinida, pizza personalizada o bebida)
export interface CartItem {
  id?: string;
  type: 'predefined-pizza' | 'custom-pizza' | 'drink';
  item: Pizza | CustomPizza | Drink;
  quantity: number;
  size?: PizzaSize;
  unitPrice: number;
  subtotal: number;
}

// Información de pago
export interface PaymentInfo {
  method: 'paypal' | 'card';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  paidAt?: Date;
}

// Estado de la orden
export type OrderStatus =
  | 'pending' // Pedido creado, esperando pago
  | 'paid' // Pago confirmado
  | 'preparing' // Preparando la pizza
  | 'ready' // Lista para entrega
  | 'in-delivery' // En camino
  | 'delivered' // Entregada
  | 'cancelled'; // Cancelada

// Orden de pizza
export interface Order {
  deliveryPerson: any;
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  deliveryAddress: Address;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  payment?: PaymentInfo;
  notes?: string;
  estimatedDeliveryTime?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

// Configuración de la tienda (origen para el mapa)
export interface StoreConfig {
  id?: string;
  name: string;
  address: Address;
  latitude: number;
  longitude: number;
  deliveryRadius: number; // en kilómetros
  baseDeliveryFee: number;
  perKmFee: number;
  phone: string;
  email: string;
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];
}

// Producto genérico (para compatibilidad con código existente)
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  createdAt?: Date;
}
