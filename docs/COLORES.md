# 🎨 Paleta de Colores - NETCLOUD

## 📋 Colores Oficiales de Branding

| Nombre | Código Hex | RGB | HSL | Uso |
|--------|-----------|-----|-----|-----|
| **Azul Principal** | `#413DDB` | rgb(65, 61, 219) | hsl(242°, 81%, 55%) | Botones, enlaces, acentos |
| **Azul Claro** | `#4C73DD` | rgb(76, 115, 221) | hsl(227°, 75%, 58%) | Fondos secundarios, hover |
| **Morado Eléctrico** | `#5734ED` | rgb(87, 52, 237) | hsl(256°, 90%, 57%) | Gradients, branding principal |
| **Azul Marino** | `#284DC5` | rgb(40, 77, 197) | hsl(219°, 66%, 46%) | Gradients, elementos oscuros |

## 🎯 Usos en el Proyecto

### Branding NETCLOUD
```css
background: linear-gradient(135deg, #5734ED 0%, #284DC5 100%);
color: white;
```
- **Colores**: Morado Eléctrico (#5734ED) + Azul Marino (#284DC5)
- **Ubicación**: Esquina inferior derecha (login e index)
- **Propósito**: Identidad visual corporativa

### Botones Principales
```css
background-color: #413DDB;
color: white;
border: none;
border-radius: 4px;
```
- **Color**: Azul Principal (#413DDB)
- **Uso**: Botones de acción primaria
- **Hover**: Azul Claro (#4C73DD)

### Elementos Secundarios
```css
background-color: #4C73DD;
color: white;
```
- **Color**: Azul Claro (#4C73DD)
- **Uso**: Fondos secundarios, tarjetas, elementos menos prominentes

### Gradients
```css
/* Gradient Azul */
background: linear-gradient(135deg, #413DDB 0%, #4C73DD 100%);

/* Gradient Morado-Azul (Branding) */
background: linear-gradient(135deg, #5734ED 0%, #284DC5 100%);
```

### Colores Complementarios
```css
/* Texto */
--text-primary: #333333;
--text-secondary: #666666;
--text-light: #999999;

/* Fondos */
--bg-light: #f8f9fa;
--bg-white: #ffffff;

/* Estados */
--success: #28a745;
--danger: #dc3545;
--warning: #ffc107;
--info: #17a2b8;
```

## 🛠️ Implementación en CSS

En `src/css/styles.css` están definidas como variables CSS:

```css
:root {
  /* Colores Primarios */
  --primary: #413DDB;
  --primary-light: #4C73DD;
  --primary-purple: #5734ED;
  --primary-dark: #284DC5;
  
  /* Colores Secundarios */
  --text-primary: #333333;
  --text-secondary: #666666;
  --bg-light: #f8f9fa;
  --bg-white: #ffffff;
  
  /* Estados */
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
  
  /* Otros */
  --border-color: #dee2e6;
  --shadow-color: rgba(0, 0, 0, 0.1);
}
```

## 📐 Accesibilidad

- **Contraste**: Los colores cumplen con WCAG AA (4.5:1 mínimo)
- **Daltonismo**: La paleta es amigable para usuarios con daltonismo
- **Legibilidad**: Texto blanco sobre fondos oscuros, texto oscuro sobre fondos claros

## 🎨 Ejemplos de Uso

### Botón Primario
```html
<button class="btn btn-primary">Acción Principal</button>
```

### Tarjeta Secundaria
```html
<div class="card" style="background-color: var(--primary-light);">
  Contenido secundario
</div>
```

### Alerta de Éxito
```html
<div class="alert alert-success">
  Operación completada exitosamente
</div>
```

## ⚠️ Notas Importantes

- **Consistencia**: Usar esta paleta en todos los elementos de branding y UI
- **No cambiar sin revisión**: Cualquier modificación debe documentarse aquí
- **Documentación**: Mantener actualizado este archivo con nuevos colores
- **Variables CSS**: Preferir variables CSS sobre valores hardcodeados

## 📝 Historial de Cambios

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2025-12-11 | Actualización completa de documentación | Dev Team |
| 2025-12-10 | Versión inicial | Dev Team |

---

**Última actualización**: Diciembre 2025
**Versión**: 2.0
