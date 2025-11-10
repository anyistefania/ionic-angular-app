# 🚨 Solución Error 400: Firestore Bad Request

## ❌ Error que estás viendo:

```
GET https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen/channel
net::ERR_ABORTED 400 (Bad Request)
```

## ✅ Causa del Error

Este error ocurre porque **Firestore Database NO está habilitado o creado** en tu proyecto de Firebase.

---

## 📋 SOLUCIÓN PASO A PASO

### PASO 1: Ir a Firebase Console

1. Abre tu navegador
2. Ve a: https://console.firebase.google.com
3. Inicia sesión con tu cuenta de Google
4. Selecciona el proyecto **"program-movil"**

### PASO 2: Habilitar Firestore Database

#### Opción A: Si ves "Firestore Database" en el menú

```
Menú Lateral:
┌─────────────────────┐
│ 🔨 Compilación      │
│   ├─ Authentication │
│   ├─ Firestore DB  │ ← Haz clic aquí
│   ├─ Realtime DB   │
│   ├─ Storage       │
└─────────────────────┘
```

#### Opción B: Si NO ves "Firestore Database"

Puede aparecer como **"Cloud Firestore"** o necesitar crearse por primera vez.

### PASO 3: Crear/Habilitar Firestore

Verás una de estas pantallas:

#### Caso A: Firestore NO Creado

```
┌──────────────────────────────────────┐
│  Cloud Firestore                     │
│                                      │
│  Almacena y sincroniza datos        │
│  para tus apps.                     │
│                                      │
│     [Crear base de datos]  ←────── Haz clic aquí
│                                      │
└──────────────────────────────────────┘
```

1. Haz clic en **"Crear base de datos"**

2. Te preguntará el modo:
```
┌──────────────────────────────────────┐
│ ¿En qué modo deseas iniciar?         │
│                                      │
│ ⦿ Modo de producción                │
│   (seguro - requiere reglas)        │
│                                      │
│ ○ Modo de prueba                    │
│   (abierto - solo 30 días)          │ ← Selecciona este
│                                      │
│     [Cancelar]  [Siguiente] ←────── │
└──────────────────────────────────────┘
```

**Recomendación:** Selecciona **"Modo de prueba"** por ahora

3. Selecciona ubicación:
```
┌──────────────────────────────────────┐
│ Ubicación de Cloud Firestore         │
│                                      │
│ [us-central (Iowa)        ▼] ←────── Selecciona una región
│                                      │
│ ⚠️ No podrás cambiar esto después   │
│                                      │
│     [Cancelar]  [Habilitar] ←────── │
└──────────────────────────────────────┘
```

**Recomendación:** Selecciona `us-east1` o `southamerica-east1` (São Paulo)

4. Espera 1-2 minutos mientras se crea la base de datos

#### Caso B: Firestore Ya Creado pero Deshabilitado

Si ves que Firestore existe pero está deshabilitado, busca un botón para habilitarlo.

### PASO 4: Configurar Reglas de Seguridad

Una vez creado Firestore, verás las colecciones vacías. Ahora configura las reglas:

1. Haz clic en la pestaña **"Reglas"**

2. Reemplaza el contenido con estas reglas temporales:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

3. Haz clic en **"Publicar"**

### PASO 5: Verificar que Funcionó

1. Regresa a tu aplicación
2. Recarga la página (F5 o Ctrl+R)
3. El error 400 debería desaparecer

---

## 🔍 Verificación Adicional

Si el error persiste después de crear Firestore:

### Verificar que el Proyecto es Correcto

En `src/environments/environment.ts`, verifica que el `projectId` coincida:

```typescript
firebaseConfig: {
  projectId: "program-movil",  ← Debe coincidir con tu proyecto
  // ...
}
```

En Firebase Console, verifica el ID del proyecto:
- Configuración del proyecto (⚙️ ícono) → ID del proyecto

### Limpiar Caché del Navegador

1. Abre DevTools (F12)
2. Clic derecho en el botón de recargar
3. Selecciona **"Vaciar caché y recargar de forma forzada"**

### Revisar Console de Firebase

En Firebase Console → Firestore Database → Datos:
- Deberías ver una pantalla para agregar colecciones
- NO debería decir "Base de datos no creada"

---

## 📸 Capturas de Referencia

### Cómo se ve Firestore HABILITADO:

```
┌──────────────────────────────────────┐
│ Firestore Database                   │
│ ┌────┬───────┬──────────┬─────┐     │
│ │Datos│Reglas │ Índices  │ Uso │     │
│ └────┴───────┴──────────┴─────┘     │
│                                      │
│ Colecciones de nivel raíz           │
│ ┌──────────────────────────────┐    │
│ │ Agregar colección            │    │
│ │                              │    │
│ │ (Sin colecciones aún)        │    │
│ └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

### Cómo se ve Firestore NO HABILITADO:

```
┌──────────────────────────────────────┐
│ Cloud Firestore                      │
│                                      │
│ ⚠️ Base de datos no creada          │
│                                      │
│     [Crear base de datos]            │
│                                      │
└──────────────────────────────────────┘
```

---

## ✅ Checklist Final

Después de completar estos pasos:

- [ ] Firestore está creado en Firebase Console
- [ ] Puedes ver la pestaña "Datos" en Firestore Database
- [ ] Las reglas de seguridad están publicadas
- [ ] Recargaste la aplicación (Ctrl+R)
- [ ] El error 400 desapareció

---

## 🆘 Si el Error Persiste

### Otros Errores Comunes y Soluciones

**Error: "Firebase: Error (auth/configuration-not-found)"**
→ Authentication no está habilitado
→ Ve a Authentication → Sign-in method → Habilita Email/Password

**Error: "Missing or insufficient permissions"**
→ Las reglas de Firestore están bloqueando
→ Usa las reglas del PASO 4

**Error: "Firebase App named '[DEFAULT]' already exists"**
→ Firebase se está inicializando dos veces
→ Verifica que solo esté en app.module.ts

**Error de CORS**
→ Verifica que `authDomain` en environment.ts sea correcto
→ Debe ser: `program-movil.firebaseapp.com`

---

## 📞 Recursos

- [Comenzar con Firestore](https://firebase.google.com/docs/firestore/quickstart)
- [Reglas de Seguridad](https://firebase.google.com/docs/firestore/security/get-started)
- [Solución de Problemas](https://firebase.google.com/docs/firestore/troubleshooting)

---

**Nota Importante:** El error 400 casi siempre significa que Firestore no está creado/habilitado. Este es el primer paso crítico antes de poder usar cualquier funcionalidad de Firestore.
