# Dashboard Administrativo - NETCLOUD

## Visión General

Dashboard administrativo modular para gestión empresarial que combina funcionalidades de CRM y gestión financiera en una interfaz intuitiva y moderna.

## Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **UI/UX**: Bootstrap 5, FontAwesome 6
- **Arquitectura**: Core + Plugins (Modular)
- **Autenticación**: Local (localStorage)
- **Compatibilidad**: Total con GitHub Pages

## Estructura del Proyecto

```
NETCLOUD EMP/
├── dist/            # Versión de producción (generada automáticamente)
├── docs/            # Documentación del proyecto
│   ├── ARQUITECTURA.md  # Documentación de arquitectura
│   ├── COLORES.md      # Guía de colores y estilos
│   ├── ESTRUCTURA.md   # Estructura detallada del proyecto
│   └── MIGRACION.md    # Guía de migración y actualizaciones
├── src/             # Código fuente
│   ├── core/        # Funcionalidades centrales
│   │   ├── auth.js           # Autenticación local
│   │   ├── firebase-init.js  # Configuración de Firebase (deshabilitada)
│   │   └── users.js          # Usuarios y credenciales
│   ├── css/         # Hojas de estilo
│   │   └── styles.css       # Estilos principales
│   ├── js/          # Scripts principales
│   │   └── main.js          # Inicialización y enrutamiento
│   ├── plugins/     # Módulos de la aplicación
│   │   ├── crm/            # Gestión de clientes
│   │   ├── documentos/     # Gestión documental
│   │   └── finanzas/       # Gestión financiera
│   ├── index.html   # Dashboard principal
│   └── login.html   # Página de autenticación
└── tests/           # Pruebas automatizadas
    └── structure-validation.js
```

## Empezando

### Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Python 3.x (para servidor de desarrollo)
- Editor de código (VS Code recomendado)

### Instalación Local

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd NETCLOUD-EMP
   ```

2. Sincroniza los archivos fuente con la carpeta de distribución:
   ```powershell
   # Windows (PowerShell)
   Copy-Item -Path "src/*" -Destination "dist" -Recurse -Force
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   # Navega a la carpeta dist
   cd dist
   
   # Inicia el servidor Python
   python -m http.server 8000
   ```

4. Abre tu navegador en:
   - Login: [http://localhost:8000/login.html](http://localhost:8000/login.html)
   - Dashboard: [http://localhost:8000/index.html](http://localhost:8000/index.html) (requiere autenticación)

### Credenciales de Prueba

- **Email**: netcloud@tecnología.com
- **Contraseña**: 100%NETCLOUD

## Autenticación

El sistema utiliza autenticación local basada en `localStorage` para mayor simplicidad y compatibilidad con GitHub Pages. Las credenciales están validadas en el lado del cliente.

### Flujo de Autenticación

1. El usuario ingresa sus credenciales en `login.html`
2. Las credenciales se validan localmente contra `src/core/auth.js`
3. Si son correctas, se guarda un token en `localStorage`
4. El token se verifica en cada carga de página
5. Si no hay token o es inválido, se redirige al login

## Módulos Disponibles

### Dashboard
- Resumen general de métricas clave
- Acceso rápido a funciones principales
- Vista de actividad reciente

### CRM (Totalmente Funcional)
- Gestión de clientes y contactos
- Tablero Kanban para seguimiento de oportunidades
- Historial de interacciones
- Búsqueda y filtrado avanzado

### Documentos (Configuración Requerida)
- Almacenamiento y organización de documentos
- Categorización y etiquetado
- Búsqueda de documentos

### Finanzas (Configuración Requerida)
- Gestión de facturas y pagos
- Informes financieros
- Análisis de ingresos y gastos

## Personalización

### Paleta de Colores
La paleta de colores corporativa está definida en `docs/COLORES.md` e incluye:

| Color | Código | Uso |
|-------|--------|-----|
| Azul Principal | `#413DDB` | Botones principales, encabezados |
| Azul Secundario | `#4C73DD` | Elementos secundarios |
| Morado | `#5734ED` | Acentos, enlaces |
| Azul Oscuro | `#284DC5` | Fondos, pies de página |

### Estilos
- `src/css/styles.css` contiene las variables CSS globales
- Los estilos están organizados por componentes
- Se utiliza el sistema de grid de Bootstrap para el diseño responsivo

## Desarrollo

### Estructura de Código
- **Core**: Contiene la lógica central de la aplicación
- **Plugins**: Módulos independientes que extienden la funcionalidad
- **CSS**: Estilos organizados por componentes

### Convenciones
- Nombres de variables y funciones en `camelCase`
- Clases CSS en `kebab-case`
- Archivos JavaScript en `PascalCase` para clases, `camelCase` para utilidades

### Scripts Útiles

```bash
# Sincronizar cambios (Windows PowerShell)
Copy-Item -Path "src/*" -Destination "dist" -Recurse -Force

# Iniciar servidor de desarrollo
cd dist
python -m http.server 8000

# Verificar estructura del proyecto
node tests/structure-validation.js
```

## Despliegue

El proyecto está configurado para desplegarse en GitHub Pages sin necesidad de configuración adicional. Simplemente sincroniza los cambios a la rama `gh-pages`.

## Próximas Mejoras

### High Priority
1. **Prueba de login en navegador**
   - Verificar que credenciales funcionan correctamente
   - Verificar localStorage se guarda correctamente
   - Verificar logout borra localStorage

2. **Testing Kanban CRM**
   - Verificar cards se muestran en columnas
   - Verificar timeline aparece al hacer click
   - Verificar datos se guardan en localStorage

### Medium Priority
3. **Persistencia de datos**
   - localStorage para clientes (CRM)
   - localStorage para documentos (meta)
   - localStorage para egresos (finanzas)

4. **Integración GitHub Pages**
   - Crear repositorio en GitHub
   - Configurar GitHub Pages
   - Push inicial

### Low Priority (Funcionalidad Futura)
5. **Firebase Firestore** (requiere backend)
   - Desplegar Cloud Function para validar credenciales
   - Configurar Firestore Rules para acceso seguro
   - Reemplazar localStorage por Firestore

6. **Firebase Storage** (requiere backend)
   - Habilitar carga de documentos
   - Sincronizar metadatos con Firestore

7. **Búsqueda/Paginación**
   - Agregar filtros a Kanban
   - Pagination para lista de clientes

8. **Depreciación de Activos**
   - Implementar cálculos en módulo finanzas
   - UI para gestión de activos

## Licencia

Proyecto base (sin licencia). Este repositorio es un esqueleto entregado como ayuda.

