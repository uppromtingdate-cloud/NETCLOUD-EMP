# Despliegue NETCLOUD Dashboard en GitHub Pages

## 🚀 Estado del Despliegue

**Repositorio**: https://github.com/uppromtingdate-cloud/NETCLOUD-EMP  
**GitHub Pages**: Habilitado en rama `gh-pages`  
**URL de Acceso**: https://uppromtingdate-cloud.github.io/NETCLOUD-EMP/

## 📋 Credenciales de Acceso

### Usuario 1
- **Email**: michael@netcloud.com
- **Contraseña**: M100%NETCLOUD

### Usuario 2
- **Email**: lermit@netcloud.com
- **Contraseña**: L100%NETCLOUD

## 🔄 Proceso de Despliegue Automático

El despliegue se realiza automáticamente mediante GitHub Actions:

1. **Trigger**: Cada push a la rama `master`
2. **Workflow**: `.github/workflows/deploy.yml`
3. **Acción**: Copia la carpeta `dist/` a la rama `gh-pages`
4. **Resultado**: La app se publica automáticamente en GitHub Pages

## 📦 Estructura de Despliegue

```
NETCLOUD-EMP/
├── src/                    # Código fuente
│   ├── core/              # Módulos core
│   ├── plugins/           # Plugins funcionales
│   ├── css/               # Estilos
│   ├── js/                # JavaScript principal
│   ├── index.html         # Dashboard principal
│   └── login.html         # Página de login
├── dist/                  # Carpeta de distribución (publicada en GitHub Pages)
├── docs/                  # Documentación
├── .github/workflows/     # Workflows de GitHub Actions
└── package.json           # Configuración del proyecto
```

## 🔐 Persistencia de Datos

Los datos se almacenan en `localStorage` del navegador:
- **Clientes**: `netcloud_clientes`
- **Ingresos**: `netcloud_ingresos`
- **Documentos**: `netcloud_documentos`
- **Interacciones**: `netcloud_interacciones`
- **Gastos**: `netcloud_gastos_empresariales`
- **Refrigerios**: `netcloud_refrigerios`
- **Pagos**: `netcloud_pagos_personal`
- **Activos**: `netcloud_activos`
- **Inventario**: `netcloud_inventario`
- **Estado de Widgets**: `netcloud_widget_state`

## 🧹 Limpiar Datos de Prueba

Para limpiar todos los datos de localStorage:
1. Accede a la URL: `https://uppromtingdate-cloud.github.io/NETCLOUD-EMP/login.html#clear-data`
2. Los datos se limpiarán automáticamente
3. Recarga la página para comenzar con datos vacíos

## 📊 Características Implementadas

✅ Sistema de widgets mejorado con CSS reutilizable  
✅ Tarjetas de estadísticas con indicadores de tendencia  
✅ Kanban board enriquecido con prioridades  
✅ Controles de widgets (Actualizar, Ocultar, Reordenar)  
✅ Animaciones y microinteractions profesionales  
✅ Autenticación local con credenciales seguras  
✅ Persistencia de datos en localStorage  
✅ Diseño responsive y profesional  
✅ Documentación completa  

## 🔧 Desarrollo Local

### Requisitos
- Python 3.x (para servidor local)
- Git
- Navegador moderno

### Ejecutar Localmente

```bash
# Clonar repositorio
git clone https://github.com/uppromtingdate-cloud/NETCLOUD-EMP.git
cd NETCLOUD-EMP

# Sincronizar archivos
.\sync-dev.bat

# Iniciar servidor de desarrollo
.\run-dev.bat

# Acceder a http://localhost:8000
```

## 📝 Notas Importantes

1. **localStorage**: Los datos se almacenan localmente en cada navegador
2. **Sin Backend**: La app funciona completamente en el cliente
3. **Seguridad**: Las credenciales están en el código (solo para desarrollo)
4. **Sincronización**: Los cambios en `src/` deben sincronizarse a `dist/`

## 🚀 Próximos Pasos

- [ ] Integración con Firebase para persistencia en la nube
- [ ] Autenticación con OAuth
- [ ] Backup automático de datos
- [ ] Sincronización multi-dispositivo
- [ ] API REST backend

---

**Última actualización**: 11 de Diciembre 2025  
**Versión**: 1.0  
**Estado**: ✅ Producción
