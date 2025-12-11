# Arquitectura: Finanzas, Ingresos Recurrentes e Inventario

## 📊 Problema: Ingresos Mensuales Recurrentes

### Situación Actual
- Cliente "Estándar" paga $120/mes
- Ya pagó 2 meses = $240 total
- Sistema solo registra un ingreso de $120

### Solución Propuesta: Sistema de Suscripciones/Contratos

---

## 🏗️ Arquitectura de Ingresos Recurrentes

### Opción 1: Modelo de Suscripción (RECOMENDADO)

```javascript
// Estructura de datos para cliente con suscripción
{
  id: "cliente-123",
  nombre: "Cliente Estándar",
  paquete: {
    nombre: "Estándar",
    precio: 120,
    frecuencia: "mensual", // mensual, trimestral, anual
    fechaInicio: "2025-10-11",
    fechaProximoPago: "2025-11-11",
    estado: "activo" // activo, pausado, cancelado
  },
  pagos: [
    {
      id: "pago-1",
      monto: 120,
      fecha: "2025-10-11",
      estado: "pagado",
      factura: "factura-001.pdf"
    },
    {
      id: "pago-2",
      monto: 120,
      fecha: "2025-11-11",
      estado: "pagado",
      factura: "factura-002.pdf"
    }
  ]
}
```

### Ventajas:
- ✅ Historial completo de pagos
- ✅ Rastreo de próximo pago
- ✅ Fácil generar reportes mensuales
- ✅ Detectar pagos atrasados
- ✅ Auditoría completa

---

## 📋 Estructura de Datos Mejorada

### Cliente (Extendido)
```javascript
{
  id: string,
  nombre: string,
  empresa: string,
  email: string,
  telefono: string,
  estadoVenta: string,
  
  // NUEVO: Información de Suscripción
  suscripcion: {
    paqueteId: string,
    precio: number,
    frecuencia: "mensual" | "trimestral" | "anual",
    fechaInicio: ISO8601,
    fechaProximoPago: ISO8601,
    estado: "activo" | "pausado" | "cancelado",
    notasInternas: string
  },
  
  // NUEVO: Historial de Pagos
  pagos: [
    {
      id: string,
      monto: number,
      fecha: ISO8601,
      estado: "pagado" | "pendiente" | "atrasado",
      factura: string (URL o ID),
      metodo: "transferencia" | "efectivo" | "tarjeta",
      referencia: string
    }
  ]
}
```

### Paquete (Catálogo)
```javascript
{
  id: string,
  nombre: string,
  descripcion: string,
  precio: number,
  caracteristicas: string[],
  estado: "activo" | "inactivo"
}
```

### Transacción Financiera
```javascript
{
  id: string,
  tipo: "ingreso" | "egreso",
  categoria: string,
  monto: number,
  fecha: ISO8601,
  clienteId: string (opcional),
  descripcion: string,
  factura: string (opcional),
  estado: "completado" | "pendiente" | "cancelado"
}
```

---

## 💾 Cómo Registrar Pagos (Mejores Prácticas)

### Opción A: Carga Manual de Factura (Recomendado para auditoría)
```
1. Cliente realiza pago
2. Usuario carga factura/comprobante en el sistema
3. Sistema registra:
   - Fecha del pago
   - Monto
   - Archivo de factura
   - Estado: "pagado"
4. Sistema actualiza próximo pago esperado
```

### Opción B: Registro Manual (Rápido)
```
1. Usuario registra pago manualmente
2. Sistema crea transacción
3. Usuario puede adjuntar factura después
```

### Opción C: Integración con Pasarela (Futuro)
```
1. Cliente paga por Stripe/PayPal
2. Sistema recibe webhook
3. Registra automáticamente
```

**Recomendación**: Usar Opción A (carga de factura) porque:
- ✅ Auditoría completa
- ✅ Prueba de pago
- ✅ Cumplimiento fiscal
- ✅ Fácil de implementar

---

## 📈 Reportes de Finanzas

### Reporte Mensual
```javascript
{
  mes: "2025-11",
  ingresos: {
    total: 120,
    porCliente: [
      { cliente: "Estándar", monto: 120 }
    ]
  },
  egresos: {
    total: 0,
    porCategoria: {}
  },
  balance: 120
}
```

### Dashboard de Finanzas
- Total ingresos mes actual
- Total egresos mes actual
- Balance neto
- Próximos pagos esperados
- Pagos atrasados
- Gráfico de ingresos vs egresos

---

## 🏪 Módulo Inventario (Nueva Pestaña)

### Estructura de Datos

```javascript
// Producto/Servicio
{
  id: string,
  nombre: string,
  descripcion: string,
  tipo: "producto" | "servicio",
  precio: number,
  costo: number,
  cantidad: number, // para productos
  unidad: string, // kg, unidad, hora, etc
  categoria: string,
  estado: "activo" | "inactivo",
  imagen: string (URL),
  sku: string,
  notas: string
}
```

### Funcionalidades del Inventario

1. **Gestión de Productos/Servicios**
   - Crear, editar, eliminar
   - Categorías
   - Precios y costos
   - Stock (para productos)

2. **Integración con Paquetes**
   - Paquete "Estándar" = Servicio X + Servicio Y
   - Mostrar qué incluye cada paquete
   - Calcular costo total del paquete

3. **Reportes**
   - Productos más vendidos
   - Margen de ganancia
   - Stock bajo
   - Valor total de inventario

---

## 🔄 Flujo Completo: Cliente → Paquete → Inventario → Finanzas

```
1. CREAR CLIENTE
   └─ Asignar paquete "Estándar" ($120/mes)

2. INVENTARIO
   └─ Paquete "Estándar" contiene:
      ├─ Servicio A ($50)
      ├─ Servicio B ($40)
      └─ Servicio C ($30)

3. CLIENTE PAGA
   └─ Cargar factura
   └─ Sistema registra:
      ├─ Ingreso de $120
      ├─ Próximo pago: 2025-12-11
      └─ Historial actualizado

4. FINANZAS
   └─ Dashboard muestra:
      ├─ Ingresos: $120
      ├─ Próximos pagos: $120 (2025-12-11)
      └─ Balance: $120
```

---

## 🛠️ Mejores Prácticas de Programación

### 1. Separación de Responsabilidades
```javascript
// ❌ MAL: Todo mezclado
function guardarCliente(cliente) {
  // validar
  // guardar en localStorage
  // actualizar UI
  // calcular finanzas
  // enviar email
}

// ✅ BIEN: Funciones específicas
function validarCliente(cliente) { /* ... */ }
function guardarClienteStorage(cliente) { /* ... */ }
function actualizarUICliente() { /* ... */ }
function registrarIngreso(cliente) { /* ... */ }
```

### 2. Validación de Datos
```javascript
// ✅ BIEN: Validar antes de guardar
function guardarCliente(cliente) {
  if (!validarCliente(cliente)) {
    throw new Error("Datos inválidos");
  }
  // guardar
}

function validarCliente(cliente) {
  if (!cliente.nombre) return false;
  if (!cliente.email || !esEmailValido(cliente.email)) return false;
  if (cliente.suscripcion?.precio < 0) return false;
  return true;
}
```

### 3. Manejo de Errores
```javascript
// ✅ BIEN: Try-catch con mensajes claros
try {
  const cliente = JSON.parse(localStorage.getItem('cliente'));
  if (!cliente) throw new Error("Cliente no encontrado");
  return cliente;
} catch (error) {
  console.error("Error cargando cliente:", error);
  mostrarAlerta("Error al cargar cliente", "danger");
  return null;
}
```

### 4. Funciones Puras
```javascript
// ✅ BIEN: Función pura (sin efectos secundarios)
function calcularProximoPago(fecha, frecuencia) {
  const nuevaFecha = new Date(fecha);
  if (frecuencia === "mensual") {
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
  }
  return nuevaFecha.toISOString();
}

// ❌ MAL: Función con efectos secundarios
function calcularProximoPago(cliente) {
  cliente.proximoPago = new Date(); // modifica el objeto
  localStorage.setItem('cliente', JSON.stringify(cliente)); // efecto secundario
}
```

### 5. Nombres Descriptivos
```javascript
// ❌ MAL
const d = new Date();
const c = getClientes();
const p = c.filter(x => x.s === "activo");

// ✅ BIEN
const fechaActual = new Date();
const clientes = getClientes();
const clientesActivos = clientes.filter(cliente => cliente.estado === "activo");
```

### 6. Documentación de Funciones
```javascript
/**
 * Calcula el próximo pago esperado basado en la frecuencia
 * @param {Date} fechaUltimoPago - Fecha del último pago
 * @param {string} frecuencia - "mensual", "trimestral" o "anual"
 * @returns {Date} Fecha del próximo pago esperado
 * @throws {Error} Si la frecuencia es inválida
 */
function calcularProximoPago(fechaUltimoPago, frecuencia) {
  // implementación
}
```

---

## 📋 Plan de Implementación

### Fase 1: Mejorar Finanzas (Esta semana)
1. Extender estructura de Cliente con suscripción
2. Agregar historial de pagos
3. Crear función para registrar pagos
4. Mejorar dashboard de finanzas

### Fase 2: Crear Módulo Inventario (Próxima semana)
1. Crear estructura de Producto/Servicio
2. UI para gestionar inventario
3. Integrar con paquetes
4. Reportes básicos

### Fase 3: Integración Completa (Futuro)
1. Conectar Inventario ↔ Paquetes
2. Conectar Paquetes ↔ Finanzas
3. Reportes avanzados
4. Auditoría de cambios

---

## 🎯 Decisiones Arquitectónicas

| Decisión | Opción | Razón |
|----------|--------|-------|
| Ingresos Recurrentes | Suscripción en Cliente | Historial completo, auditoría |
| Registro de Pagos | Carga de Factura | Prueba de pago, cumplimiento fiscal |
| Almacenamiento | localStorage | Simple, sin backend (por ahora) |
| Validación | Funciones separadas | Reutilizable, testeable |
| Errores | Try-catch + alertas | Usuario informado |

---

**Última actualización**: 11 de Diciembre 2025
**Versión**: 1.0
