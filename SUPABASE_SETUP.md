# Configuración de Supabase para NETCLOUD Dashboard

## 🚀 Pasos de Configuración

### 1. Crear Cuenta en Supabase

1. Ir a https://supabase.com
2. Crear cuenta con GitHub o email
3. Crear nuevo proyecto
4. Seleccionar región más cercana
5. Guardar contraseña de base de datos

### 2. Obtener Credenciales

En el dashboard de Supabase:
1. Ir a Settings → API
2. Copiar `Project URL`
3. Copiar `anon public` key
4. Actualizar en `src/core/supabase-init.js`:

```javascript
const SUPABASE_URL = 'tu-url-aqui';
const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';
```

### 3. Crear Tablas en PostgreSQL

Ejecutar en SQL Editor de Supabase:

```sql
-- Tabla de clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  empresa TEXT,
  email TEXT,
  telefono TEXT,
  estadoVenta TEXT,
  monto DECIMAL,
  fechaPrimerContacto TIMESTAMP,
  paqueteServicios TEXT,
  costoPaquete DECIMAL,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ingresos
CREATE TABLE ingresos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clienteId TEXT,
  clienteNombre TEXT,
  montoUsd DECIMAL,
  fecha TIMESTAMP,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de documentos
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  tipo TEXT,
  url TEXT,
  fecha TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de interacciones
CREATE TABLE interacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clienteId TEXT,
  clienteNombre TEXT,
  tipo TEXT,
  descripcion TEXT,
  detalle TEXT,
  fecha TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_clientes_user_id ON clientes(user_id);
CREATE INDEX idx_ingresos_user_id ON ingresos(user_id);
CREATE INDEX idx_documentos_user_id ON documentos(user_id);
CREATE INDEX idx_interacciones_user_id ON interacciones(user_id);
```

### 4. Configurar Políticas de Seguridad (RLS)

En Supabase, habilitar Row Level Security (RLS) para cada tabla:

```sql
-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacciones ENABLE ROW LEVEL SECURITY;

-- Políticas para clientes
CREATE POLICY "Usuarios ven sus propios clientes"
  ON clientes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios crean sus propios clientes"
  ON clientes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan sus propios clientes"
  ON clientes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios eliminan sus propios clientes"
  ON clientes FOR DELETE
  USING (auth.uid() = user_id);

-- Aplicar políticas similares a otras tablas...
```

### 5. Configurar Autenticación

En Supabase Dashboard → Authentication:
1. Habilitar Email/Password
2. Configurar redirect URLs:
   - `http://localhost:8000/index.html`
   - `https://uppromtingdate-cloud.github.io/NETCLOUD-EMP/index.html`
3. Configurar SMTP si es necesario

### 6. Actualizar Frontend

Reemplazar importaciones en archivos:

```javascript
// Cambiar de:
import { getClientes, saveClientes } from '../core/storage-utils.js';

// A:
import { getClientes, saveClientes } from '../core/supabase-storage.js';
```

### 7. Actualizar Login

Modificar `src/login.html` para usar Supabase:

```javascript
import { signIn } from './core/supabase-init.js';

// En lugar de localStorage
const result = await signIn(email, password);
if (result.success) {
  window.location.href = 'index.html';
}
```

## 📊 Estructura de Datos

### Tabla: clientes
- `id` - UUID único
- `user_id` - Referencia al usuario
- `nombre` - Nombre del cliente
- `empresa` - Empresa del cliente
- `email` - Email de contacto
- `telefono` - Teléfono
- `estadoVenta` - Estado (Nuevo, Propuesta, Negociación, etc.)
- `monto` - Monto de la venta
- `fechaPrimerContacto` - Fecha de primer contacto
- `paqueteServicios` - Descripción de servicios
- `costoPaquete` - Costo del paquete
- `observaciones` - Notas adicionales

### Tabla: ingresos
- `id` - UUID único
- `user_id` - Referencia al usuario
- `clienteId` - ID del cliente
- `clienteNombre` - Nombre del cliente
- `montoUsd` - Monto en USD
- `fecha` - Fecha del ingreso
- `descripcion` - Descripción

### Tabla: documentos
- `id` - UUID único
- `user_id` - Referencia al usuario
- `nombre` - Nombre del documento
- `tipo` - Tipo de documento
- `url` - URL del archivo
- `fecha` - Fecha de carga

### Tabla: interacciones
- `id` - UUID único
- `user_id` - Referencia al usuario
- `clienteId` - ID del cliente
- `clienteNombre` - Nombre del cliente
- `tipo` - Tipo de interacción
- `descripcion` - Descripción
- `detalle` - Detalles adicionales
- `fecha` - Fecha de interacción

## 🔐 Seguridad

- ✅ RLS habilitado en todas las tablas
- ✅ Usuarios solo ven sus propios datos
- ✅ Autenticación con JWT
- ✅ Contraseñas hasheadas en Supabase
- ✅ HTTPS en producción

## 📝 Próximos Pasos

1. Crear cuenta en Supabase
2. Ejecutar scripts SQL
3. Configurar credenciales
4. Actualizar frontend
5. Probar autenticación
6. Migrar datos de localStorage

## 🆘 Troubleshooting

**Error: "Usuario no autenticado"**
- Verificar que el usuario está logueado
- Revisar token JWT en localStorage

**Error: "Permission denied"**
- Verificar RLS policies
- Asegurar que user_id coincide

**Error: "CORS"**
- Configurar CORS en Supabase Settings
- Agregar dominio a allowed origins

---

**Documentación oficial**: https://supabase.com/docs
