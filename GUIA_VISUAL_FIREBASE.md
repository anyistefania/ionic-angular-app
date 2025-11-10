# 📸 Guía Visual: Configurar Firebase Console

## 🔐 PARTE 1: Configurar Reglas de Seguridad

### Paso 1: Acceder a Firebase Console
```
1. Abre tu navegador
2. Ve a: https://console.firebase.google.com
3. Inicia sesión con tu cuenta de Google
```

### Paso 2: Seleccionar Proyecto
```
┌─────────────────────────────────────┐
│  Mis Proyectos                      │
│  ┌───────────────┐                  │
│  │ program-movil │  ← Haz clic aquí│
│  └───────────────┘                  │
└─────────────────────────────────────┘
```

### Paso 3: Ir a Firestore Database
```
Menú Lateral:
┌─────────────────────┐
│ ≡  Firebase         │
│                     │
│ 🏠 Descripción      │
│ 📊 Analytics        │
│ 🔨 Compilación      │
│   ├─ Authentication │
│   ├─ Firestore DB  │ ← Haz clic aquí
│   ├─ Storage       │
│   └─ Hosting       │
└─────────────────────┘
```

### Paso 4: Abrir Pestaña de Reglas
```
Pestañas en la parte superior:
┌──────┬───────┬──────────┬─────┐
│ Datos│ Reglas│ Índices  │ Uso │
│      │   ↑   │          │     │
└──────┴───┴───┴──────────┴─────┘
         Haz clic aquí
```

### Paso 5: Pegar las Reglas
```
┌─────────────────────────────────────────┐
│ Reglas de Firestore Database           │
│ ┌─────────────────────────────────────┐ │
│ │ rules_version = '2';                │ │
│ │ service cloud.firestore {           │ │
│ │   match /databases/{database}/doc { │ │
│ │     match /{document=**} {          │ │
│ │       allow read, write: if ...     │ │ ← Pega aquí
│ │     }                               │ │
│ │   }                                 │ │
│ │ }                                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancelar]              [Publicar] ←── Haz clic aquí
└─────────────────────────────────────────┘
```

**Reglas para copiar (DESARROLLO):**
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

---

## 📊 PARTE 2: Crear Índices Compuestos

### Método A: Usando el Enlace del Error (MÁS FÁCIL)

Cuando veas este error en la consola:
```
ERROR FirebaseError: The query requires an index.
You can create it here: https://console.firebase.google.com/v1/r/project/...
```

**¡Simplemente haz clic en el enlace!** Firebase hará todo por ti.

```
1. Copia el enlace completo del error
2. Pégalo en tu navegador
3. Verás esta pantalla:

┌────────────────────────────────────────┐
│ Crear nuevo índice                     │
│                                        │
│ Colección: ingredients                 │
│                                        │
│ Campos indexados:                      │
│ ✓ available    [Ascendente ▼]         │
│ ✓ category     [Ascendente ▼]         │
│ ✓ name         [Ascendente ▼]         │
│                                        │
│          [Cancelar]  [Crear índice]    │
│                           ↑            │
└────────────────────────────────────────┘
                       Haz clic aquí

4. Espera 1-2 minutos mientras se crea
```

### Método B: Crear Manualmente

#### Paso 1: Ir a la Pestaña Índices
```
┌──────┬───────┬──────────┬─────┐
│ Datos│ Reglas│ Índices  │ Uso │
│      │       │    ↑     │     │
└──────┴───────┴────┴─────┴─────┘
              Haz clic aquí
```

#### Paso 2: Crear Índice Compuesto
```
┌────────────────────────────────────┐
│ Índices compuestos                 │
│                                    │
│ [+ Crear índice] ←── Haz clic aquí│
└────────────────────────────────────┘
```

#### Paso 3: Llenar el Formulario

**Para el índice de INGREDIENTS:**

```
┌────────────────────────────────────────────┐
│ Crear nuevo índice compuesto              │
│                                            │
│ Colección:                                 │
│ [ingredients        ▼] ←── Escribe aquí   │
│                                            │
│ Campos que se van a indexar:               │
│ ┌────────────────────────────────────┐    │
│ │ + Agregar campo                    │    │
│ │                                    │    │
│ │ Campo 1:                           │    │
│ │ [available     ▼] [Ascendente ▼]  │    │
│ │                                    │    │
│ │ Campo 2:                           │    │
│ │ [category      ▼] [Ascendente ▼]  │    │
│ │                                    │    │
│ │ Campo 3:                           │    │
│ │ [name          ▼] [Ascendente ▼]  │    │
│ └────────────────────────────────────┘    │
│                                            │
│ Estado de consulta:                        │
│ ⦿ Habilitado                              │
│ ○ Inhabilitado                            │
│                                            │
│       [Cancelar]        [Crear] ←──────── │
└────────────────────────────────────────────┘
                         Haz clic aquí
```

#### Paso 4: Verificar que se Creó
```
Verás el índice en construcción:

┌──────────────────────────────────────────┐
│ Índices compuestos                       │
│ ┌──────────────────────────────────────┐ │
│ │ ingredients                          │ │
│ │ available ↑ category ↑ name ↑       │ │
│ │ Estado: 🔄 Creando... (1 min)       │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘

Cuando esté listo:

┌──────────────────────────────────────────┐
│ Índices compuestos                       │
│ ┌──────────────────────────────────────┐ │
│ │ ingredients                          │ │
│ │ available ↑ category ↑ name ↑       │ │
│ │ Estado: ✓ Habilitado                │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 🔑 PARTE 3: Habilitar Autenticación

### Paso 1: Ir a Authentication
```
Menú Lateral:
┌─────────────────────┐
│ 🔨 Compilación      │
│   ├─ Authentication │ ← Haz clic aquí
│   ├─ Firestore DB  │
│   ├─ Storage       │
└─────────────────────┘
```

### Paso 2: Configurar Método de Inicio de Sesión
```
┌────────────────────────────────────────┐
│ Sign-in method (Método de inicio)     │
│                                        │
│ Proveedores:                          │
│ ┌────────────────────────────────┐   │
│ │ Email/Password    Estado: ⚪ OFF│   │ ← Haz clic aquí
│ │ Google            Estado: ⚪ OFF│   │
│ │ Facebook          Estado: ⚪ OFF│   │
│ └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### Paso 3: Activar Email/Password
```
┌────────────────────────────────────────┐
│ Email/Password                         │
│                                        │
│ Habilitar                              │
│ [🔘 Activado] ←── Activa este switch │
│                                        │
│ Vínculo de email (sin contraseña)     │
│ [⚪ Desactivado] (opcional)           │
│                                        │
│              [Cancelar]  [Guardar] ←─ │
└────────────────────────────────────────┘
                        Haz clic aquí
```

---

## 👤 PARTE 4: Crear Usuario Admin

### Paso 1: Registrarse en la App
```
1. Ejecuta: ionic serve
2. Abre la app en el navegador: http://localhost:8100
3. Ve a la página de Registro
4. Llena el formulario:
   ┌─────────────────────────┐
   │ Nombre: Admin MakePizza │
   │ Email: admin@makepizza.com
   │ Password: ********      │
   │ Confirmar: ********     │
   │ [Registrarse]           │
   └─────────────────────────┘
```

### Paso 2: Asignar Rol Admin en Firestore

```
1. Ve a Firebase Console → Firestore Database
2. Haz clic en la pestaña "Datos"

┌──────────────────────────────────────────┐
│ Colecciones                              │
│ ┌──────────────┐                         │
│ │ users ────── │ ← Haz clic aquí         │
│ │ pizzas       │                         │
│ │ orders       │                         │
│ └──────────────┘                         │
└──────────────────────────────────────────┘

3. Verás los documentos de usuarios:

┌──────────────────────────────────────────┐
│ users                                    │
│ ┌──────────────────────────────────────┐ │
│ │ 📄 Abc123XyZ... ← Haz clic          │ │
│ │    email: admin@makepizza.com       │ │
│ │    displayName: Admin MakePizza     │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘

4. Se abrirá el documento. Busca el campo "role":

┌──────────────────────────────────────────┐
│ Campo          │ Tipo   │ Valor          │
├────────────────┼────────┼────────────────┤
│ displayName    │ string │ Admin MakePizza│
│ email          │ string │ admin@make...  │
│ role           │ string │ user ←────────── Haz clic aquí
│ uid            │ string │ Abc123...      │
└──────────────────────────────────────────┘

5. Cambia "user" a "admin":

┌────────────────────────────┐
│ Editar campo               │
│                            │
│ Campo: role                │
│ Tipo: string               │
│ Valor: [admin]             │ ← Escribe "admin"
│                            │
│  [Cancelar]  [Actualizar] │
└────────────────────────────┘
                  ↑
           Haz clic aquí
```

---

## 🎯 RESUMEN RÁPIDO

### Checklist de Configuración:

```
✅ PASO 1: Reglas de Firestore
   └─ Firebase Console → Firestore → Reglas → Pegar → Publicar

✅ PASO 2: Autenticación
   └─ Firebase Console → Authentication → Sign-in method
      → Email/Password → Activar → Guardar

✅ PASO 3: Crear usuario admin
   └─ App → Registro → Crear cuenta

✅ PASO 4: Asignar rol admin
   └─ Firebase Console → Firestore → users → [documento]
      → Cambiar role de "user" a "admin"

✅ PASO 5: Inicializar datos
   └─ App → Login como admin → Ir a página Admin
      → Botón "Inicializar Datos"

⚠️  PASO 6: Índices (OPCIONAL - solo si usas queries optimizadas)
   └─ Hacer clic en el enlace del error O
      Firebase Console → Firestore → Índices → Crear
```

---

## 🆘 Troubleshooting Visual

### Error: "Missing or insufficient permissions"
```
❌ Lo que ves:
┌────────────────────────────────────┐
│ Error                              │
│ Missing or insufficient permissions│
└────────────────────────────────────┘

✅ Solución:
→ Ve a Firestore → Reglas
→ Verifica que las reglas estén publicadas
→ Si están vacías, copia las reglas del FIREBASE_SETUP.md
```

### Error: "The query requires an index"
```
❌ Lo que ves:
┌─────────────────────────────────────────┐
│ Error: The query requires an index.    │
│ You can create it here: https://...    │
│         ↑                               │
│    Copia este enlace                    │
└─────────────────────────────────────────┘

✅ Solución RÁPIDA:
→ Copia el enlace completo
→ Pégalo en tu navegador
→ Haz clic en "Crear índice"
→ Espera 1-2 minutos

✅ Solución ALTERNATIVA:
→ Ya está resuelto en el código
→ La app ahora ordena en el cliente
→ NO necesitas crear índices
```

---

**💡 Consejo:** Guarda este documento para futuras referencias.
