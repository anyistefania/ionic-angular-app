# Configuración de Firebase para MakePizza App

## 🔐 1. Reglas de Seguridad de Firestore

### Opción A: Reglas para Desarrollo (Más Permisivas)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // TEMPORAL - Solo para desarrollo y testing
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

**⚠️ Advertencia:** Estas reglas permiten acceso total. Solo úsalas para desarrollo.

### Opción B: Reglas de Producción (Recomendado)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuarios: solo pueden leer/escribir su propio documento
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Pizzas: todos pueden leer, solo admins pueden escribir
    match /pizzas/{pizzaId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Ingredientes: todos pueden leer, solo admins pueden escribir
    match /ingredients/{ingredientId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Bebidas: todos pueden leer, solo admins pueden escribir
    match /drinks/{drinkId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Órdenes: usuarios pueden leer sus propias órdenes
    match /orders/{orderId} {
      allow read: if request.auth != null &&
                    (resource.data.userId == request.auth.uid ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null &&
                      (resource.data.userId == request.auth.uid ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Configuración de tienda: solo lectura para todos, escritura para admins
    match /storeConfig/{configId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Cómo Aplicar las Reglas

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto **"program-movil"**
3. En el menú lateral, haz clic en **"Firestore Database"**
4. Haz clic en la pestaña **"Reglas"**
5. Copia y pega las reglas que elijas
6. Haz clic en **"Publicar"**

---

## 📊 2. Índices Compuestos (Opcional - Para Optimización)

**Nota:** La aplicación actual NO requiere estos índices porque usa ordenamiento en el cliente. Solo créalos si quieres optimizar el rendimiento.

### Método 1: Usando el Enlace del Error (Más Fácil)

Cuando veas un error como:
```
ERROR FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

1. **Copia el enlace completo** del error
2. **Pégalo en tu navegador**
3. Firebase te mostrará exactamente el índice que necesitas
4. Haz clic en **"Crear índice"**
5. Espera 1-2 minutos mientras se construye

### Método 2: Crear Manualmente en Firebase Console

#### Índice para Ingredients

**Colección:** `ingredients`

| Campo | Orden |
|-------|-------|
| available | Ascendente |
| category | Ascendente |
| name | Ascendente |

**Pasos:**
1. Ve a Firebase Console → Firestore Database
2. Haz clic en la pestaña **"Índices"**
3. Haz clic en **"Crear índice"** (o **"Add Index"**)
4. Selecciona la colección: `ingredients`
5. Agrega campos en este orden:
   - Campo: `available`, Orden: **Ascendente**
   - Campo: `category`, Orden: **Ascendente**
   - Campo: `name`, Orden: **Ascendente**
6. Haz clic en **"Crear"**

#### Índice para Pizzas

**Colección:** `pizzas`

| Campo | Orden |
|-------|-------|
| available | Ascendente |
| name | Ascendente |

#### Índice para Drinks

**Colección:** `drinks`

| Campo | Orden |
|-------|-------|
| available | Ascendente |
| name | Ascendente |

#### Índice para Orders

**Colección:** `orders`

| Campo | Orden |
|-------|-------|
| userId | Ascendente |
| createdAt | Descendente |

---

## 🚀 3. Inicialización de Datos

### Paso 1: Registrar Usuario Admin

1. Ejecuta la aplicación: `ionic serve`
2. Ve a la página de **Registro**
3. Crea un usuario con:
   - Email: `admin@makepizza.com`
   - Password: (tu elección)
   - Nombre: `Admin MakePizza`

### Paso 2: Asignar Rol de Admin Manualmente

1. Ve a Firebase Console → Firestore Database
2. Busca la colección **"users"**
3. Encuentra el documento del usuario que acabas de crear
4. Haz clic en el documento
5. Busca el campo **"role"**
6. Cámbialo de `"user"` a `"admin"`
7. Guarda los cambios

### Paso 3: Inicializar Datos de la App

1. Inicia sesión con el usuario admin
2. Ve a la página **Admin** (debería aparecer en el menú)
3. Busca el botón **"Inicializar Datos"** o ejecuta `DataInitService`
4. Esto creará:
   - ✅ Pizzas predefinidas
   - ✅ Ingredientes (bases, quesos, salsas, toppings)
   - ✅ Bebidas
   - ✅ Configuración de tienda

---

## 🔑 4. Configuración de Autenticación

### Habilitar Email/Password

1. Ve a Firebase Console → **Authentication**
2. Haz clic en la pestaña **"Sign-in method"**
3. Haz clic en **"Email/Password"**
4. **Activa** el primer switch (Email/Password)
5. (Opcional) Activa "Email link" si quieres login sin contraseña
6. Haz clic en **"Guardar"**

---

## ⚙️ 5. Variables de Entorno

Asegúrate de que tu archivo `src/environments/environment.ts` tenga la configuración correcta:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "program-movil.firebaseapp.com",
    projectId: "program-movil",
    storageBucket: "program-movil.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
  },
  // APIs externas
  googleMapsApiKey: "TU_GOOGLE_MAPS_KEY",
  weatherApiKey: "TU_OPENWEATHER_KEY"
};
```

---

## 🎯 Checklist de Configuración

- [ ] Reglas de Firestore configuradas
- [ ] Autenticación Email/Password habilitada
- [ ] Usuario admin creado
- [ ] Rol de admin asignado manualmente
- [ ] Datos iniciales cargados
- [ ] Variables de entorno configuradas
- [ ] (Opcional) Índices creados

---

## ❓ Solución de Problemas

### Error: "Missing or insufficient permissions"
- ✅ **Solución:** Configura las reglas de seguridad (ver sección 1)

### Error: "The query requires an index"
- ✅ **Solución Rápida:** Ya está resuelto - la app ordena en el cliente
- ✅ **Solución Avanzada:** Crea índices compuestos (ver sección 2)

### Error: "No user found" o "Cannot read property of null"
- ✅ **Solución:** Asegúrate de estar autenticado
- ✅ **Solución:** Verifica que el usuario exista en Firestore collection `users`

### La app no carga datos
- ✅ **Solución:** Ejecuta DataInitService desde la página Admin
- ✅ **Solución:** Verifica las reglas de Firestore permitan lectura

---

## 📞 Recursos Adicionales

- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Reglas de Seguridad](https://firebase.google.com/docs/firestore/security/get-started)
- [Índices en Firestore](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

**Última actualización:** 2025-11-10
