# Arquitectura Core + Plugins - Dashboard Administrativo NETCLOUD

## 🏗️ Descripción General

El proyecto utiliza una arquitectura **Core + Plugins** para mayor modularidad, mantenibilidad y escalabilidad. El sistema está optimizado para ejecutarse sin dependencias de backend, utilizando autenticación local basada en `localStorage`.

## 📁 Estructura del Proyecto

```
NETCLOUD EMP/
├── src/                         # Código fuente
│   ├── core/                    # Núcleo de la aplicación
│   │   ├── auth.js              # Autenticación local (localStorage)
│   │   ├── firebase-init.js     # Configuración Firebase (opcional)
│   │   └── users.js             # Gestión de usuarios
│   │
│   ├── plugins/                 # Módulos funcionales independientes
│   │   ├── crm/                 # Gestión de Clientes
│   │   │   └── crm.js           # Kanban, clientes, interacciones
│   │   ├── documentos/          # Gestión Documental
│   │   │   └── documentos.js    # Almacenamiento y organización
│   │   ├── finanzas/            # Gestión Financiera
│   │   │   └── finanzas.js      # Facturas, ingresos, gastos
│   │   └── dashboard/           # Panel de Control
│   │       └── dashboard.js     # Métricas y resumen
│   │
│   ├── js/
│   │   └── main.js              # Orquestador principal
│   │
│   ├── css/
│   │   └── styles.css           # Estilos globales
│   │
│   ├── index.html               # Dashboard principal (SPA)
│   └── login.html               # Página de autenticación
│
├── dist/                        # Versión compilada (generada automáticamente)
├── docs/                        # Documentación
└── tests/                       # Pruebas
```

## 🔄 Flujo de Inicialización

### 1. Autenticación (login.html)
```
login.html → core/auth.js
  ├─ Valida credenciales locales
  ├─ Guarda token en localStorage
  └─ Redirige a index.html
```

### 2. Dashboard (index.html)
```
index.html → js/main.js
  ├─ Verifica autenticación en localStorage
  ├─ Inicializa navegación
  └─ Orquesta plugins
```

### 3. Plugins
```
js/main.js → plugins/
  ├─ plugins/crm/crm.js
  ├─ plugins/documentos/documentos.js
  ├─ plugins/finanzas/finanzas.js
  └─ plugins/dashboard/dashboard.js
```

## 🔐 Sistema de Autenticación

### Autenticación Local (Actual)

**Archivo**: `src/core/auth.js`

```javascript
// Credenciales de prueba
const VALID_EMAIL = 'netcloud@tecnología.com';
const VALID_PASSWORD = '100%NETCLOUD';

// Almacenamiento en localStorage
localStorage.setItem('netcloud_auth', JSON.stringify({
  email: email,
  token: 'token-' + Date.now()
}));
```

**Ventajas**:
- Compatible con GitHub Pages
- Sin dependencias externas
- Desarrollo rápido

**Limitaciones**:
- Solo para desarrollo/pruebas
- Credenciales en el código
- Sin persistencia de datos

### Migración a Firebase Auth (Futuro)

Para activar Firebase Auth:

1. Descomentar `src/core/firebase-init.js`
2. Actualizar `src/core/auth.js` para usar Firebase
3. Configurar reglas de seguridad en Firebase Console

## 📦 Módulos Principales

### Core

- **auth.js**: Maneja autenticación local
- **firebase-init.js**: Configuración de Firebase (deshabilitada)
- **users.js**: Gestión de usuarios

### Plugins

#### CRM (Totalmente Funcional)
- Gestión de clientes
- Tablero Kanban
- Historial de interacciones
- Búsqueda y filtrado

#### Dashboard (Funcional)
- Resumen de métricas
- Estadísticas clave
- Acceso rápido

#### Documentos (Requiere Configuración)
- Almacenamiento de archivos
- Categorización
- Búsqueda

#### Finanzas (Requiere Configuración)
- Gestión de facturas
- Análisis financiero
- Reportes

## 🔧 Cómo Agregar Nuevos Plugins

### Paso 1: Crear directorio del plugin
```
src/plugins/myplugin/
└── myplugin.js
```

### Paso 2: Implementar funciones exportables
```javascript
// src/plugins/myplugin/myplugin.js

export function setupMyPlugin() {
  // Lógica del plugin
  console.log('Plugin inicializado');
}

export function myPluginFunction() {
  // Funcionalidad del plugin
}
```

### Paso 3: Importar en `js/main.js`
```javascript
import { setupMyPlugin } from '../plugins/myplugin/myplugin.js';

function initializePlugins() {
  setupMyPlugin();
  // ... otros plugins
}
```

## 🎨 Paleta de Colores

Ver `docs/COLORES.md` para la documentación completa de colores y estilos.

**Colores principales**:
- Azul Principal: `#413DDB`
- Azul Secundario: `#4C73DD`
- Morado: `#5734ED`
- Azul Oscuro: `#284DC5`

## 🛠️ Desarrollo

### Estructura de Código

- **Modularidad**: Cada plugin es independiente
- **Reutilización**: Funciones compartidas en `core/`
- **Escalabilidad**: Fácil agregar nuevos plugins

### Convenciones

- Nombres en `camelCase` para variables y funciones
- Nombres en `kebab-case` para clases CSS
- Archivos en `PascalCase` para clases, `camelCase` para utilidades

### Debugging

Funciones accesibles desde la consola del navegador:

```javascript
// Verificar autenticación
localStorage.getItem('netcloud_auth')

// Limpiar sesión
localStorage.removeItem('netcloud_auth')
```

## 🚀 Próximos Pasos

- [ ] Implementar autenticación con Firebase Auth
- [ ] Agregar búsqueda y paginación de clientes
- [ ] Crear dashboard con métricas avanzadas
- [ ] Implementar sistema de reportes
- [ ] Integrar calendario/agenda
- [ ] Agregar pruebas unitarias

## 📝 Notas Importantes

- El proyecto está optimizado para GitHub Pages
- La autenticación local es solo para desarrollo
- Los módulos de Documentos y Finanzas requieren configuración adicional
- Se recomienda usar VS Code con extensiones para desarrollo

---
*Última actualización: Diciembre 2025*
