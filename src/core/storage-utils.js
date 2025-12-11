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

export function eliminarCliente(clienteId) {
  const clientes = getClientes();
  const clientesFiltrados = clientes.filter(c => c.id !== clienteId);
  saveClientes(clientesFiltrados);
  return true;
}

// Interacciones
export function getInteracciones() {
  const data = localStorage.getItem('netcloud_interacciones');
  return data ? JSON.parse(data) : [];
}

export function saveInteracciones(interacciones) {
  localStorage.setItem('netcloud_interacciones', JSON.stringify(interacciones));
}

export function agregarInteraccion(clienteId, clienteNombre, tipo, descripcion) {
  const nuevaInteraccion = {
    id: 'interaccion-' + Date.now(),
    clienteId,
    clienteNombre,
    tipo,
    descripcion,
    fecha: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  
  const interacciones = getInteracciones();
  interacciones.push(nuevaInteraccion);
  saveInteracciones(interacciones);
  
  return nuevaInteraccion.id;
}

// KPIs y Estadísticas
export function calcularKPIs() {
  const clientes = getClientes();
  const ingresos = getIngresos();
  const ahora = new Date();
  
  // Tasa de conversión
  const clientesCerrados = clientes.filter(c => c.estadoVenta === 'Cerrado - Ganado').length;
  const tasaConversion = clientes.length > 0 ? ((clientesCerrados / clientes.length) * 100).toFixed(1) : 0;
  
  // Clientes por estado
  const clientesPorEstado = {
    nuevo: clientes.filter(c => c.estadoVenta === 'Nuevo').length,
    propuesta: clientes.filter(c => c.estadoVenta === 'Propuesta enviada').length,
    negociacion: clientes.filter(c => c.estadoVenta === 'Negociación').length,
    cerradoGanado: clientes.filter(c => c.estadoVenta === 'Cerrado - Ganado').length,
    cerradoPerdido: clientes.filter(c => c.estadoVenta === 'Cerrado - Perdido').length
  };
  
  // Días promedio en negociación
  const clientesNegociacion = clientes.filter(c => c.estadoVenta === 'Negociación');
  let diasPromedio = 0;
  if (clientesNegociacion.length > 0) {
    const diasTotal = clientesNegociacion.reduce((sum, c) => {
      const fecha = new Date(c.fechaPrimerContacto);
      const dias = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));
      return sum + dias;
    }, 0);
    diasPromedio = (diasTotal / clientesNegociacion.length).toFixed(0);
  }
  
  // Tasa de cobranza
  const ingresosPagados = ingresos.filter(i => i.estado === 'pagado').length;
  const tasaCobranza = ingresos.length > 0 ? ((ingresosPagados / ingresos.length) * 100).toFixed(1) : 0;
  
  return {
    tasaConversion,
    clientesPorEstado,
    diasPromedio,
    tasaCobranza,
    totalClientes: clientes.length,
    totalFacturas: ingresos.length,
    facturasPagadas: ingresosPagados,
    facturasPendientes: ingresos.length - ingresosPagados
  };
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

// ============================================
// GASTOS EMPRESARIALES (Activos de empresa)
// ============================================

export function getGastosEmpresariales() {
  const data = localStorage.getItem('netcloud_gastos_empresariales');
  return data ? JSON.parse(data) : [];
}

export function saveGastosEmpresariales(gastos) {
  localStorage.setItem('netcloud_gastos_empresariales', JSON.stringify(gastos));
}

export function agregarGastoEmpresarial(nombre, precioUsd, precioBS, fecha, factura, observaciones) {
  const nuevoGasto = {
    id: 'gasto-' + Date.now(),
    nombre,
    precioUsd: parseFloat(precioUsd),
    precioBS: parseFloat(precioBS),
    fecha,
    factura,
    observaciones,
    createdAt: new Date().toISOString()
  };
  
  const gastos = getGastosEmpresariales();
  gastos.push(nuevoGasto);
  saveGastosEmpresariales(gastos);
  
  return nuevoGasto.id;
}

export function eliminarGastoEmpresarial(gastoId) {
  const gastos = getGastosEmpresariales();
  const filtrados = gastos.filter(g => g.id !== gastoId);
  saveGastosEmpresariales(filtrados);
  return true;
}

export function obtenerResumenGastosEmpresariales(mes, anio) {
  const gastos = getGastosEmpresariales();
  const gastosMes = gastos.filter(g => {
    const fecha = new Date(g.fecha);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio;
  });
  
  const totalUsd = gastosMes.reduce((sum, g) => sum + g.precioUsd, 0);
  const totalBS = gastosMes.reduce((sum, g) => sum + g.precioBS, 0);
  
  return {
    mes,
    anio,
    cantidad: gastosMes.length,
    totalUsd,
    totalBS,
    gastos: gastosMes
  };
}

// ============================================
// REFRIGERIOS
// ============================================

export function getRefrigerios() {
  const data = localStorage.getItem('netcloud_refrigerios');
  return data ? JSON.parse(data) : [];
}

export function saveRefrigerios(refrigerios) {
  localStorage.setItem('netcloud_refrigerios', JSON.stringify(refrigerios));
}

export function agregarRefrigerio(nombre, precioBS, precioUsd, fecha, factura, observaciones) {
  const nuevoRefrigerio = {
    id: 'refrig-' + Date.now(),
    nombre,
    precioBS: parseFloat(precioBS),
    precioUsd: parseFloat(precioUsd),
    fecha,
    factura,
    observaciones,
    createdAt: new Date().toISOString()
  };
  
  const refrigerios = getRefrigerios();
  refrigerios.push(nuevoRefrigerio);
  saveRefrigerios(refrigerios);
  
  return nuevoRefrigerio.id;
}

export function eliminarRefrigerio(refrigerioId) {
  const refrigerios = getRefrigerios();
  const filtrados = refrigerios.filter(r => r.id !== refrigerioId);
  saveRefrigerios(filtrados);
  return true;
}

export function obtenerResumenRefrigerios(mes, anio) {
  const refrigerios = getRefrigerios();
  const refrigeriosMes = refrigerios.filter(r => {
    const fecha = new Date(r.fecha);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio;
  });
  
  const totalBS = refrigeriosMes.reduce((sum, r) => sum + r.precioBS, 0);
  const totalUsd = refrigeriosMes.reduce((sum, r) => sum + r.precioUsd, 0);
  
  return {
    mes,
    anio,
    cantidad: refrigeriosMes.length,
    totalBS,
    totalUsd,
    refrigerios: refrigeriosMes
  };
}

// ============================================
// PAGOS PERSONAL (CEOs y Empleados)
// ============================================

export function getPagosPersonal() {
  const data = localStorage.getItem('netcloud_pagos_personal');
  return data ? JSON.parse(data) : [];
}

export function savePagosPersonal(pagos) {
  localStorage.setItem('netcloud_pagos_personal', JSON.stringify(pagos));
}

export function agregarPagoPersonal(nombre, montoUsd, montoBS, fecha, tipoGanancia, rol, observaciones) {
  const nuevoPago = {
    id: 'pago-personal-' + Date.now(),
    nombre,
    montoUsd: parseFloat(montoUsd),
    montoBS: parseFloat(montoBS),
    fecha,
    tipoGanancia,
    rol,
    observaciones,
    createdAt: new Date().toISOString()
  };
  
  const pagos = getPagosPersonal();
  pagos.push(nuevoPago);
  savePagosPersonal(pagos);
  
  return nuevoPago.id;
}

export function eliminarPagoPersonal(pagoId) {
  const pagos = getPagosPersonal();
  const filtrados = pagos.filter(p => p.id !== pagoId);
  savePagosPersonal(filtrados);
  return true;
}

export function obtenerResumenPagosPersonal(mes, anio) {
  const pagos = getPagosPersonal();
  const pagosMes = pagos.filter(p => {
    const fecha = new Date(p.fecha);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio;
  });
  
  const totalUsd = pagosMes.reduce((sum, p) => sum + p.montoUsd, 0);
  const totalBS = pagosMes.reduce((sum, p) => sum + p.montoBS, 0);
  
  const pagosPorRol = {
    CEOs: pagosMes.filter(p => p.rol === 'CEO'),
    Empleados: pagosMes.filter(p => p.rol === 'Empleado')
  };
  
  return {
    mes,
    anio,
    cantidad: pagosMes.length,
    totalUsd,
    totalBS,
    pagosPorRol,
    pagos: pagosMes
  };
}

// ============================================
// ACTIVOS CON DEPRECIACIÓN
// ============================================

export function getActivosDepreciacion() {
  const data = localStorage.getItem('netcloud_activos_depreciacion');
  return data ? JSON.parse(data) : [];
}

export function saveActivosDepreciacion(activos) {
  localStorage.setItem('netcloud_activos_depreciacion', JSON.stringify(activos));
}

export function agregarActivoDepreciacion(nombre, precioUsd, precioBS, fecha, vidaUtil, factura, observaciones) {
  const nuevoActivo = {
    id: 'activo-' + Date.now(),
    nombre,
    precioUsd: parseFloat(precioUsd),
    precioBS: parseFloat(precioBS),
    fecha,
    vidaUtil: parseInt(vidaUtil),
    factura,
    observaciones,
    estado: 'activo',
    createdAt: new Date().toISOString()
  };
  
  const activos = getActivosDepreciacion();
  activos.push(nuevoActivo);
  saveActivosDepreciacion(activos);
  
  return nuevoActivo.id;
}

export function eliminarActivoDepreciacion(activoId) {
  const activos = getActivosDepreciacion();
  const filtrados = activos.filter(a => a.id !== activoId);
  saveActivosDepreciacion(filtrados);
  return true;
}

export function calcularDepreciacionAnual(precioUsd, vidaUtil) {
  if (vidaUtil <= 0) return 0;
  return precioUsd / vidaUtil;
}

export function calcularDepreciacionMensual(precioUsd, vidaUtil) {
  if (vidaUtil <= 0) return 0;
  const anual = precioUsd / vidaUtil;
  return anual / 12;
}

export function calcularValorLibro(precioUsd, vidaUtil, mesesTranscurridos) {
  const depreciacionMensual = calcularDepreciacionMensual(precioUsd, vidaUtil);
  const depreciacionAcumulada = depreciacionMensual * mesesTranscurridos;
  return Math.max(0, precioUsd - depreciacionAcumulada);
}

export function obtenerResumenActivosDepreciacion() {
  const activos = getActivosDepreciacion();
  const ahora = new Date();
  
  let totalValorOriginalUsd = 0;
  let totalDepreciacionAcumuladaUsd = 0;
  let totalValorLibroUsd = 0;
  
  activos.forEach(activo => {
    const fechaCompra = new Date(activo.fecha);
    const mesesTranscurridos = (ahora.getFullYear() - fechaCompra.getFullYear()) * 12 + 
                               (ahora.getMonth() - fechaCompra.getMonth());
    
    const depreciacionMensual = calcularDepreciacionMensual(activo.precioUsd, activo.vidaUtil);
    const depreciacionAcumulada = depreciacionMensual * mesesTranscurridos;
    const valorLibro = calcularValorLibro(activo.precioUsd, activo.vidaUtil, mesesTranscurridos);
    
    totalValorOriginalUsd += activo.precioUsd;
    totalDepreciacionAcumuladaUsd += depreciacionAcumulada;
    totalValorLibroUsd += valorLibro;
  });
  
  return {
    cantidad: activos.length,
    totalValorOriginalUsd,
    totalDepreciacionAcumuladaUsd,
    totalValorLibroUsd,
    activos
  };
}

// ============================================
// INGRESOS POR FACTURAS DE CLIENTES
// ============================================

export function getIngresos() {
  const data = localStorage.getItem('netcloud_ingresos');
  return data ? JSON.parse(data) : [];
}

export function saveIngresos(ingresos) {
  localStorage.setItem('netcloud_ingresos', JSON.stringify(ingresos));
}

export function agregarIngreso(clienteNombre, montoUsd, montoBS, fecha, numeroFactura, descripcion, observaciones) {
  const nuevoIngreso = {
    id: 'ingreso-' + Date.now(),
    clienteNombre,
    montoUsd: parseFloat(montoUsd),
    montoBS: parseFloat(montoBS),
    fecha,
    numeroFactura,
    descripcion,
    observaciones,
    estado: 'registrado',
    createdAt: new Date().toISOString()
  };
  
  const ingresos = getIngresos();
  ingresos.push(nuevoIngreso);
  saveIngresos(ingresos);
  
  return nuevoIngreso.id;
}

export function eliminarIngreso(ingresoId) {
  const ingresos = getIngresos();
  const filtrados = ingresos.filter(i => i.id !== ingresoId);
  saveIngresos(filtrados);
  return true;
}

export function obtenerResumenIngresos(mes, anio) {
  const ingresos = getIngresos();
  const ingresosMes = ingresos.filter(i => {
    const fecha = new Date(i.fecha);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio;
  });
  
  const totalUsd = ingresosMes.reduce((sum, i) => sum + i.montoUsd, 0);
  const totalBS = ingresosMes.reduce((sum, i) => sum + i.montoBS, 0);
  
  return {
    mes,
    anio,
    cantidad: ingresosMes.length,
    totalUsd,
    totalBS,
    ingresos: ingresosMes
  };
}

export function actualizarEstadoIngreso(ingresoId, nuevoEstado) {
  const ingresos = getIngresos();
  const actualizado = ingresos.map(i => {
    if (i.id === ingresoId) {
      return { ...i, estado: nuevoEstado };
    }
    return i;
  });
  saveIngresos(actualizado);
  return true;
}

export function obtenerIngresosPendientes(mes, anio) {
  const ingresos = getIngresos();
  const ingresosMes = ingresos.filter(i => {
    const fecha = new Date(i.fecha);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio && i.estado === 'pendiente';
  });
  
  const totalUsd = ingresosMes.reduce((sum, i) => sum + i.montoUsd, 0);
  const totalBS = ingresosMes.reduce((sum, i) => sum + i.montoBS, 0);
  
  return {
    mes,
    anio,
    cantidad: ingresosMes.length,
    totalUsd,
    totalBS,
    ingresos: ingresosMes
  };
}
