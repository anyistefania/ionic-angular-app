# MakePizza - Aplicación Móvil de Pedidos de Pizza

Aplicación móvil desarrollada con Ionic, Angular y Firebase para realizar pedidos de pizza con entrega a domicilio.

## 📋 Requisitos Cumplidos

### 1. Autenticación ✅
- Firebase Authentication implementada
- Login y registro de usuarios
- Gestión de sesiones
- Perfiles de usuario guardados en Firestore

### 2. Autorización (Roles) ✅
- **Usuario**: Puede hacer pedidos, ver su perfil, historial de órdenes
- **Administrador**: Gestión de pizzas, ingredientes, órdenes, configuración
- Guards implementados: `AuthGuard` y `AdminGuard`

### 3. Pasarela de Pagos ✅
- Integración con PayPal
- Soporte para pagos con tarjeta (simulado para desarrollo)
- Servicio de pagos: `PaymentService`

### 4. Base de Datos ✅
- Firebase Firestore (NoSQL)
- Colecciones:
  - `users` - Datos de usuarios con roles
  - `pizzas` - Pizzas predefinidas
  - `ingredients` - Ingredientes disponibles
  - `drinks` - Bebidas
  - `orders` - Órdenes de clientes
  - `config/store` - Configuración de la tienda

### 5. API Externa ✅
- OpenWeatherMap API para condiciones climáticas
- Muestra el clima y cómo puede afectar tiempos de entrega
- Servicio: `WeatherService`

## 🏗️ Arquitectura

### Modelos de Datos

```typescript
// Usuario con rol
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  addresses?: Address[];
}

// Pizza predefinida
interface Pizza {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  ingredients: string[];
  popular?: boolean;
  available: boolean;
}

// Pizza personalizada
interface CustomPizza {
  size: PizzaSize;
  base: Ingredient;
  cheese?: Ingredient;
  sauce?: Ingredient;
  toppings: Ingredient[];
  totalPrice: number;
}

// Orden
interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  deliveryAddress: Address;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  payment?: PaymentInfo;
}
```

### Servicios Implementados

1. **AuthService** - Autenticación con Firebase
   - Registro y login
   - Gestión de roles
   - Actualización de perfil

2. **FirestoreService** - Operaciones de base de datos
   - CRUD para pizzas, ingredientes, bebidas
   - Gestión de órdenes
   - Configuración de tienda

3. **PizzaService** - Lógica de negocio para pizzas
   - Cálculo de precios
   - Validación de pizzas personalizadas
   - Creación de items del carrito

4. **CartService** - Carrito de compras
   - Gestión de items (pizzas y bebidas)
   - Cálculo de subtotales y total
   - Manejo de dirección de entrega
   - Persistencia en localStorage

5. **PaymentService** - Procesamiento de pagos
   - Integración con PayPal SDK
   - Validación de tarjetas de crédito
   - Pagos simulados para desarrollo

6. **MapsService** - Integración con Google Maps
   - Cálculo de rutas y distancias
   - Geocodificación de direcciones
   - Visualización de mapa de entrega
   - Cálculo de costo de delivery basado en distancia

7. **WeatherService** - API externa
   - Obtención de datos meteorológicos
   - Evaluación de condiciones para delivery

8. **DataInitService** - Inicialización de datos
   - Población inicial de la base de datos
   - Datos de ejemplo para desarrollo

## 🎨 Características Principales

### Para Usuarios
- ✅ Registro e inicio de sesión
- ✅ Explorar pizzas predefinidas
- ✅ Constructor de pizzas personalizadas
- ✅ Selección de tamaños (Pequeña, Mediana, Grande, XL)
- ✅ Agregar bebidas
- ✅ Carrito de compras con cálculo de precios
- ✅ Gestión de direcciones de entrega
- ✅ Visualización de mapa con ruta de entrega
- ✅ Cálculo automático de costo de domicilio
- ✅ Pago con PayPal o tarjeta
- ✅ Seguimiento de órdenes
- ✅ Historial de pedidos
- ✅ Información del clima

### Para Administradores
- ✅ Panel de administración
- ✅ Gestión de pizzas predefinidas
- ✅ Gestión de ingredientes
- ✅ Gestión de bebidas
- ✅ Ver todas las órdenes
- ✅ Actualizar estado de órdenes
- ✅ Configuración de la tienda
- ✅ Gestión de precios y delivery

## 📱 Páginas de la Aplicación

### Públicas
- `/login` - Inicio de sesión
- `/register` - Registro de usuario

### Protegidas (requiere autenticación)
- `/pizzas` - Catálogo de pizzas predefinidas
- `/custom-pizza` - Constructor de pizzas
- `/drinks` - Catálogo de bebidas
- `/cart` - Carrito de compras
- `/checkout` - Proceso de pago
- `/orders` - Historial de órdenes
- `/order-tracking/:id` - Seguimiento de orden con mapa
- `/profile` - Perfil de usuario

### Solo Administrador
- `/admin` - Panel de administración
- `/admin/pizzas` - Gestión de pizzas
- `/admin/ingredients` - Gestión de ingredientes
- `/admin/orders` - Gestión de órdenes
- `/admin/config` - Configuración

## 🚀 Tecnologías Utilizadas

- **Ionic 8** - Framework móvil
- **Angular 20** - Framework web
- **Firebase**:
  - Authentication - Autenticación
  - Firestore - Base de datos NoSQL
  - Storage - Almacenamiento de imágenes
- **PayPal SDK** - Procesamiento de pagos
- **Google Maps API** - Mapas y geocodificación
- **OpenWeatherMap API** - Datos meteorológicos
- **RxJS** - Programación reactiva
- **TypeScript** - Lenguaje de programación

## 🔧 Configuración

### Variables de Entorno

Actualizar en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    // Configuración de Firebase
  }
};
```

### APIs Externas Requeridas

1. **Firebase**: Ya configurado
2. **PayPal**: Actualizar `clientId` en `PaymentService`
3. **Google Maps**: Actualizar `apiKey` en `MapsService`
4. **OpenWeatherMap**: Actualizar `apiKey` en `WeatherService`

## 📦 Instalación

```bash
cd ionic-final/shopping-app
npm install
```

## 🏃 Ejecución

```bash
# Desarrollo
npm start

# Build
npm run build

# Tests
npm test
```

## 🗄️ Inicialización de Datos

Para poblar la base de datos con datos de ejemplo, usar el `DataInitService`:

```typescript
// En algún componente o servicio
constructor(private dataInitService: DataInitService) {}

async initData() {
  await this.dataInitService.initializeAllData();
}
```

## 📊 Estados de Órdenes

1. `pending` - Pedido creado, esperando pago
2. `paid` - Pago confirmado
3. `preparing` - Preparando la pizza
4. `ready` - Lista para entrega
5. `in-delivery` - En camino
6. `delivered` - Entregada
7. `cancelled` - Cancelada

## 🌟 Características Destacadas

### Constructor de Pizzas Personalizadas
- Selección de base (tradicional, delgada, integral, gruesa)
- Múltiples opciones de queso
- Variedad de salsas
- Más de 15 ingredientes disponibles
- Cálculo automático de precio según tamaño e ingredientes

### Sistema de Entrega Inteligente
- Cálculo de distancia usando Google Maps
- Costo de delivery basado en distancia
- Visualización de ruta en mapa
- Verificación de radio de entrega
- Tiempo estimado de entrega

### Integración Climática
- Muestra condiciones actuales
- Advierte sobre posibles retrasos por mal clima
- Información útil para el cliente

## 🔐 Seguridad

- Autenticación mediante Firebase Auth
- Reglas de Firestore para proteger datos
- Guards de Angular para rutas protegidas
- Validación de roles en frontend y backend
- Tokens seguros para procesamiento de pagos

## 📝 Notas de Desarrollo

- Las imágenes deben colocarse en `src/assets/`
- Los API keys deben manejarse mediante variables de entorno en producción
- El modo de pago incluye opción simulada para desarrollo sin PayPal real

## 🎯 Próximos Pasos

### Páginas a Implementar
- [ ] Crear componentes de UI para todas las páginas
- [ ] Implementar navegación completa
- [ ] Estilos y diseño responsive
- [ ] Animaciones y transiciones

### Funcionalidades Adicionales
- [ ] Notificaciones push para estado de orden
- [ ] Sistema de cupones y descuentos
- [ ] Calificación y reseñas de pizzas
- [ ] Programa de fidelidad
- [ ] Chat de soporte

## 👥 Roles de Usuario

### Crear Usuario Administrador

En Firestore, después de registrar un usuario, actualizar su documento en la colección `users`:

```json
{
  "uid": "user-id",
  "email": "admin@makepizza.com",
  "displayName": "Admin",
  "role": "admin"
}
```

## 🐛 Desarrollo y Testing

- Usar datos mock para desarrollo sin APIs reales
- `WeatherService.getMockWeatherData()` para clima simulado
- `PaymentService.createMockPayment()` para pagos de prueba

## 📄 Licencia

Proyecto académico - Desarrollo de aplicaciones móviles con Ionic y Firebase
