# Estructura del Proyecto NETCLOUD

## 📁 Visión General de la Estructura

```
NETCLOUD EMP/
├── dist/                      # Versión compilada para producción
│   ├── core/                  # Módulos core compilados
│   ├── css/                   # Estilos compilados
│   ├── js/                    # Scripts compilados
│   ├── plugins/               # Plugins compilados
│   ├── index.html             # Dashboard principal
│   └── login.html             # Página de autenticación
│
├── docs/                      # Documentación del proyecto
│   ├── ARQUITECTURA.md        # Documentación de arquitectura
│   ├── COLORES.md             # Guía de colores y estilos
│   ├── ESTRUCTURA.md          # Este archivo
│   ├── MIGRACION.md           # Guía de migración
│   └── README.md              # Documentación principal
│
├── src/                       # Código fuente
│   ├── core/                  # Módulos centrales
│   │   ├── auth.js            # Autenticación local
│   │   ├── firebase-init.js   # Configuración de Firebase (opcional)
│   │   └── users.js           # Gestión de usuarios
│   │
│   ├── css/                   # Hojas de estilo
│   │   └── styles.css         # Estilos principales
│   │
│   ├── js/                    # Scripts principales
│   │   └── main.js            # Punto de entrada de la aplicación
│   │
│   ├── plugins/               # Módulos funcionales
│   │   ├── crm/               # Gestión de clientes
│   │   ├── dashboard/         # Panel de control
│   │   ├── documentos/        # Gestión documental
│   │   └── finanzas/          # Gestión financiera
│   │
│   ├── index.html             # Dashboard principal
│   └── login.html             # Página de autenticación
│
└── tests/                     # Pruebas automatizadas
    └── structure-validation.js # Validación de estructura
```

## 📦 Módulos Principales

### 🔹 Core
- **auth.js**: Maneja la autenticación local del usuario
- **firebase-init.js**: Configuración de Firebase (actualmente deshabilitada)
- **users.js**: Gestión de usuarios y credenciales

### 🔹 Plugins
- **CRM**: Gestión de clientes y oportunidades de venta
- **Dashboard**: Panel de control con métricas clave
- **Documentos**: Gestión documental (requiere configuración)
- **Finanzas**: Gestión financiera (requiere configuración)

## 🛠️ Flujo de Desarrollo

1. **Edición**: Trabajar en archivos dentro de `src/`
2. **Sincronización**: Copiar cambios a `dist/` para pruebas
3. **Pruebas**: Ejecutar la aplicación desde `dist/`
4. **Despliegue**: Subir contenido de `dist/` a producción

## 🔄 Sincronización

Para sincronizar cambios desde `src/` a `dist/`:

```powershell
# Windows (PowerShell)
Copy-Item -Path "src/*" -Destination "dist" -Recurse -Force

# Usando el script proporcionado
.\sync-dev.bat
```

## 🧪 Pruebas

Ejecutar las pruebas de estructura:

```bash
node tests/structure-validation.js
```

## 📌 Notas Importantes

- La autenticación actual es local y utiliza `localStorage`
- Los módulos de Documentos y Finanzas requieren configuración adicional
- El proyecto está optimizado para GitHub Pages
- Se recomienda usar VS Code con extensiones para HTML, CSS y JavaScript

## 🚀 Próximos Pasos

1. Implementar autenticación con Firebase Auth
2. Habilitar módulo de Documentos con almacenamiento en la nube
3. Implementar funcionalidad completa del módulo de Finanzas
4. Añadir pruebas unitarias y de integración
5. Mejorar la documentación técnica

---
*Última actualización: Diciembre 2025*
