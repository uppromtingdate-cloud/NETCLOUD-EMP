# Guía de Testing - NETCLOUD

## 🧪 Testing Manual

### 1. Prueba de Autenticación

#### Requisitos
- Servidor corriendo en `http://localhost:8000`
- Navegador moderno (Chrome, Firefox, Edge, Safari)

#### Pasos
1. Abre `http://localhost:8000/login.html`
2. Ingresa las credenciales:
   - **Email**: `netcloud@tecnología.com`
   - **Contraseña**: `100%NETCLOUD`
3. Haz clic en "Iniciar Sesión"

#### Validaciones Esperadas
- ✅ Redirección a `index.html` (dashboard)
- ✅ Token guardado en `localStorage` (verificar en DevTools → Application → localStorage)
- ✅ Estructura del token: `{"email":"netcloud@tecnología.com","token":"token-XXXXXXXXX"}`

#### Prueba de Logout
1. Haz clic en el botón de logout (esquina superior derecha)
2. Verifica que se elimine el token de localStorage
3. Verifica redirección a login.html

---

### 2. Prueba del Módulo CRM

#### Requisitos
- Estar autenticado en el dashboard
- Navegar a la sección CRM

#### Pasos
1. Haz clic en "CRM" en el menú lateral
2. Verifica que aparezca el Kanban board con 5 columnas:
   - Nuevo
   - Propuesta enviada
   - Negociación
   - Cerrado-Perdido
   - Cerrado-Ganado

#### Validaciones Esperadas
- ✅ Kanban board se carga correctamente
- ✅ Cards de clientes aparecen en las columnas
- ✅ Click en card muestra timeline de interacciones
- ✅ Colores corresponden a la paleta NETCLOUD

#### Prueba de Persistencia
1. Agrega un cliente nuevo (si existe funcionalidad)
2. Recarga la página (F5)
3. Verifica que el cliente siga presente (datos en localStorage)

---

### 3. Prueba del Módulo Dashboard

#### Requisitos
- Estar autenticado

#### Pasos
1. Verifica que el dashboard principal cargue
2. Observa las métricas clave mostradas
3. Verifica acceso rápido a funciones principales

#### Validaciones Esperadas
- ✅ Dashboard carga sin errores
- ✅ Métricas se muestran correctamente
- ✅ Navegación a otros módulos funciona

---

### 4. Prueba de Responsividad

#### Dispositivos a Probar
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

#### Pasos
1. Abre DevTools (F12)
2. Activa modo responsive (Ctrl+Shift+M)
3. Prueba diferentes resoluciones
4. Verifica que la UI se adapte correctamente

#### Validaciones Esperadas
- ✅ Menú se adapta a pantallas pequeñas
- ✅ Cards y tablas son legibles
- ✅ Botones son clickeables en mobile
- ✅ No hay scroll horizontal innecesario

---

### 5. Prueba de Navegadores

#### Navegadores Soportados
- ✅ Chrome/Chromium (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Edge (v90+)

#### Pasos
1. Prueba login en cada navegador
2. Verifica que los estilos se apliquen correctamente
3. Verifica que no haya errores en consola

---

## 🤖 Testing Automatizado

### Validación de Estructura

```bash
node tests/structure-validation.js
```

**Qué valida**:
- Estructura de carpetas correcta
- Archivos críticos presentes
- Sintaxis JavaScript válida

**Resultado esperado**:
```
✓ Estructura validada correctamente
✓ Todos los archivos presentes
✓ Sin errores de sintaxis
```

---

## 🔍 Verificaciones en DevTools

### Console
```javascript
// Verificar autenticación
localStorage.getItem('netcloud_auth')

// Limpiar sesión (para testing)
localStorage.removeItem('netcloud_auth')

// Ver todos los datos almacenados
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key))
})
```

### Network
1. Abre DevTools → Network
2. Recarga la página
3. Verifica que todos los archivos carguen correctamente (status 200)
4. Verifica que no haya errores de CORS

### Storage
1. Abre DevTools → Application → Storage
2. Verifica localStorage contiene:
   - `netcloud_auth`: token de autenticación
   - `netcloud_clientes`: datos de CRM (si existen)
   - `netcloud_documentos`: metadatos de documentos (si existen)
   - `netcloud_egresos`: datos de finanzas (si existen)

---

## 📋 Checklist de Testing

- [ ] Login funciona con credenciales correctas
- [ ] Login rechaza credenciales incorrectas
- [ ] Logout borra token de localStorage
- [ ] Dashboard carga después de login
- [ ] CRM Kanban se muestra correctamente
- [ ] Cards de clientes aparecen en columnas
- [ ] Click en card muestra timeline
- [ ] Datos persisten en localStorage
- [ ] Responsividad en mobile/tablet/desktop
- [ ] Sin errores en consola
- [ ] Navegadores soportados funcionan
- [ ] Estructura validada correctamente

---

## 🐛 Debugging

### Habilitar Logs de Debug

En `src/js/main.js`, descomenta los console.log:

```javascript
console.log('Autenticación verificada:', auth);
console.log('Plugins inicializados:', plugins);
```

### Errores Comunes

**Error**: "Cannot find module 'X'"
- **Solución**: Verifica que el archivo existe en la ruta correcta
- **Verificar**: `ls -la src/path/to/file.js`

**Error**: "localStorage is not defined"
- **Solución**: Asegúrate de estar en un navegador (no en Node.js)
- **Verificar**: Ejecuta en DevTools console

**Error**: "Credenciales inválidas"
- **Solución**: Verifica que el email y password sean exactos
- **Credenciales**: `netcloud@tecnología.com` / `100%NETCLOUD`

---

## 📊 Métricas de Testing

| Métrica | Objetivo | Estado |
|---------|----------|--------|
| Cobertura de funciones | >80% | ⏳ Pendiente |
| Errores en consola | 0 | ✅ Cumplido |
| Tiempo de carga | <2s | ✅ Cumplido |
| Responsividad | 3+ breakpoints | ✅ Cumplido |
| Navegadores | 4+ soportados | ✅ Cumplido |

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0
