# Guía de Scripts - NETCLOUD

## 📋 Scripts Disponibles

### 1. `run-dev.bat` - Inicia la Aplicación

**Ubicación**: Raíz del proyecto

**Función**: Sincroniza cambios y levanta el servidor de desarrollo

**Uso**:
```powershell
.\run-dev.bat              # Puerto por defecto (8000)
.\run-dev.bat 8001         # Puerto personalizado (8001)
```

**Qué hace**:
1. Valida que la carpeta `dist/` existe (la crea si no existe)
2. Ejecuta `sync-dev.bat` para sincronizar src/ → dist/
3. Verifica que Python está instalado
4. Inicia servidor Python en el puerto especificado
5. Abre automáticamente http://localhost:8000 (o el puerto especificado)

**Requisitos**:
- Python 3.x instalado
- PowerShell disponible
- Carpeta `src/` con código fuente

**Ejemplo de uso**:
```powershell
# Terminal en la raíz del proyecto
cd "c:\Users\USUARIO\Desktop\NETCLOUD EMP"
.\run-dev.bat

# Resultado esperado:
# ========================================
#  DASHBOARD ADMINISTRATIVO
#  Servidor de Desarrollo
# ========================================
#
# Sincronizando archivos src/ -> dist/...
# [OK] Sincronizacion completada
#
# Iniciando servidor en http://localhost:8000
# Presiona Ctrl+C para detener
```

**Detener el servidor**:
- Presiona `Ctrl+C` en la terminal
- Presiona cualquier tecla para cerrar la ventana

---

### 2. `sync-dev.bat` - Sincroniza Archivos

**Ubicación**: Raíz del proyecto

**Función**: Copia cambios de src/ a dist/

**Uso**:
```powershell
.\sync-dev.bat
```

**Qué hace**:
1. Valida que la carpeta `src/` existe
2. Crea la carpeta `dist/` si no existe
3. Copia recursivamente todos los archivos de src/ a dist/
4. Sobrescribe archivos existentes
5. Muestra mensaje de confirmación

**Requisitos**:
- PowerShell disponible
- Carpeta `src/` con código fuente

**Cuándo usar**:
- Después de editar archivos en `src/`
- Antes de hacer testing en el navegador
- Antes de desplegar a producción
- Automáticamente cuando ejecutas `run-dev.bat`

**Ejemplo de uso**:
```powershell
# Editas un archivo en src/
# Luego ejecutas:
.\sync-dev.bat

# Resultado esperado:
# ========================================
#  SINCRONIZANDO src/ -> dist/
# ========================================
#
# [OK] Sincronizacion completada
# ========================================
```

---

### 3. `npm run build` - Build para Producción

**Ubicación**: Raíz del proyecto (requiere Node.js)

**Función**: Prepara el proyecto para despliegue

**Uso**:
```bash
npm run build
```

**Qué hace**:
1. Ejecuta `npm run sync` (sincroniza src/ → dist/)
2. Prepara los archivos para producción
3. Genera la carpeta `dist/` lista para desplegar

**Requisitos**:
- Node.js instalado
- `package.json` en la raíz

**Cuándo usar**:
- Antes de desplegar a GitHub Pages
- Antes de desplegar a Cloudflare Pages
- En CI/CD pipelines

---

### 4. `npm run dev` - Servidor de Desarrollo (npm)

**Ubicación**: Raíz del proyecto (requiere Node.js)

**Función**: Inicia servidor Python desde npm

**Uso**:
```bash
npm run dev
```

**Qué hace**:
1. Inicia servidor Python en puerto 8000
2. Sirve archivos desde la carpeta `dist/`

**Requisitos**:
- Node.js instalado
- Python 3.x instalado
- `package.json` en la raíz

---

### 5. `npm run start` - Build + Dev (npm)

**Ubicación**: Raíz del proyecto (requiere Node.js)

**Función**: Sincroniza y levanta el servidor en un comando

**Uso**:
```bash
npm run start
```

**Qué hace**:
1. Ejecuta `npm run build` (sincroniza src/ → dist/)
2. Ejecuta `npm run dev` (inicia servidor)

**Requisitos**:
- Node.js instalado
- Python 3.x instalado
- `package.json` en la raíz

---

## 🔄 Flujo de Trabajo Recomendado

### Opción 1: Usando Batch Scripts (Windows)

```powershell
# 1. Abre PowerShell en la raíz del proyecto
cd "c:\Users\USUARIO\Desktop\NETCLOUD EMP"

# 2. Inicia la aplicación
.\run-dev.bat

# 3. Abre navegador en http://localhost:8000/login.html

# 4. Edita archivos en src/

# 5. Sincroniza cambios
.\sync-dev.bat

# 6. Recarga navegador (F5)

# 7. Verifica cambios
```

### Opción 2: Usando npm (Recomendado)

```bash
# 1. Abre terminal en la raíz del proyecto
cd "c:\Users\USUARIO\Desktop\NETCLOUD EMP"

# 2. Instala dependencias (primera vez)
npm install

# 3. Inicia la aplicación
npm run start

# 4. Abre navegador en http://localhost:8000/login.html

# 5. Edita archivos en src/

# 6. Sincroniza cambios
npm run sync

# 7. Recarga navegador (F5)

# 8. Verifica cambios
```

---

## 📊 Comparativa de Scripts

| Script | Requisitos | Plataforma | Uso |
|--------|-----------|-----------|-----|
| `run-dev.bat` | Python 3.x | Windows | Desarrollo local |
| `sync-dev.bat` | PowerShell | Windows | Sincronizar cambios |
| `npm run build` | Node.js | Multiplataforma | Build para producción |
| `npm run dev` | Node.js, Python | Multiplataforma | Servidor de desarrollo |
| `npm run start` | Node.js, Python | Multiplataforma | Build + servidor |

---

## 🛠️ Troubleshooting de Scripts

### Error: "run-dev.bat is not recognized"

**Causa**: No estás en la carpeta correcta

**Solución**:
```powershell
# Navega a la raíz del proyecto
cd "c:\Users\USUARIO\Desktop\NETCLOUD EMP"

# Ejecuta el script
.\run-dev.bat
```

### Error: "Python not found"

**Causa**: Python no está instalado o no está en PATH

**Solución**:
1. Descarga Python desde https://www.python.org/downloads/
2. Durante la instalación, marca "Add Python to PATH"
3. Reinicia la terminal
4. Verifica: `python --version`

### Error: "PowerShell is not recognized"

**Causa**: PowerShell no está disponible (muy raro en Windows 10+)

**Solución**:
1. Descarga PowerShell desde https://github.com/PowerShell/PowerShell
2. O usa `cmd.exe` en lugar de PowerShell

### Error: "Port 8000 already in use"

**Causa**: Otro proceso está usando el puerto 8000

**Solución**:
```powershell
# Opción 1: Usar otro puerto
.\run-dev.bat 8001

# Opción 2: Matar el proceso
Get-Process python | Stop-Process -Force
# Espera 2 segundos
Start-Sleep -Seconds 2
# Reinicia
.\run-dev.bat
```

---

## 📝 Mejoras Realizadas en Scripts

### run-dev.bat (Mejorado)
- ✅ Validación de carpeta `dist/`
- ✅ Validación de Python instalado
- ✅ Manejo de errores
- ✅ Soporte para puerto personalizado
- ✅ Mensajes de error claros

### sync-dev.bat (Mejorado)
- ✅ Validación de carpeta `src/`
- ✅ Creación automática de `dist/`
- ✅ Manejo de errores
- ✅ Mensajes de confirmación

---

## 🚀 Despliegue

### Para GitHub Pages
```powershell
# 1. Sincroniza cambios
.\sync-dev.bat

# 2. Commit y push
git add .
git commit -m "Cambios en el dashboard"
git push origin main

# 3. GitHub Pages se actualiza automáticamente
```

### Para Cloudflare Pages
```bash
# 1. Build
npm run build

# 2. Commit y push
git add .
git commit -m "Cambios en el dashboard"
git push origin main

# 3. Cloudflare Pages se actualiza automáticamente
```

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0
