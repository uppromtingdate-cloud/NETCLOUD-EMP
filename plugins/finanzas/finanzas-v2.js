// plugins/finanzas/finanzas-v2.js
// Módulo Finanzas mejorado: Gastos Empresariales, Refrigerios y Pagos Personal

import {
  getClientes, getIngresos, getEgresos, getGastosEmpresariales, obtenerResumenIngresos, obtenerIngresosPendientes, actualizarEstadoIngreso, eliminarIngreso, saveIngresos, calcularKPIs
} from '../../core/storage-utils.js';
import { showAlert } from '../../core/ui-utils.js';

// ============================================
// GASTOS EMPRESARIALES
// ============================================

export function setupGastosEmpresarialesForm(formId, alertId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('gasto-nombre')?.value.trim();
    const precioUsd = document.getElementById('gasto-precio-usd')?.value.trim();
    const precioBS = document.getElementById('gasto-precio-bs')?.value.trim();
    const fecha = document.getElementById('gasto-fecha')?.value;
    const factura = document.getElementById('gasto-factura')?.value.trim();
    const observaciones = document.getElementById('gasto-observaciones')?.value.trim();
    
    if (!nombre) {
      showAlert(alertId, 'danger', 'El nombre del gasto es obligatorio.');
      return;
    }
    
    if (!precioUsd || isNaN(parseFloat(precioUsd)) || parseFloat(precioUsd) <= 0) {
      showAlert(alertId, 'danger', 'Ingrese un precio en USD válido.');
      return;
    }
    
    if (!precioBS || isNaN(parseFloat(precioBS)) || parseFloat(precioBS) <= 0) {
      showAlert(alertId, 'danger', 'Ingrese un precio en BS válido.');
      return;
    }
    
    if (!fecha) {
      showAlert(alertId, 'danger', 'La fecha es obligatoria.');
      return;
    }
    
    try {
      agregarGastoEmpresarial(nombre, precioUsd, precioBS, fecha, factura, observaciones);
      form.reset();
      showAlert(alertId, 'success', 'Gasto empresarial registrado correctamente.');
      renderGastosEmpresariales('gastos-empresariales-list');
    } catch (err) {
      console.error('Error registrando gasto:', err);
      showAlert(alertId, 'danger', 'Error registrando gasto: ' + (err.message || err));
    }
  });
}

export function renderGastosEmpresariales(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const gastos = getGastosEmpresariales();
  
  if (gastos.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay gastos empresariales registrados.</p>';
    return;
  }
  
  const html = gastos.map(gasto => `
    <div class="card mb-2 p-3">
      <div class="row g-2">
        <div class="col-md-3">
          <strong>${gasto.nombre}</strong>
          <small class="d-block text-muted">${new Date(gasto.fecha).toLocaleDateString('es-ES')}</small>
        </div>
        <div class="col-md-2">
          <small class="text-muted">USD</small>
          <div>$${gasto.precioUsd.toFixed(2)}</div>
        </div>
        <div class="col-md-2">
          <small class="text-muted">BS</small>
          <div>Bs.${gasto.precioBS.toFixed(2)}</div>
        </div>
        <div class="col-md-3">
          <small class="text-muted">Observaciones</small>
          <div class="small">${gasto.observaciones || '-'}</div>
        </div>
        <div class="col-md-2 text-end">
          <button class="btn btn-sm btn-danger" onclick="window.appFunctions.eliminarGasto('${gasto.id}')">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

export function eliminarGastoEmpresarialUI(gastoId) {
  if (confirm('¿Eliminar este gasto?')) {
    eliminarGastoEmpresarial(gastoId);
    renderGastosEmpresariales('gastos-empresariales-list');
  }
}

export function obtenerResumenGastosUI(mes, anio) {
  const resumen = obtenerResumenGastosEmpresariales(mes, anio);
  return `
    <div class="row g-2 mb-3">
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Cantidad</small>
          <div class="h5 mb-0">${resumen.cantidad}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Total USD</small>
          <div class="h5 mb-0">$${resumen.totalUsd.toFixed(2)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Total BS</small>
          <div class="h5 mb-0">Bs.${resumen.totalBS.toFixed(2)}</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// REFRIGERIOS
// ============================================

export function setupRefrigeriosForm(formId, alertId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('refrig-nombre')?.value.trim();
    const precioBS = document.getElementById('refrig-precio-bs')?.value.trim();
    const precioUsd = document.getElementById('refrig-precio-usd')?.value.trim();
    const fecha = document.getElementById('refrig-fecha')?.value;
    const factura = document.getElementById('refrig-factura')?.value.trim();
    const observaciones = document.getElementById('refrig-observaciones')?.value.trim();
    
    if (!nombre) {
      showAlert(alertId, 'danger', 'El nombre del refrigerio es obligatorio.');
      return;
    }
    
    if (!precioBS || isNaN(parseFloat(precioBS)) || parseFloat(precioBS) <= 0) {
      showAlert(alertId, 'danger', 'Ingrese un precio en BS válido.');
      return;
    }
    
    if (!precioUsd || isNaN(parseFloat(precioUsd)) || parseFloat(precioUsd) <= 0) {
      showAlert(alertId, 'danger', 'Ingrese un precio en USD válido.');
      return;
    }
    
    if (!fecha) {
      showAlert(alertId, 'danger', 'La fecha es obligatoria.');
      return;
    }
    
    try {
      agregarRefrigerio(nombre, precioBS, precioUsd, fecha, factura, observaciones);
      form.reset();
      showAlert(alertId, 'success', 'Refrigerio registrado correctamente.');
      renderRefrigerios('refrigerios-list');
    } catch (err) {
      console.error('Error registrando refrigerio:', err);
      showAlert(alertId, 'danger', 'Error registrando refrigerio: ' + (err.message || err));
    }
  });
}

export function renderRefrigerios(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const refrigerios = getRefrigerios();
  
  if (refrigerios.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay refrigerios registrados.</p>';
    return;
  }
  
  const html = refrigerios.map(refrig => `
    <div class="card mb-2 p-3">
      <div class="row g-2">
        <div class="col-md-3">
          <strong>${refrig.nombre}</strong>
          <small class="d-block text-muted">${new Date(refrig.fecha).toLocaleDateString('es-ES')}</small>
        </div>
        <div class="col-md-2">
          <small class="text-muted">BS</small>
          <div>Bs.${refrig.precioBS.toFixed(2)}</div>
        </div>
        <div class="col-md-2">
          <small class="text-muted">USD</small>
          <div>$${refrig.precioUsd.toFixed(2)}</div>
        </div>
        <div class="col-md-3">
          <small class="text-muted">Observaciones</small>
          <div class="small">${refrig.observaciones || '-'}</div>
        </div>
        <div class="col-md-2 text-end">
          <button class="btn btn-sm btn-danger" onclick="window.appFunctions.eliminarRefrigerio('${refrig.id}')">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

export function eliminarRefrigerioUI(refrigerioId) {
  if (confirm('¿Eliminar este refrigerio?')) {
    eliminarRefrigerio(refrigerioId);
    renderRefrigerios('refrigerios-list');
  }
}

export function obtenerResumenRefrigeriosUI(mes, anio) {
  const resumen = obtenerResumenRefrigerios(mes, anio);
  return `
    <div class="row g-2 mb-3">
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Cantidad</small>
          <div class="h5 mb-0">${resumen.cantidad}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Total BS</small>
          <div class="h5 mb-0">Bs.${resumen.totalBS.toFixed(2)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Total USD</small>
          <div class="h5 mb-0">$${resumen.totalUsd.toFixed(2)}</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// PAGOS PERSONAL
// ============================================

export function setupPagosPersonalForm(formId, alertId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('pago-personal-nombre')?.value.trim();
    const montoUsd = document.getElementById('pago-personal-monto-usd')?.value.trim();
    const montoBS = document.getElementById('pago-personal-monto-bs')?.value.trim();
    const fecha = document.getElementById('pago-personal-fecha')?.value;
    const tipoGanancia = document.getElementById('pago-personal-tipo')?.value;
    const rol = document.getElementById('pago-personal-rol')?.value;
    const observaciones = document.getElementById('pago-personal-observaciones')?.value.trim();
    
    if (!nombre) {
      showAlert(alertId, 'danger', 'El nombre es obligatorio.');
      return;
    }
    
    if (!montoUsd || isNaN(parseFloat(montoUsd)) || parseFloat(montoUsd) <= 0) {
      showAlert(alertId, 'danger', 'Ingrese un monto en USD válido.');
      return;
    }
    
    if (!montoBS || isNaN(parseFloat(montoBS)) || parseFloat(montoBS) <= 0) {
      showAlert(alertId, 'danger', 'Ingrese un monto en BS válido.');
      return;
    }
    
    if (!fecha) {
      showAlert(alertId, 'danger', 'La fecha es obligatoria.');
      return;
    }
    
    if (!tipoGanancia) {
      showAlert(alertId, 'danger', 'Seleccione un tipo de ganancia.');
      return;
    }
    
    if (!rol) {
      showAlert(alertId, 'danger', 'Seleccione un rol.');
      return;
    }
    
    try {
      agregarPagoPersonal(nombre, montoUsd, montoBS, fecha, tipoGanancia, rol, observaciones);
      form.reset();
      showAlert(alertId, 'success', 'Pago personal registrado correctamente.');
      renderPagosPersonal('pagos-personal-list');
    } catch (err) {
      console.error('Error registrando pago:', err);
      showAlert(alertId, 'danger', 'Error registrando pago: ' + (err.message || err));
    }
  });
}

export function renderPagosPersonal(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const pagos = getPagosPersonal();
  
  if (pagos.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay pagos personales registrados.</p>';
    return;
  }
  
  const html = pagos.map(pago => `
    <div class="card mb-2 p-3">
      <div class="row g-2">
        <div class="col-md-2">
          <strong>${pago.nombre}</strong>
          <small class="d-block text-muted">${pago.rol}</small>
        </div>
        <div class="col-md-2">
          <small class="text-muted">Fecha</small>
          <div class="small">${new Date(pago.fecha).toLocaleDateString('es-ES')}</div>
        </div>
        <div class="col-md-2">
          <small class="text-muted">Monto USD</small>
          <div>$${pago.montoUsd.toFixed(2)}</div>
        </div>
        <div class="col-md-2">
          <small class="text-muted">Monto BS</small>
          <div>Bs.${pago.montoBS.toFixed(2)}</div>
        </div>
        <div class="col-md-2">
          <small class="text-muted">Tipo</small>
          <div class="small">${pago.tipoGanancia}</div>
        </div>
        <div class="col-md-2 text-end">
          <button class="btn btn-sm btn-danger" onclick="window.appFunctions.eliminarPagoPersonal('${pago.id}')">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

export function eliminarPagoPersonalUI(pagoId) {
  if (confirm('¿Eliminar este pago?')) {
    eliminarPagoPersonal(pagoId);
    renderPagosPersonal('pagos-personal-list');
  }
}

export function obtenerResumenPagosPersonalUI(mes, anio) {
  const resumen = obtenerResumenPagosPersonal(mes, anio);
  const totalCEOs = resumen.pagosPorRol.CEOs.reduce((sum, p) => sum + p.montoUsd, 0);
  const totalEmpleados = resumen.pagosPorRol.Empleados.reduce((sum, p) => sum + p.montoUsd, 0);
  
  return `
    <div class="row g-2 mb-3">
      <div class="col-md-2">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Total Pagos</small>
          <div class="h5 mb-0">${resumen.cantidad}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Total USD</small>
          <div class="h5 mb-0">$${resumen.totalUsd.toFixed(2)}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Total BS</small>
          <div class="h5 mb-0">Bs.${resumen.totalBS.toFixed(2)}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">CEOs</small>
          <div class="h5 mb-0">${resumen.pagosPorRol.CEOs.length}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Empleados</small>
          <div class="h5 mb-0">${resumen.pagosPorRol.Empleados.length}</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// FACTURAS
// ============================================

export function poblarSelectorClientes() {
  const selector = document.getElementById('factura-cliente');
  if (!selector) return;
  
  const clientes = getClientes();
  const opcionesHTML = clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
  selector.innerHTML = '<option value="">Selecciona Cliente</option>' + opcionesHTML;
}

export function setupFacturasForm(formId, alertId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // Manejar cambio de archivo PDF
  const pdfInput = document.getElementById('factura-pdf');
  if (pdfInput) {
    pdfInput.addEventListener('change', (e) => {
      const nombreDiv = document.getElementById('factura-pdf-nombre');
      if (e.target.files[0]) {
        nombreDiv.textContent = e.target.files[0].name;
      } else {
        nombreDiv.textContent = '';
      }
    });
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const clienteId = document.getElementById('factura-cliente')?.value.trim();
    const montoUsd = document.getElementById('factura-monto-usd')?.value.trim();
    const montoBS = document.getElementById('factura-monto-bs')?.value.trim();
    const fecha = document.getElementById('factura-fecha')?.value;
    const numeroFactura = document.getElementById('factura-numero')?.value.trim();
    const descripcion = document.getElementById('factura-descripcion')?.value.trim();
    const observaciones = document.getElementById('factura-observaciones')?.value.trim();
    const estado = document.getElementById('factura-estado')?.value || 'pendiente';
    const pdfFile = document.getElementById('factura-pdf')?.files[0];
    
    if (!clienteId) {
      showAlert(alertId, 'danger', 'Selecciona un cliente.');
      return;
    }
    
    if (!montoUsd || isNaN(parseFloat(montoUsd)) || parseFloat(montoUsd) <= 0) {
      showAlert(alertId, 'danger', 'Ingrese un monto en USD válido.');
      return;
    }
    
    if (!montoBS || isNaN(parseFloat(montoBS)) || parseFloat(montoBS) <= 0) {
      showAlert(alertId, 'danger', 'Ingrese un monto en BS válido.');
      return;
    }
    
    if (!fecha) {
      showAlert(alertId, 'danger', 'La fecha es obligatoria.');
      return;
    }
    
    if (!numeroFactura) {
      showAlert(alertId, 'danger', 'El número de factura es obligatorio.');
      return;
    }
    
    try {
      const clientes = getClientes();
      const cliente = clientes.find(c => c.id === clienteId);
      const clienteNombre = cliente ? cliente.nombre : 'Cliente desconocido';
      
      let rutaPdf = '';
      if (pdfFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          rutaPdf = event.target.result;
          guardarFacturaConPdf(clienteNombre, montoUsd, montoBS, fecha, numeroFactura, descripcion, observaciones, rutaPdf, estado, alertId, form);
        };
        reader.readAsDataURL(pdfFile);
      } else {
        guardarFacturaConPdf(clienteNombre, montoUsd, montoBS, fecha, numeroFactura, descripcion, observaciones, '', estado, alertId, form);
      }
    } catch (err) {
      console.error('Error registrando factura:', err);
      showAlert(alertId, 'danger', 'Error registrando factura: ' + (err.message || err));
    }
  });
}

function guardarFacturaConPdf(clienteNombre, montoUsd, montoBS, fecha, numeroFactura, descripcion, observaciones, rutaPdf, estado, alertId, form) {
  try {
    const ingresos = getIngresos();
    const nuevoIngreso = {
      id: 'ingreso-' + Date.now(),
      clienteNombre,
      montoUsd: parseFloat(montoUsd),
      montoBS: parseFloat(montoBS),
      fecha,
      numeroFactura,
      descripcion,
      observaciones,
      rutaPdf,
      estado: estado || 'pendiente',
      createdAt: new Date().toISOString()
    };
    
    ingresos.push(nuevoIngreso);
    saveIngresos(ingresos);
    
    form.reset();
    poblarSelectorClientes();
    showAlert(alertId, 'success', 'Factura registrada correctamente.');
    renderFacturas('facturas-list');
    actualizarResumenFacturasUI();
  } catch (err) {
    console.error('Error guardando factura:', err);
    showAlert(alertId, 'danger', 'Error guardando factura: ' + (err.message || err));
  }
}

export function renderFacturas(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const ingresos = getIngresos();
  
  if (ingresos.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay facturas registradas.</p>';
    return;
  }
  
  const html = ingresos.map(ingreso => {
    const estadoBadge = ingreso.estado === 'pagado' 
      ? '<span class="badge bg-success">Pagado</span>' 
      : '<span class="badge bg-warning text-dark">Pendiente</span>';
    
    return `
    <div class="card mb-2 p-3">
      <div class="row g-2">
        <div class="col-md-2">
          <strong>${ingreso.clienteNombre}</strong>
          <small class="d-block text-muted">${new Date(ingreso.fecha).toLocaleDateString('es-ES')}</small>
        </div>
        <div class="col-md-1">
          <small class="text-muted">Factura</small>
          <div class="small">${ingreso.numeroFactura}</div>
        </div>
        <div class="col-md-1">
          <small class="text-muted">Monto USD</small>
          <div>$${ingreso.montoUsd.toFixed(2)}</div>
        </div>
        <div class="col-md-1">
          <small class="text-muted">Monto BS</small>
          <div>Bs.${ingreso.montoBS.toFixed(2)}</div>
        </div>
        <div class="col-md-1">
          <small class="text-muted">Estado</small>
          <div>${estadoBadge}</div>
        </div>
        <div class="col-md-2">
          <small class="text-muted">Descripción</small>
          <div class="small">${ingreso.descripcion || '-'}</div>
        </div>
        <div class="col-md-3 text-end">
          <button class="btn btn-sm btn-outline-primary" onclick="window.appFunctions.cambiarEstadoFactura('${ingreso.id}', '${ingreso.estado === 'pagado' ? 'pendiente' : 'pagado'}')">
            <i class="fa fa-check"></i> ${ingreso.estado === 'pagado' ? 'Marcar Pendiente' : 'Marcar Pagado'}
          </button>
          ${ingreso.rutaPdf ? `<button class="btn btn-sm btn-info" onclick="window.open('${ingreso.rutaPdf}', '_blank')"><i class="fa fa-file-pdf"></i></button>` : ''}
          <button class="btn btn-sm btn-danger" onclick="window.appFunctions.eliminarFactura('${ingreso.id}')">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
  
  container.innerHTML = html;
}

export function cambiarEstadoFacturaUI(facturaId, nuevoEstado) {
  actualizarEstadoIngreso(facturaId, nuevoEstado);
  renderFacturas('facturas-list');
  actualizarResumenFacturasUI();
}

export function eliminarFacturaUI(facturaId) {
  if (confirm('¿Eliminar esta factura?')) {
    eliminarIngreso(facturaId);
    renderFacturas('facturas-list');
    actualizarResumenFacturasUI();
  }
}

export function actualizarResumenFacturasUI() {
  const ahora = new Date();
  const mes = ahora.getMonth();
  const anio = ahora.getFullYear();
  const resumen = obtenerResumenIngresos(mes, anio);
  const container = document.getElementById('facturas-resumen');
  
  if (!container) return;
  
  const html = `
    <div class="row g-2 mb-3">
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Cantidad de Facturas</small>
          <div class="h5 mb-0">${resumen.cantidad}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Total Ingresos USD</small>
          <div class="h5 mb-0">$${resumen.totalUsd.toFixed(2)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Total Ingresos BS</small>
          <div class="h5 mb-0">Bs.${resumen.totalBS.toFixed(2)}</div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// ============================================
// WIDGETS PARA DASHBOARD
// ============================================

export function renderResumenFinanciero(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();
  const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
  const anioPasado = mesActual === 0 ? anioActual - 1 : anioActual;
  
  const ingresosMesActual = obtenerResumenIngresos(mesActual, anioActual);
  const ingresosMesPasado = obtenerResumenIngresos(mesPasado, anioPasado);
  const egresosMesActual = getEgresos().filter(e => {
    const fecha = new Date(e.fecha);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
  }).reduce((sum, e) => sum + (parseFloat(e.monto) || 0), 0);
  
  const gastosEmpresariales = getGastosEmpresariales().filter(g => {
    const fecha = new Date(g.fecha);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
  }).reduce((sum, g) => sum + g.precioUsd, 0);
  
  const totalEgresos = egresosMesActual + gastosEmpresariales;
  const balance = ingresosMesActual.totalUsd - totalEgresos;
  const variacion = ingresosMesActual.totalUsd - ingresosMesPasado.totalUsd;
  const variacionPorcentaje = ingresosMesPasado.totalUsd > 0 
    ? ((variacion / ingresosMesPasado.totalUsd) * 100).toFixed(1) 
    : 0;
  
  const diasMes = new Date(anioActual, mesActual + 1, 0).getDate();
  const diaActual = ahora.getDate();
  const diasRestantes = diasMes - diaActual;
  const promedioDiario = diaActual > 0 ? ingresosMesActual.totalUsd / diaActual : 0;
  const proyeccion = promedioDiario * diasMes;
  
  const html = `
    <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
      <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 6px; padding: 8px;">
        <div style="font-size: 10px; color: #666; margin-bottom: 2px;"><i class="fa fa-arrow-up text-success"></i> Ingresos</div>
        <div style="font-size: 14px; font-weight: 700; color: #28a745;">$${ingresosMesActual.totalUsd.toFixed(2)}</div>
        <small style="color: ${variacion >= 0 ? '#28a745' : '#dc3545'}; font-weight: 600; font-size: 9px;">
          ${variacion >= 0 ? '↑' : '↓'} ${Math.abs(variacion).toFixed(2)}
        </small>
      </div>
      <div style="background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); border-radius: 6px; padding: 8px;">
        <div style="font-size: 10px; color: #666; margin-bottom: 2px;"><i class="fa fa-arrow-down text-danger"></i> Egresos</div>
        <div style="font-size: 14px; font-weight: 700; color: #dc3545;">$${totalEgresos.toFixed(2)}</div>
      </div>
      <div style="background: linear-gradient(135deg, #cfe2ff 0%, #b6d4fe 100%); border-radius: 6px; padding: 8px;">
        <div style="font-size: 10px; color: #666; margin-bottom: 2px;"><i class="fa fa-balance-scale text-info"></i> Balance</div>
        <div style="font-size: 14px; font-weight: 700; color: ${balance >= 0 ? '#28a745' : '#dc3545'};">$${balance.toFixed(2)}</div>
      </div>
      <div style="background: linear-gradient(135deg, #e2e3e5 0%, #d3d4d6 100%); border-radius: 6px; padding: 8px;">
        <div style="font-size: 10px; color: #666; margin-bottom: 2px;"><i class="fa fa-chart-pie text-secondary"></i> Proyección</div>
        <div style="font-size: 14px; font-weight: 700; color: #6c757d;">$${proyeccion.toFixed(2)}</div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

export function renderClientesPorCerrar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const clientes = getClientes();
  const clientesPorCerrar = clientes.filter(c => c.estadoVenta === 'Negociación');
  
  if (clientesPorCerrar.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay clientes en negociación.</p>';
    return;
  }
  
  const ahora = new Date();
  const html = clientesPorCerrar.map(cliente => {
    const fechaPrimerContacto = new Date(cliente.fechaPrimerContacto);
    const diasEnNegociacion = Math.floor((ahora - fechaPrimerContacto) / (1000 * 60 * 60 * 24));
    const urgencia = diasEnNegociacion > 30 ? 'danger' : diasEnNegociacion > 15 ? 'warning' : 'info';
    const bgColor = urgencia === 'danger' ? '#ffe5e5' : urgencia === 'warning' ? '#fff3cd' : '#d1ecf1';
    const borderColor = urgencia === 'danger' ? '#f5c6cb' : urgencia === 'warning' ? '#ffeaa7' : '#bee5eb';
    
    return `
      <div style="background: ${bgColor}; border-left: 4px solid ${borderColor}; border-radius: 6px; padding: 10px; margin-bottom: 8px; font-size: 12px;">
        <div style="font-weight: 600; margin-bottom: 4px;">${cliente.nombre}</div>
        <div style="color: #666; font-size: 11px; margin-bottom: 6px;">${cliente.empresa || 'Sin empresa'}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <small style="color: #666;">📅 ${diasEnNegociacion}d</small>
          <span style="background: ${urgencia === 'danger' ? '#dc3545' : urgencia === 'warning' ? '#ffc107' : '#0dcaf0'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
            ${diasEnNegociacion > 30 ? 'Crítico' : diasEnNegociacion > 15 ? 'Atención' : 'Normal'}
          </span>
        </div>
        <button onclick="window.appFunctions.showPanel('clientes')" style="background: #28a745; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; width: 100%;">
          <i class="fa fa-edit"></i> Ver Cliente
        </button>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

export function renderFacturasPendientes(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();
  
  const pendientes = obtenerIngresosPendientes(mesActual, anioActual);
  
  if (pendientes.cantidad === 0) {
    container.innerHTML = '<p class="text-success"><i class="fa fa-check-circle"></i> Todas las facturas están pagadas.</p>';
    return;
  }
  
  const html = `
    <div style="background: #fff8e1; border-radius: 6px; padding: 8px; margin-bottom: 8px; border: 1px solid #ffe082;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <div>
          <div style="font-size: 11px; color: #666; margin-bottom: 2px;">Pendientes por cobrar</div>
          <div style="font-size: 16px; font-weight: 700; color: #f57c00;">$${pendientes.totalUsd.toFixed(2)}</div>
          <div style="font-size: 10px; color: #999;">${pendientes.cantidad} factura(s)</div>
        </div>
        <div style="display: flex; gap: 4px;">
          <button onclick="window.appFunctions.showPanel('finanzas')" style="background: #007bff; color: white; border: none; padding: 6px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: 600;">
            + Agregar
          </button>
        </div>
      </div>
      <div style="border-top: 1px solid #ffe082; padding-top: 6px;">
        ${pendientes.ingresos.slice(0, 3).map(factura => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #f5f5f5; font-size: 10px;">
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #333;">${factura.clienteNombre}</div>
              <div style="color: #999; font-size: 9px;">Fact. #${factura.numeroFactura}</div>
            </div>
            <div style="text-align: right; margin-right: 6px;">
              <div style="font-weight: 600; color: #f57c00;">$${factura.montoUsd.toFixed(2)}</div>
            </div>
            <button onclick="window.appFunctions.cambiarEstadoFactura('${factura.id}', 'pagado')" style="background: #28a745; color: white; border: none; padding: 3px 6px; border-radius: 3px; font-size: 9px; cursor: pointer; white-space: nowrap;">
              ✓ Pagar
            </button>
          </div>
        `).join('')}
        ${pendientes.ingresos.length > 3 ? `<div style="text-align: center; padding: 4px 0; font-size: 10px; color: #007bff; cursor: pointer;" onclick="window.appFunctions.showPanel('finanzas')">Ver todas (${pendientes.ingresos.length})</div>` : ''}
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

export function renderKPIs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const kpis = calcularKPIs();
  
  const html = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px;">
      <div style="background: #e7f3ff; border-radius: 6px; padding: 6px; border-left: 3px solid #0066cc;">
        <div style="color: #666; font-size: 10px; margin-bottom: 2px;">Tasa Conversión</div>
        <div style="font-size: 16px; font-weight: 700; color: #0066cc;">${kpis.tasaConversion}%</div>
        <small style="color: #666; font-size: 9px;">${kpis.clientesPorEstado.cerradoGanado}/${kpis.totalClientes}</small>
      </div>
      
      <div style="background: #fff3e0; border-radius: 6px; padding: 6px; border-left: 3px solid #ff9800;">
        <div style="color: #666; font-size: 10px; margin-bottom: 2px;">Días Promedio</div>
        <div style="font-size: 16px; font-weight: 700; color: #ff9800;">${kpis.diasPromedio}d</div>
        <small style="color: #666; font-size: 9px;">${kpis.clientesPorEstado.negociacion} clientes</small>
      </div>
      
      <div style="background: #f0f4ff; border-radius: 6px; padding: 6px; border-left: 3px solid #6366f1;">
        <div style="color: #666; font-size: 10px; margin-bottom: 2px;">Tasa Cobranza</div>
        <div style="font-size: 16px; font-weight: 700; color: #6366f1;">${kpis.tasaCobranza}%</div>
        <small style="color: #666; font-size: 9px;">${kpis.facturasPagadas}/${kpis.totalFacturas}</small>
      </div>
      
      <div style="background: #f3e5f5; border-radius: 6px; padding: 6px; border-left: 3px solid #9c27b0;">
        <div style="color: #666; font-size: 10px; margin-bottom: 2px;">Clientes Activos</div>
        <div style="font-size: 16px; font-weight: 700; color: #9c27b0;">${kpis.totalClientes}</div>
        <small style="color: #666; font-size: 9px;">Total</small>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

export function renderAlertas(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const clientes = getClientes();
  const ingresos = getIngresos();
  const ahora = new Date();
  
  const alertas = [];
  
  // Alertas de clientes críticos
  clientes.forEach(cliente => {
    if (cliente.estadoVenta === 'Negociación') {
      const fechaPrimerContacto = new Date(cliente.fechaPrimerContacto);
      const diasEnNegociacion = Math.floor((ahora - fechaPrimerContacto) / (1000 * 60 * 60 * 24));
      if (diasEnNegociacion > 30) {
        alertas.push({
          tipo: 'critico',
          icono: '🔴',
          titulo: `Cliente Crítico: ${cliente.nombre}`,
          descripcion: `En negociación ${diasEnNegociacion} días`,
          color: '#dc3545'
        });
      }
    }
  });
  
  // Alertas de facturas pendientes
  const pendientes = ingresos.filter(i => i.estado === 'pendiente');
  if (pendientes.length > 0) {
    const totalPendiente = pendientes.reduce((sum, i) => sum + i.montoUsd, 0);
    alertas.push({
      tipo: 'advertencia',
      icono: '⚠️',
      titulo: `${pendientes.length} Factura(s) Pendiente(s)`,
      descripcion: `Total por cobrar: $${totalPendiente.toFixed(2)}`,
      color: '#ffc107'
    });
  }
  
  if (alertas.length === 0) {
    container.innerHTML = '<p style="color: #28a745; font-size: 12px;"><i class="fa fa-check-circle"></i> Todo está en orden</p>';
    return;
  }
  
  const html = alertas.map(alerta => `
    <div style="background: ${alerta.color}20; border-left: 4px solid ${alerta.color}; border-radius: 6px; padding: 10px; margin-bottom: 8px; font-size: 12px;">
      <div style="font-weight: 600; color: ${alerta.color}; margin-bottom: 2px;">${alerta.icono} ${alerta.titulo}</div>
      <small style="color: #666;">${alerta.descripcion}</small>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

export function renderGraficoIngresoEgreso(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();
  
  const ingresosMesActual = obtenerResumenIngresos(mesActual, anioActual);
  const egresosMesActual = getEgresos().filter(e => {
    const fecha = new Date(e.fecha);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
  }).reduce((sum, e) => sum + (parseFloat(e.monto) || 0), 0);
  
  const gastosEmpresariales = getGastosEmpresariales().filter(g => {
    const fecha = new Date(g.fecha);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
  }).reduce((sum, g) => sum + g.precioUsd, 0);
  
  const totalEgresos = egresosMesActual + gastosEmpresariales;
  
  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);
  
  setTimeout(() => {
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Ingresos', 'Egresos'],
        datasets: [{
          label: 'USD',
          data: [ingresosMesActual.totalUsd, totalEgresos],
          backgroundColor: ['#28a745', '#dc3545'],
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }, 100);
}

export function renderGraficoClientesPorEstado(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const kpis = calcularKPIs();
  const estados = kpis.clientesPorEstado;
  
  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);
  
  setTimeout(() => {
    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Nuevo', 'Propuesta', 'Negociación', 'Ganado', 'Perdido'],
        datasets: [{
          data: [estados.nuevo, estados.propuesta, estados.negociacion, estados.cerradoGanado, estados.cerradoPerdido],
          backgroundColor: ['#0dcaf0', '#ffc107', '#17a2b8', '#28a745', '#dc3545'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 } } }
        }
      }
    });
  }, 100);
}

export function renderGraficoFacturas(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const kpis = calcularKPIs();
  
  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);
  
  setTimeout(() => {
    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Pagadas', 'Pendientes'],
        datasets: [{
          data: [kpis.facturasPagadas, kpis.facturasPendientes],
          backgroundColor: ['#28a745', '#ffc107'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 } } }
        }
      }
    });
  }, 100);
}
