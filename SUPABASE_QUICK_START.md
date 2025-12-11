# Guía Rápida: Configurar Supabase para NETCLOUD Dashboard

## ✅ Paso 1: Obtener Credenciales

1. Abre el dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. Copia estos valores:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public** (la clave pública)

## ✅ Paso 2: Actualizar Credenciales en el Proyecto

1. Abre el archivo: `src/core/supabase-init.js`
2. Reemplaza estas líneas:

```javascript
// ANTES:
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// DESPUÉS (con tus credenciales):
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

3. Guarda el archivo

## ✅ Paso 3: Crear Tablas en PostgreSQL

1. En Supabase, ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia y pega TODO este código:

```sql
-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
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

-- Crear tabla de ingresos
CREATE TABLE IF NOT EXISTS ingresos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clienteId TEXT,
  clienteNombre TEXT,
  montoUsd DECIMAL,
  fecha TIMESTAMP,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de documentos
CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  tipo TEXT,
  url TEXT,
  fecha TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de interacciones
CREATE TABLE IF NOT EXISTS interacciones (
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

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_ingresos_user_id ON ingresos(user_id);
CREATE INDEX IF NOT EXISTS idx_documentos_user_id ON documentos(user_id);
CREATE INDEX IF NOT EXISTS idx_interacciones_user_id ON interacciones(user_id);

-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacciones ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para clientes
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

-- Crear políticas de seguridad para ingresos
CREATE POLICY "Usuarios ven sus propios ingresos"
  ON ingresos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios crean sus propios ingresos"
  ON ingresos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan sus propios ingresos"
  ON ingresos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios eliminan sus propios ingresos"
  ON ingresos FOR DELETE
  USING (auth.uid() = user_id);

-- Crear políticas de seguridad para documentos
CREATE POLICY "Usuarios ven sus propios documentos"
  ON documentos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios crean sus propios documentos"
  ON documentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan sus propios documentos"
  ON documentos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios eliminan sus propios documentos"
  ON documentos FOR DELETE
  USING (auth.uid() = user_id);

-- Crear políticas de seguridad para interacciones
CREATE POLICY "Usuarios ven sus propias interacciones"
  ON interacciones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios crean sus propias interacciones"
  ON interacciones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan sus propias interacciones"
  ON interacciones FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios eliminan sus propias interacciones"
  ON interacciones FOR DELETE
  USING (auth.uid() = user_id);
```

4. Haz clic en **Run** (botón azul)
5. Espera a que se ejecute (debe decir "Success")

## ✅ Paso 4: Configurar Autenticación

1. En Supabase, ve a **Authentication → Providers**
2. Asegúrate de que **Email** esté habilitado
3. Ve a **Authentication → URL Configuration**
4. En **Redirect URLs**, agrega:
   - `http://localhost:8000/index.html`
   - `https://uppromtingdate-cloud.github.io/NETCLOUD-EMP/index.html`

## ✅ Paso 5: Crear Usuarios de Prueba

1. Ve a **Authentication → Users**
2. Haz clic en **Add user**
3. Crea dos usuarios:

**Usuario 1:**
- Email: `michael@netcloud.com`
- Password: `M100%NETCLOUD`

**Usuario 2:**
- Email: `lermit@netcloud.com`
- Password: `L100%NETCLOUD`

## ✅ Paso 6: Verificar Conexión

1. Abre tu navegador en: `http://localhost:8000/login.html`
2. Intenta iniciar sesión con:
   - Email: `michael@netcloud.com`
   - Password: `M100%NETCLOUD`
3. Si funciona, ¡Supabase está configurado correctamente!

## 🔍 Verificar que Todo Funcione

Después de iniciar sesión:
1. Abre la consola del navegador (F12)
2. Deberías ver mensajes de conexión exitosa
3. Los datos se guardarán en Supabase en lugar de localStorage

## 🆘 Problemas Comunes

### Error: "Cannot find module '@supabase/supabase-js'"
- Asegúrate de que el CDN está disponible
- Verifica tu conexión a internet

### Error: "Invalid API key"
- Verifica que copiaste correctamente la anon key
- Asegúrate de no incluir espacios en blanco

### Error: "User not found"
- Verifica que creaste los usuarios en Supabase
- Usa las credenciales exactas

### Error: "Permission denied"
- Las políticas RLS no se crearon correctamente
- Ejecuta nuevamente el script SQL

## 📝 Próximos Pasos

1. ✅ Obtener credenciales
2. ✅ Actualizar supabase-init.js
3. ✅ Crear tablas
4. ✅ Configurar RLS
5. ✅ Crear usuarios
6. ✅ Probar conexión
7. → Migrar datos de localStorage a Supabase (opcional)

---

**¿Necesitas ayuda?** Cuéntame en qué paso estás y qué error ves (si hay alguno).
