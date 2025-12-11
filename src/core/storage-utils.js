// core/storage-utils.js
// Utilidades de almacenamiento local compartidas entre plugins

// Clientes
export function getClientes() {
  const data = localStorage.getItem('netcloud_clientes');
  return data ? JSON.parse(data) : [];
}

export function saveClientes(clientes) {
  localStorage.setItem('netcloud_clientes', JSON.stringify(clientes));
}

// Interacciones
export function getInteracciones() {
  const data = localStorage.getItem('netcloud_interacciones');
  return data ? JSON.parse(data) : [];
}

export function saveInteracciones(interacciones) {
  localStorage.setItem('netcloud_interacciones', JSON.stringify(interacciones));
}

// Egresos
export function getEgresos() {
  const data = localStorage.getItem('netcloud_egresos');
  return data ? JSON.parse(data) : [];
}

export function saveEgresos(egresos) {
  localStorage.setItem('netcloud_egresos', JSON.stringify(egresos));
}

// Documentos
export function getDocumentos() {
  const data = localStorage.getItem('netcloud_documentos');
  return data ? JSON.parse(data) : [];
}

export function saveDocumentos(documentos) {
  localStorage.setItem('netcloud_documentos', JSON.stringify(documentos));
}

// Activos
export function getActivos() {
  const data = localStorage.getItem('netcloud_activos');
  return data ? JSON.parse(data) : [];
}

export function saveActivos(activos) {
  localStorage.setItem('netcloud_activos', JSON.stringify(activos));
}

// Paquetes (Catálogo de servicios)
export function getPaquetes() {
  const data = localStorage.getItem('netcloud_paquetes');
  return data ? JSON.parse(data) : getDefaultPaquetes();
}

export function savePaquetes(paquetes) {
  localStorage.setItem('netcloud_paquetes', JSON.stringify(paquetes));
}

function getDefaultPaquetes() {
  return [
    {
      id: 'paquete-estandar',
      nombre: 'Estándar',
      descripcion: 'Paquete estándar de servicios',
      precio: 120,
      frecuencia: 'mensual',
      caracteristicas: ['Soporte básico', 'Actualizaciones', 'Acceso a dashboard'],
      estado: 'activo'
    },
    {
      id: 'paquete-premium',
      nombre: 'Premium',
      descripcion: 'Paquete premium con soporte prioritario',
      precio: 250,
      frecuencia: 'mensual',
      caracteristicas: ['Soporte prioritario', 'Actualizaciones', 'Acceso completo', 'Reportes avanzados'],
      estado: 'activo'
    }
  ];
}

// Inventario (Productos/Servicios)
export function getInventario() {
  const data = localStorage.getItem('netcloud_inventario');
  return data ? JSON.parse(data) : [];
}

export function saveInventario(inventario) {
  localStorage.setItem('netcloud_inventario', JSON.stringify(inventario));
}

// Pagos (Historial de transacciones)
export function getPagos() {
  const data = localStorage.getItem('netcloud_pagos');
  return data ? JSON.parse(data) : [];
}

export function savePagos(pagos) {
  localStorage.setItem('netcloud_pagos', JSON.stringify(pagos));
}

// Utilidades de validación
export function validarCliente(cliente) {
  if (!cliente.nombre || cliente.nombre.trim() === '') return false;
  if (cliente.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) return false;
  return true;
}

export function validarPago(pago) {
  if (!pago.monto || pago.monto <= 0) return false;
  if (!pago.clienteId) return false;
  if (!pago.fecha) return false;
  return true;
}

export function validarProducto(producto) {
  if (!producto.nombre || producto.nombre.trim() === '') return false;
  if (!producto.precio || producto.precio < 0) return false;
  if (producto.tipo !== 'producto' && producto.tipo !== 'servicio') return false;
  return true;
}

// Utilidades de cálculo
export function calcularProximoPago(fechaUltimoPago, frecuencia) {
  const fecha = new Date(fechaUltimoPago);
  if (frecuencia === 'mensual') {
    fecha.setMonth(fecha.getMonth() + 1);
  } else if (frecuencia === 'trimestral') {
    fecha.setMonth(fecha.getMonth() + 3);
  } else if (frecuencia === 'anual') {
    fecha.setFullYear(fecha.getFullYear() + 1);
  }
  return fecha.toISOString();
}

export function calcularResumenFinanzas(mes, anio) {
  const pagos = getPagos();
  const egresos = getEgresos();
  
  const ingresosMes = pagos.filter(p => {
    const fecha = new Date(p.fecha);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio && p.estado === 'pagado';
  }).reduce((sum, p) => sum + p.monto, 0);
  
  const egresosMes = egresos.filter(e => {
    const fecha = new Date(e.fecha);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio;
  }).reduce((sum, e) => sum + (parseFloat(e.monto) || 0), 0);
  
  return {
    mes,
    anio,
    ingresos: ingresosMes,
    egresos: egresosMes,
    balance: ingresosMes - egresosMes
  };
}
