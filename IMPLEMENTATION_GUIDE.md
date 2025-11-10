# Guía de Implementación - MakePizza UI

Esta guía describe cómo implementar los componentes de interfaz de usuario para completar la aplicación MakePizza.

## ✅ Estado Actual

### Completado
- ✅ Todos los servicios backend
- ✅ Modelos de datos
- ✅ Autenticación con roles
- ✅ Guards de autorización
- ✅ Integración con APIs externas
- ✅ Lógica de negocio completa

### Pendiente
- ⏳ Componentes y páginas de UI
- ⏳ Actualización de routing
- ⏳ Estilos y diseño
- ⏳ Testing y compilación

## 📋 Componentes a Implementar

### 1. Actualizar App Routing

**Archivo**: `src/app/app-routing.module.ts`

```typescript
const routes: Routes = [
  { path: '', redirectTo: 'pizzas', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },

  // Rutas protegidas
  { path: 'pizzas', loadChildren: () => import('./pages/pizzas/pizzas.module').then(m => m.PizzasPageModule), canActivate: [AuthGuard] },
  { path: 'pizza/:id', loadChildren: () => import('./pages/pizza-detail/pizza-detail.module').then(m => m.PizzaDetailPageModule), canActivate: [AuthGuard] },
  { path: 'custom-pizza', loadChildren: () => import('./pages/custom-pizza/custom-pizza.module').then(m => m.CustomPizzaPageModule), canActivate: [AuthGuard] },
  { path: 'drinks', loadChildren: () => import('./pages/drinks/drinks.module').then(m => m.DrinksPageModule), canActivate: [AuthGuard] },
  { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule), canActivate: [AuthGuard] },
  { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule), canActivate: [AuthGuard] },
  { path: 'orders', loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule), canActivate: [AuthGuard] },
  { path: 'order-tracking/:id', loadChildren: () => import('./pages/order-tracking/order-tracking.module').then(m => m.OrderTrackingPageModule), canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule), canActivate: [AuthGuard] },

  // Rutas de administrador
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule), canActivate: [AdminGuard] },
];
```

### 2. Página de Pizzas (Catálogo)

**Generar**: `ionic g page pages/pizzas`

**Funcionalidades**:
- Mostrar lista de pizzas predefinidas
- Filtro por categoría
- Mostrar pizzas populares destacadas
- Botón para ir al constructor de pizzas
- Agregar pizza al carrito con selección de tamaño

**Servicios a usar**:
```typescript
constructor(
  private pizzaService: PizzaService,
  private cartService: CartService,
  private router: Router
) {}
```

**Template básico**:
```html
<ion-header>
  <ion-toolbar>
    <ion-title>Nuestras Pizzas</ion-title>
    <ion-buttons slot="end">
      <ion-button routerLink="/cart">
        <ion-icon name="cart"></ion-icon>
        <ion-badge>{{cartItems}}</ion-badge>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <!-- Botón para pizza personalizada -->
  <ion-button expand="block" routerLink="/custom-pizza">
    <ion-icon name="add-circle"></ion-icon>
    Crear Tu Pizza
  </ion-button>

  <!-- Pizzas populares -->
  <ion-list-header>
    <ion-label>Pizzas Populares</ion-label>
  </ion-list-header>

  <ion-grid>
    <ion-row>
      <ion-col *ngFor="let pizza of popularPizzas" size="12" size-md="6">
        <ion-card (click)="viewPizzaDetail(pizza)">
          <img [src]="pizza.imageUrl" [alt]="pizza.name">
          <ion-card-header>
            <ion-card-title>{{pizza.name}}</ion-card-title>
            <ion-card-subtitle>{{pizza.description}}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>Desde ${{pizza.basePrice}}</p>
            <ion-button (click)="addToCart(pizza, $event)">
              Agregar al Carrito
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</ion-content>
```

### 3. Constructor de Pizzas Personalizadas

**Generar**: `ionic g page pages/custom-pizza`

**Funcionalidades**:
- Selección de tamaño
- Selección de base
- Selección de queso
- Selección de salsa
- Selección de ingredientes (múltiple)
- Cálculo de precio en tiempo real
- Validación de pizza
- Agregar al carrito

**Servicios**:
```typescript
constructor(
  private pizzaService: PizzaService,
  private cartService: CartService,
  private alertController: AlertController
) {}
```

**Estado del componente**:
```typescript
customPizza: CustomPizza = {
  size: null,
  base: null,
  cheese: null,
  sauce: null,
  toppings: [],
  totalPrice: 0
};

sizes: PizzaSize[];
bases: Ingredient[];
cheeses: Ingredient[];
sauces: Ingredient[];
toppings: Ingredient[];
```

### 4. Página de Carrito

**Actualizar**: `src/app/pages/cart/cart.page.ts`

**Funcionalidades**:
- Mostrar items del carrito
- Modificar cantidades
- Eliminar items
- Seleccionar dirección de entrega
- Calcular delivery fee
- Mostrar subtotal y total
- Botón para checkout

**Template elementos clave**:
```html
<!-- Item de carrito -->
<ion-item *ngFor="let item of cartItems">
  <ion-thumbnail slot="start">
    <img [src]="getItemImage(item)">
  </ion-thumbnail>
  <ion-label>
    <h2>{{getItemName(item)}}</h2>
    <p>{{getItemDescription(item)}}</p>
    <p>${{item.unitPrice}} x {{item.quantity}}</p>
  </ion-label>
  <ion-buttons slot="end">
    <ion-button (click)="decreaseQuantity(item)">
      <ion-icon name="remove-circle"></ion-icon>
    </ion-button>
    <span>{{item.quantity}}</span>
    <ion-button (click)="increaseQuantity(item)">
      <ion-icon name="add-circle"></ion-icon>
    </ion-button>
  </ion-buttons>
</ion-item>

<!-- Resumen -->
<ion-card>
  <ion-card-content>
    <ion-item>
      <ion-label>Subtotal</ion-label>
      <ion-note slot="end">${{subtotal}}</ion-note>
    </ion-item>
    <ion-item>
      <ion-label>Delivery</ion-label>
      <ion-note slot="end">${{deliveryFee}}</ion-note>
    </ion-item>
    <ion-item>
      <ion-label><strong>Total</strong></ion-label>
      <ion-note slot="end"><strong>${{total}}</strong></ion-note>
    </ion-item>
  </ion-card-content>
</ion-card>

<ion-button expand="block" (click)="proceedToCheckout()">
  Proceder al Pago
</ion-button>
```

### 5. Página de Checkout

**Generar**: `ionic g page pages/checkout`

**Funcionalidades**:
- Confirmar dirección de entrega
- Mostrar resumen de orden
- Integración con PayPal
- Procesamiento de pago
- Creación de orden en Firestore
- Redirección a seguimiento

**Servicios**:
```typescript
constructor(
  private cartService: CartService,
  private paymentService: PaymentService,
  private firestoreService: FirestoreService,
  private authService: AuthService,
  private mapsService: MapsService,
  private router: Router
) {}
```

**Proceso de pago**:
```typescript
async processPayment() {
  // 1. Validar carrito y dirección
  if (this.cartService.isEmpty()) {
    // Mostrar error
    return;
  }

  // 2. Crear orden
  const order: Order = {
    userId: this.authService.getCurrentUser().uid,
    userName: this.authService.getUserData().displayName,
    userEmail: this.authService.getUserData().email,
    items: this.cartService.getCartItems(),
    deliveryAddress: this.cartService.getDeliveryAddress(),
    subtotal: this.cartService.getSubtotal(),
    deliveryFee: this.cartService.getDeliveryFee(),
    total: this.cartService.getTotal(),
    status: 'pending',
    createdAt: new Date()
  };

  // 3. Renderizar botón PayPal
  await this.paymentService.renderPayPalButton(
    'paypal-button-container',
    order,
    async (paymentInfo) => {
      // 4. Pago exitoso - Guardar orden
      order.payment = paymentInfo;
      order.status = 'paid';

      const result = await this.firestoreService.createOrder(order);

      if (result.success) {
        // 5. Limpiar carrito
        this.cartService.clearCart();

        // 6. Redirigir a seguimiento
        this.router.navigate(['/order-tracking', result.id]);
      }
    },
    (error) => {
      // Manejar error
      console.error('Error en pago:', error);
    }
  );
}
```

### 6. Página de Seguimiento de Orden

**Generar**: `ionic g page pages/order-tracking`

**Funcionalidades**:
- Mostrar detalles de la orden
- Estado actual de la orden
- Mapa con ruta de entrega
- Tiempo estimado
- Información del clima
- Actualización en tiempo real

**Servicios**:
```typescript
constructor(
  private route: ActivatedRoute,
  private firestoreService: FirestoreService,
  private mapsService: MapsService,
  private weatherService: WeatherService
) {}
```

**Inicialización del mapa**:
```typescript
async initMap() {
  const orderId = this.route.snapshot.paramMap.get('id');

  // Obtener orden
  this.firestoreService.getOrder(orderId).subscribe(async order => {
    this.order = order;

    // Obtener ubicaciones
    const storeLocation = this.mapsService.getStoreLocation();
    const deliveryLocation = await this.mapsService.geocodeAddress(order.deliveryAddress);

    // Inicializar mapa
    const map = await this.mapsService.initMap('map', storeLocation, 13);

    // Agregar marcadores
    this.mapsService.createMarker(map, storeLocation, 'MakePizza', 'assets/icons/store.png');
    this.mapsService.createMarker(map, deliveryLocation, 'Tu ubicación', 'assets/icons/home.png');

    // Mostrar ruta
    const routeInfo = await this.mapsService.displayRoute(map, storeLocation, deliveryLocation);

    this.estimatedTime = routeInfo.duration;
  });
}
```

### 7. Panel de Administración

**Generar**: `ionic g page pages/admin`

**Sub-páginas**:
- `admin/pizzas` - Gestión de pizzas
- `admin/ingredients` - Gestión de ingredientes
- `admin/orders` - Ver y gestionar órdenes
- `admin/config` - Configuración de la tienda

**Funcionalidades principales**:
- CRUD de pizzas
- CRUD de ingredientes
- CRUD de bebidas
- Lista de todas las órdenes
- Actualizar estado de órdenes
- Estadísticas básicas

### 8. Actualizar Página de Registro

**Archivo**: `src/app/pages/register/register.page.ts`

**Actualizar para incluir selección de rol** (solo para demo):
```typescript
async register() {
  const result = await this.authService.register(
    this.email,
    this.password,
    this.displayName,
    'user' // Por defecto usuario normal
  );

  if (result.success) {
    this.router.navigate(['/pizzas']);
  }
}
```

## 🎨 Estilos y Diseño

### Paleta de Colores Sugerida

```scss
// src/theme/variables.scss
:root {
  --ion-color-primary: #ff6b35;
  --ion-color-secondary: #f7931e;
  --ion-color-tertiary: #4ecdc4;
  --ion-color-success: #2dd36f;
  --ion-color-warning: #ffc409;
  --ion-color-danger: #eb445a;
  --ion-color-dark: #222428;
  --ion-color-medium: #92949c;
  --ion-color-light: #f4f5f8;
}
```

### Componentes Reutilizables

Crear componentes compartidos:

```bash
ionic g component components/pizza-card
ionic g component components/ingredient-selector
ionic g component components/order-status-badge
ionic g component components/weather-widget
```

## 🔧 Utilidades y Helpers

### Pipe para formato de moneda
```bash
ionic g pipe pipes/currency
```

### Pipe para estado de orden
```bash
ionic g pipe pipes/order-status
```

## 📱 Navegación y UX

### Tabs de Navegación

Considerar usar tabs para navegación principal:

```html
<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="pizzas">
      <ion-icon name="pizza"></ion-icon>
      <ion-label>Pizzas</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="custom-pizza">
      <ion-icon name="add-circle"></ion-icon>
      <ion-label>Personalizar</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="cart">
      <ion-icon name="cart"></ion-icon>
      <ion-label>Carrito</ion-label>
      <ion-badge>{{cartCount}}</ion-badge>
    </ion-tab-button>

    <ion-tab-button tab="orders">
      <ion-icon name="list"></ion-icon>
      <ion-label>Órdenes</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="profile">
      <ion-icon name="person"></ion-icon>
      <ion-label>Perfil</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```

## 🧪 Testing

### Comandos útiles
```bash
# Compilar
npm run build

# Servir
ionic serve

# Generar APK (después de agregar plataforma)
ionic capacitor build android
```

## 📦 Assets Necesarios

Crear carpetas en `src/assets/`:
- `assets/pizzas/` - Imágenes de pizzas
- `assets/ingredients/` - Imágenes de ingredientes
- `assets/drinks/` - Imágenes de bebidas
- `assets/icons/` - Iconos personalizados
- `assets/images/` - Imágenes generales

## 🚀 Prioridades de Implementación

1. **Alta prioridad** (Core funcional):
   - ✅ Routing actualizado
   - ✅ Página de pizzas
   - ✅ Constructor de pizzas
   - ✅ Carrito actualizado
   - ✅ Checkout con PayPal

2. **Media prioridad** (Experiencia completa):
   - Seguimiento de órdenes con mapa
   - Panel de admin básico
   - Historial de órdenes

3. **Baja prioridad** (Mejoras):
   - Animaciones
   - Optimización de imágenes
   - PWA features

## 💡 Tips de Desarrollo

1. Usar datos mock para desarrollo sin conectar Firebase
2. Implementar lazy loading para todas las páginas
3. Usar Ionic Storage para caché local
4. Implementar interceptors HTTP para manejo de errores
5. Agregar loading indicators en operaciones asíncronas
6. Validar formularios con Angular Reactive Forms

## 📚 Recursos Útiles

- [Ionic Components](https://ionicframework.com/docs/components)
- [Angular Forms](https://angular.io/guide/forms)
- [Firebase Docs](https://firebase.google.com/docs)
- [PayPal SDK](https://developer.paypal.com/sdk/js/)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)

---

Con esta guía, podrás completar la implementación de la UI de MakePizza siguiendo las mejores prácticas de Ionic y Angular.
