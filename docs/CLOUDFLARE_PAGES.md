# Despliegue en Cloudflare Pages - NETCLOUD

## 📋 Requisitos Previos

- Cuenta en Cloudflare (https://dash.cloudflare.com)
- Repositorio en GitHub con el código del proyecto
- Git instalado en tu máquina

---

## 🚀 Pasos para Desplegar

### 1. Preparar el Repositorio en GitHub

```bash
# Inicializar repositorio (si no existe)
git init
git add .
git commit -m "Initial commit: NETCLOUD Dashboard"

# Crear repositorio en GitHub y agregar remote
git remote add origin https://github.com/tu-usuario/NETCLOUD-EMP.git
git branch -M main
git push -u origin main
```

### 2. Conectar Cloudflare Pages

1. **Accede a Cloudflare Dashboard**:
   - Ve a https://dash.cloudflare.com
   - Selecciona tu cuenta

2. **Navega a Pages**:
   - En el menú lateral, busca "Pages"
   - Haz clic en "Create a project"

3. **Conecta tu repositorio**:
   - Selecciona "Connect to Git"
   - Autoriza Cloudflare para acceder a GitHub
   - Selecciona tu repositorio `NETCLOUD-EMP`

4. **Configura el Build**:
   - **Project name**: `netcloud-dashboard` (o el que prefieras)
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (dejar en blanco)

5. **Variables de Entorno** (opcional):
   - Si necesitas variables, agrégalas aquí
   - Ejemplo: `FIREBASE_CONFIG=...`

6. **Deploy**:
   - Haz clic en "Save and Deploy"
   - Cloudflare compilará y desplegará automáticamente

---

## 🔧 Configuración del Proyecto

### package.json

El proyecto necesita un `package.json` con el script de build:

```json
{
  "name": "netcloud-dashboard",
  "version": "1.0.0",
  "description": "Dashboard Administrativo CRM + Finanzas",
  "scripts": {
    "build": "npm run sync",
    "sync": "powershell -Command \"Copy-Item -Path 'src/*' -Destination 'dist' -Recurse -Force\"",
    "dev": "python -m http.server 8000 --directory dist"
  }
}
```

### _redirects

El archivo `_redirects` en la raíz del proyecto redirige todas las rutas a `index.html` para que el SPA funcione correctamente:

```
/* /index.html 200
```

Este archivo ya está creado en la raíz del proyecto.

### wrangler.toml

Configuración de Cloudflare Pages (ya creada):

```toml
name = "netcloud-dashboard"
type = "javascript"

[site]
bucket = "./dist"
```

---

## 📊 Estructura de Despliegue

```
NETCLOUD EMP/
├── src/                    ← Código fuente
├── dist/                   ← Compilado (generado por build)
├── docs/                   ← Documentación
├── package.json            ← Scripts de build
├── _redirects              ← Configuración de rutas
├── wrangler.toml           ← Configuración de Cloudflare
└── .gitignore              ← Archivos a ignorar
```

---

## 🔄 Flujo de Despliegue Automático

1. **Haces un commit en GitHub**:
   ```bash
   git add .
   git commit -m "Cambios en el dashboard"
   git push origin main
   ```

2. **Cloudflare detecta el cambio**:
   - Webhook automático de GitHub
   - Inicia el build automáticamente

3. **Cloudflare ejecuta el build**:
   - Ejecuta: `npm run build`
   - Copia src/ → dist/
   - Genera los archivos estáticos

4. **Cloudflare despliega**:
   - Sube archivos de dist/ a los servidores
   - Tu sitio está disponible en: `https://netcloud-dashboard.pages.dev`

---

## 🌐 URLs de Despliegue

- **URL por defecto**: `https://netcloud-dashboard.pages.dev`
- **URL personalizada**: Configurable en Cloudflare Dashboard
  - Requiere dominio propio
  - Pasos: Pages → Settings → Custom domain

---

## 🔐 Variables de Entorno en Cloudflare

Si necesitas variables de entorno (ej: Firebase config):

1. Ve a Pages → Settings → Environment variables
2. Agrega las variables:
   - `FIREBASE_API_KEY=...`
   - `FIREBASE_PROJECT_ID=...`
   - etc.

3. En tu código, accede con:
   ```javascript
   const apiKey = process.env.FIREBASE_API_KEY;
   ```

---

## 🐛 Troubleshooting

### Error: "Build failed"

**Causa**: Script de build incorrecto

**Solución**:
1. Verifica que `package.json` existe
2. Verifica que el script `build` está correcto
3. Revisa los logs en Cloudflare Dashboard → Deployments

### Error: "404 Not Found"

**Causa**: Las rutas no se redirigen a index.html

**Solución**:
1. Verifica que `_redirects` existe en la raíz
2. Contenido debe ser: `/* /index.html 200`
3. Redeploy: Pages → Deployments → Retry

### Error: "Cannot find module"

**Causa**: Dependencias no instaladas

**Solución**:
1. Agrega `package-lock.json` a Git
2. Cloudflare instalará dependencias automáticamente

---

## 📝 Checklist de Despliegue

- [ ] Repositorio en GitHub creado
- [ ] `package.json` con script `build` correcto
- [ ] `_redirects` en la raíz del proyecto
- [ ] `wrangler.toml` configurado
- [ ] Cloudflare Pages conectado
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Primer deploy exitoso
- [ ] URL accesible en navegador
- [ ] Login funciona en producción
- [ ] localStorage funciona en producción

---

## 🚀 Despliegue Manual (Alternativa)

Si prefieres desplegar manualmente sin GitHub:

1. **Instala Wrangler**:
   ```bash
   npm install -g wrangler
   ```

2. **Autentica con Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Despliega**:
   ```bash
   wrangler pages deploy dist
   ```

---

## 📞 Soporte

- **Documentación Cloudflare**: https://developers.cloudflare.com/pages/
- **Comunidad**: https://community.cloudflare.com/
- **Status**: https://www.cloudflarestatus.com/

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0
