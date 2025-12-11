# Guía de Troubleshooting - NETCLOUD

## 🔧 Problemas Comunes y Soluciones

### 1. Problemas de Servidor

#### Problema: "Connection refused" al acceder a localhost:8000

**Síntomas**:
- Navegador muestra "ERR_CONNECTION_REFUSED"
- No puedes acceder a http://localhost:8000

**Causas Posibles**:
- Servidor no está corriendo
- Puerto 8000 está en uso por otra aplicación
- Estás en la carpeta incorrecta

**Soluciones**:

1. **Verificar que el servidor está corriendo**:
   ```powershell
   Get-Process python | Where-Object {$_.CommandLine -like "*http.server*"}
   ```

2. **Si no está corriendo, inicia el servidor**:
   ```powershell
   cd "c:\Users\USUARIO\Desktop\NETCLOUD EMP\dist"
   python -m http.server 8000
   ```

3. **Si el puerto está en uso, cambia a otro puerto**:
   ```powershell
   python -m http.server 8001
   # Luego accede a http://localhost:8001
   ```

4. **Detener servidor existente**:
   ```powershell
   Stop-Process -Name python -Force
   # Espera 2 segundos
   Start-Sleep -Seconds 2
   # Reinicia el servidor
   cd "c:\Users\USUARIO\Desktop\NETCLOUD EMP\dist"
   python -m http.server 8000
   ```

---

### 2. Problemas de Autenticación

#### Problema: "Credenciales inválidas" aunque escribo correctamente

**Síntomas**:
- Login rechaza las credenciales
- Mensaje de error: "Email o contraseña incorrectos"

**Causas Posibles**:
- Espacios en blanco al inicio/final
- Mayúsculas/minúsculas incorrectas
- Caracteres especiales no copiados correctamente

**Soluciones**:

1. **Verifica las credenciales exactas**:
   - **Email**: `netcloud@tecnología.com` (con acento en "tecnología")
   - **Contraseña**: `100%NETCLOUD` (con % y mayúsculas)

2. **Limpia el campo y vuelve a escribir**:
   - Borra todo el contenido del campo
   - Escribe lentamente sin copiar/pegar

3. **Verifica en DevTools**:
   ```javascript
   // En la consola del navegador
   localStorage.getItem('netcloud_auth')
   // Debería mostrar: {"email":"netcloud@tecnología.com","token":"token-..."}
   ```

4. **Limpia localStorage y reinicia**:
   ```javascript
   localStorage.clear()
   // Recarga la página (F5)
   ```

---

#### Problema: "Sesión expirada" después de cerrar el navegador

**Síntomas**:
- Cierras el navegador
- Al reabrirlo, tienes que hacer login de nuevo

**Causa**:
- Esto es comportamiento esperado con localStorage
- localStorage persiste entre sesiones, pero puede ser limpiado por el navegador

**Soluciones**:

1. **Verificar que localStorage no se limpia automáticamente**:
   - Chrome: Settings → Privacy → Clear browsing data → Desactiva "Cookies and other site data"
   - Firefox: Preferences → Privacy → Cookies and Site Data → Desactiva "Clear cookies and site data when Firefox is closed"

2. **Usar IndexedDB para persistencia más robusta** (mejora futura):
   - Actualmente se usa localStorage
   - En el futuro se puede migrar a IndexedDB

---

### 3. Problemas de Sincronización src ↔ dist

#### Problema: Los cambios en src/ no se reflejan en el navegador

**Síntomas**:
- Editas un archivo en src/
- Recarga el navegador pero no ves los cambios
- El servidor sigue sirviendo archivos antiguos

**Causas Posibles**:
- No sincronizaste src/ a dist/
- El navegador tiene caché
- El servidor no está sirviendo desde dist/

**Soluciones**:

1. **Sincroniza manualmente**:
   ```powershell
   Copy-Item -Path "src/*" -Destination "dist" -Recurse -Force
   ```

2. **O usa el script proporcionado**:
   ```powershell
   .\sync-dev.bat
   ```

3. **Limpia caché del navegador**:
   - Chrome: Ctrl+Shift+Delete → Selecciona "Cookies and other site data" → Clear data
   - Firefox: Ctrl+Shift+Delete → Selecciona "Cookies" → Clear Now

4. **Fuerza recarga sin caché**:
   - Chrome/Firefox: Ctrl+Shift+R
   - Safari: Cmd+Shift+R

5. **Verifica que estés sirviendo desde dist/**:
   ```powershell
   # Verifica la ruta actual
   pwd
   # Debería mostrar: C:\Users\USUARIO\Desktop\NETCLOUD EMP\dist
   ```

---

### 4. Problemas de Módulos/Plugins

#### Problema: "Cannot find module 'X'" en la consola

**Síntomas**:
- Error en consola: `Uncaught SyntaxError: The requested module does not provide an export named 'X'`
- Módulo no carga correctamente

**Causas Posibles**:
- Archivo no existe en la ruta especificada
- Nombre de exportación incorrecto
- Ruta relativa incorrecta

**Soluciones**:

1. **Verifica que el archivo existe**:
   ```powershell
   Test-Path "src/plugins/crm/crm.js"
   # Debería mostrar: True
   ```

2. **Verifica la exportación en el archivo**:
   ```javascript
   // En src/plugins/crm/crm.js, busca:
   export function renderClientesKanban() { ... }
   ```

3. **Verifica la importación en main.js**:
   ```javascript
   // En src/js/main.js, debería estar:
   import { renderClientesKanban } from '../plugins/crm/crm.js';
   ```

4. **Verifica la ruta relativa**:
   - Si estás en `src/js/main.js` y quieres importar de `src/plugins/crm/crm.js`
   - La ruta debe ser: `../plugins/crm/crm.js`

---

#### Problema: Kanban CRM no muestra cards

**Síntomas**:
- Haces clic en CRM
- Las columnas aparecen pero están vacías
- No hay cards de clientes

**Causas Posibles**:
- No hay datos en localStorage
- Función renderClientesKanban() no se ejecuta
- Error en la lógica de renderizado

**Soluciones**:

1. **Verifica que hay datos en localStorage**:
   ```javascript
   // En DevTools console
   localStorage.getItem('netcloud_clientes')
   // Debería mostrar un array JSON con clientes
   ```

2. **Si no hay datos, agrega datos de prueba**:
   ```javascript
   const mockClientes = [
     { id: 1, nombre: "Cliente 1", estado: "Nuevo", empresa: "Empresa 1" },
     { id: 2, nombre: "Cliente 2", estado: "Propuesta enviada", empresa: "Empresa 2" }
   ];
   localStorage.setItem('netcloud_clientes', JSON.stringify(mockClientes));
   // Recarga la página
   ```

3. **Verifica errores en consola**:
   - Abre DevTools (F12)
   - Ve a la pestaña Console
   - Busca mensajes de error en rojo

4. **Verifica que renderClientesKanban() se llama**:
   ```javascript
   // En src/js/main.js, busca:
   renderClientesKanban();
   ```

---

### 5. Problemas de Estilos

#### Problema: Los estilos no se aplican correctamente

**Síntomas**:
- Colores incorrectos
- Layout roto
- Elementos desalineados

**Causas Posibles**:
- CSS no se cargó
- Conflicto de estilos
- Bootstrap no se cargó

**Soluciones**:

1. **Verifica que styles.css se carga**:
   - DevTools → Network → Busca "styles.css"
   - Debería tener status 200

2. **Verifica que Bootstrap se carga**:
   - DevTools → Network → Busca "bootstrap"
   - Debería tener status 200

3. **Limpia caché y recarga**:
   ```
   Ctrl+Shift+R (fuerza recarga sin caché)
   ```

4. **Verifica las variables CSS**:
   ```javascript
   // En DevTools console
   getComputedStyle(document.documentElement).getPropertyValue('--primary')
   // Debería mostrar: #413DDB
   ```

---

### 6. Problemas de GitHub Pages

#### Problema: "404 Not Found" al desplegar en GitHub Pages

**Síntomas**:
- Despliegas a GitHub Pages
- Accedes a la URL pero ves 404
- Archivos no se encuentran

**Causas Posibles**:
- Estás desplegando desde src/ en lugar de dist/
- Rama gh-pages no está configurada
- Ruta base incorrecta

**Soluciones**:

1. **Asegúrate de desplegar desde dist/**:
   ```powershell
   # Copia contenido de dist/ a gh-pages
   git checkout gh-pages
   Copy-Item -Path "dist/*" -Destination "." -Recurse -Force
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

2. **Verifica configuración en GitHub**:
   - Ve a Settings → Pages
   - Source debe ser: "Deploy from a branch"
   - Branch debe ser: "gh-pages" / "root"

3. **Verifica la URL base**:
   - Si el repo es privado: `https://username.github.io/NETCLOUD-EMP/`
   - Si el repo es público: `https://username.github.io/NETCLOUD-EMP/`

---

## 🔍 Herramientas de Debugging

### DevTools del Navegador

**Abrir DevTools**:
- Chrome/Firefox/Edge: F12
- Safari: Cmd+Option+I

**Pestañas Útiles**:
- **Console**: Ver errores y ejecutar JavaScript
- **Network**: Ver qué archivos se cargan
- **Application**: Ver localStorage, sessionStorage, cookies
- **Elements**: Inspeccionar HTML y CSS

### Comandos Útiles en PowerShell

```powershell
# Ver procesos Python corriendo
Get-Process python

# Ver archivos modificados recientemente
Get-Item src, dist -Recurse | Sort-Object LastWriteTime -Descending | Select-Object FullName, LastWriteTime -First 10

# Contar líneas de código
(Get-ChildItem -Path "src" -Recurse -Include "*.js", "*.html", "*.css" | Measure-Object -Line).Lines

# Buscar texto en archivos
Select-String -Path "src\**\*.js" -Pattern "console.log"
```

---

## 📞 Contacto y Soporte

Si encuentras un problema que no está documentado aquí:

1. **Verifica los logs**:
   - DevTools Console (F12)
   - Terminal donde corre el servidor

2. **Busca en la documentación**:
   - ARQUITECTURA.md
   - ESTADO_PROYECTO.md
   - README.md

3. **Crea un issue en GitHub**:
   - Describe el problema
   - Incluye pasos para reproducir
   - Adjunta screenshots si es posible

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0
