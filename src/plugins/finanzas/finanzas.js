// plugins/finanzas/finanzas.js
// Módulo Finanzas: gestión de gastos, ingresos recurrentes, pagos e inventario (localStorage)

import { 
  getEgresos, saveEgresos, getActivos, saveActivos, 
  getClientes, saveClientes, getPagos, savePagos, 
  getPaquetes, getInventario, saveInventario,
  validarPago, validarProducto, calcularProximoPago, calcularResumenFinanzas
} from '../../core/storage-utils.js';
import { showAlert } from '../../core/ui-utils.js';

// agregarEgreso: registra un nuevo egreso en localStorage
export function agregarEgreso(tipo, descripcion, monto){
  const nuevoEgreso = {
    id: 'egreso-' + Date.now(),
    tipo,
    descripcion,
    monto: parseFloat(monto),
    fecha: new Date().toISOString()
  };
  
  const egresos = getEgresos();
  egresos.push(nuevoEgreso);
  saveEgresos(egresos);
  
  return nuevoEgreso.id;
}

// setupEgresoForm: configura el formulario de egresos
export function setupEgresoForm(formId, alertId){
  const egresoForm = document.getElementById(formId);
  if (!egresoForm) return;
  
  egresoForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const tipo = document.getElementById('egreso-tipo').value.trim();
    const descripcion = document.getElementById('egreso-descripcion').value.trim();
    const montoVal = document.getElementById('egreso-monto').value.trim();
    const monto = parseFloat(montoVal);

    if(!tipo){ showAlert(alertId,'danger','El tipo de egreso es obligatorio.'); return }
    if(!montoVal || isNaN(monto) || monto <= 0){ showAlert(alertId,'danger','Ingrese un monto válido mayor que 0.'); return }

    try{
      agregarEgreso(tipo, descripcion, monto);
      egresoForm.reset();
      showAlert(alertId,'success','Egreso registrado correctamente.');
    }catch(err){
      console.error('Error registrando egreso', err);
      showAlert(alertId,'danger','Error registrando egreso: ' + (err.message||err));
    }
  });
}

// calcularDepreciacion: calcula la depreciación anual usando método de línea recta
export function calcularDepreciacion(activoId){
  try{
    const activos = getActivos();
    const activo = activos.find(a => a.id === activoId);
    
    if(!activo) throw new Error('Activo no encontrado');
    
    const costo = parseFloat(activo.costo) || 0;
    const vida = parseFloat(activo.vidaUtilEstimada) || 1;
    const D = (costo - 0) / vida; // Valor Residual = 0
    return D; // depreciación anual
  }catch(err){
    console.error('Error calculando depreciación', err);
    throw err;
  }
}

// ============================================
// FASE 1: INGRESOS RECURRENTES Y PAGOS
// ============================================

/**
 * Registra un pago de cliente con historial
 * @param {string} clienteId - ID del cliente
 * @param {number} monto - Monto del pago
 * @param {string} factura - URL o ID de la factura
 * @returns {object} Pago registrado
 */
export function registrarPago(clienteId, monto, factura = '') {
  try {
    if (!validarPago({ clienteId, monto, fecha: new Date().toISOString() })) {
      throw new Error('Datos de pago inválidos');
    }
    
    const pago = {
      id: 'pago-' + Date.now(),
      clienteId,
      monto: parseFloat(monto),
      fecha: new Date().toISOString(),
      estado: 'pagado',
      factura,
      metodo: 'transferencia'
    };
    
    const pagos = getPagos();
    pagos.push(pago);
    savePagos(pagos);
    
    // Actualizar próximo pago del cliente
    const clientes = getClientes();
    const cliente = clientes.find(c => c.id === clienteId);
    if (cliente && cliente.suscripcion) {
      cliente.suscripcion.fechaProximoPago = calcularProximoPago(
        pago.fecha,
        cliente.suscripcion.frecuencia
      );
      saveClientes(clientes);
    }
    
    return pago;
  } catch (err) {
    console.error('Error registrando pago:', err);
    throw err;
  }
}

/**
 * Obtiene historial de pagos de un cliente
 * @param {string} clienteId - ID del cliente
 * @returns {array} Historial de pagos
 */
export function obtenerHistorialPagos(clienteId) {
  const pagos = getPagos();
  return pagos.filter(p => p.clienteId === clienteId).sort((a, b) => 
    new Date(b.fecha) - new Date(a.fecha)
  );
}

/**
 * Obtiene resumen de finanzas para un mes específico
 * @param {number} mes - Mes (0-11)
 * @param {number} anio - Año
 * @returns {object} Resumen con ingresos, egresos y balance
 */
export function obtenerResumenMensual(mes, anio) {
  return calcularResumenFinanzas(mes, anio);
}

// ============================================
// FASE 2: INVENTARIO (PRODUCTOS/SERVICIOS)
// ============================================

/**
 * Agrega un nuevo producto/servicio al inventario
 * @param {object} producto - Datos del producto
 * @returns {string} ID del producto creado
 */
export function agregarProducto(producto) {
  try {
    if (!validarProducto(producto)) {
      throw new Error('Datos de producto inválidos');
    }
    
    const nuevoProducto = {
      id: 'producto-' + Date.now(),
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      tipo: producto.tipo, // 'producto' o 'servicio'
      precio: parseFloat(producto.precio),
      costo: parseFloat(producto.costo) || 0,
      cantidad: producto.cantidad || 0,
      unidad: producto.unidad || 'unidad',
      categoria: producto.categoria || 'General',
      estado: 'activo',
      sku: producto.sku || '',
      notas: producto.notas || ''
    };
    
    const inventario = getInventario();
    inventario.push(nuevoProducto);
    saveInventario(inventario);
    
    return nuevoProducto.id;
  } catch (err) {
    console.error('Error agregando producto:', err);
    throw err;
  }
}

/**
 * Obtiene todos los productos/servicios del inventario
 * @returns {array} Lista de productos
 */
export function obtenerInventario() {
  return getInventario();
}

/**
 * Actualiza un producto del inventario
 * @param {string} productoId - ID del producto
 * @param {object} datos - Datos a actualizar
 * @returns {boolean} Éxito de la operación
 */
export function actualizarProducto(productoId, datos) {
  try {
    const inventario = getInventario();
    const indice = inventario.findIndex(p => p.id === productoId);
    
    if (indice === -1) throw new Error('Producto no encontrado');
    
    inventario[indice] = { ...inventario[indice], ...datos };
    saveInventario(inventario);
    
    return true;
  } catch (err) {
    console.error('Error actualizando producto:', err);
    throw err;
  }
}

/**
 * Elimina un producto del inventario
 * @param {string} productoId - ID del producto
 * @returns {boolean} Éxito de la operación
 */
export function eliminarProducto(productoId) {
  try {
    const inventario = getInventario();
    const filtrado = inventario.filter(p => p.id !== productoId);
    saveInventario(filtrado);
    return true;
  } catch (err) {
    console.error('Error eliminando producto:', err);
    throw err;
  }
}

// ============================================
// FASE 3: INTEGRACIÓN COMPLETA Y REPORTES
// ============================================

/**
 * Obtiene composición de un paquete (qué productos incluye)
 * @param {string} paqueteId - ID del paquete
 * @returns {array} Productos incluidos en el paquete
 */
export function obtenerProductosPaquete(paqueteId) {
  const inventario = getInventario();
  return inventario.filter(p => p.paqueteId === paqueteId);
}

/**
 * Calcula margen de ganancia de un producto
 * @param {string} productoId - ID del producto
 * @returns {object} Costo, precio y margen
 */
export function calcularMargenProducto(productoId) {
  try {
    const inventario = getInventario();
    const producto = inventario.find(p => p.id === productoId);
    
    if (!producto) throw new Error('Producto no encontrado');
    
    const costo = parseFloat(producto.costo) || 0;
    const precio = parseFloat(producto.precio) || 0;
    const margen = precio - costo;
    const porcentaje = costo > 0 ? (margen / costo) * 100 : 0;
    
    return {
      costo,
      precio,
      margen,
      porcentajemargen: porcentaje.toFixed(2)
    };
  } catch (err) {
    console.error('Error calculando margen:', err);
    throw err;
  }
}

/**
 * Obtiene reporte completo de finanzas
 * @param {number} mes - Mes (0-11)
 * @param {number} anio - Año
 * @returns {object} Reporte detallado
 */
export function obtenerReporteFinanzas(mes, anio) {
  try {
    const resumen = calcularResumenFinanzas(mes, anio);
    const pagos = getPagos().filter(p => {
      const fecha = new Date(p.fecha);
      return fecha.getMonth() === mes && fecha.getFullYear() === anio;
    });
    
    const clientes = getClientes();
    const clientesActivos = clientes.filter(c => c.suscripcion?.estado === 'activo').length;
    
    const inventario = getInventario();
    const ingresosPotenciales = clientes
      .filter(c => c.suscripcion?.estado === 'activo')
      .reduce((sum, c) => sum + (c.suscripcion?.precio || 0), 0);
    
    return {
      periodo: { mes, anio },
      resumen,
      pagos,
      clientesActivos,
      ingresosPotenciales,
      productosInventario: inventario.length,
      tasa_cobranza: pagos.length > 0 ? ((resumen.ingresos / ingresosPotenciales) * 100).toFixed(2) : 0
    };
  } catch (err) {
    console.error('Error generando reporte:', err);
    throw err;
  }
}

/**
 * Obtiene productos con stock bajo
 * @param {number} umbral - Cantidad mínima
 * @returns {array} Productos con stock bajo
 */
export function obtenerProductosStockBajo(umbral = 10) {
  const inventario = getInventario();
  return inventario.filter(p => p.tipo === 'producto' && p.cantidad <= umbral);
}

/**
 * Obtiene valor total del inventario
 * @returns {number} Valor total
 */
export function obtenerValorInventario() {
  const inventario = getInventario();
  return inventario.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
}

