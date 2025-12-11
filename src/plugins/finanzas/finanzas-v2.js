// plugins/finanzas/finanzas-v2.js
// Módulo Finanzas mejorado: Gastos Empresariales, Refrigerios y Pagos Personal

import {
  getGastosEmpresariales, saveGastosEmpresariales, agregarGastoEmpresarial, eliminarGastoEmpresarial, obtenerResumenGastosEmpresariales,
  getRefrigerios, saveRefrigerios, agregarRefrigerio, eliminarRefrigerio, obtenerResumenRefrigerios,
  getPagosPersonal, savePagosPersonal, agregarPagoPersonal, eliminarPagoPersonal, obtenerResumenPagosPersonal,
  getIngresos, saveIngresos, agregarIngreso, eliminarIngreso, obtenerResumenIngresos,
  getClientes
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
          guardarFacturaConPdf(clienteNombre, montoUsd, montoBS, fecha, numeroFactura, descripcion, observaciones, rutaPdf, alertId, form);
        };
        reader.readAsDataURL(pdfFile);
      } else {
        guardarFacturaConPdf(clienteNombre, montoUsd, montoBS, fecha, numeroFactura, descripcion, observaciones, '', alertId, form);
      }
    } catch (err) {
      console.error('Error registrando factura:', err);
      showAlert(alertId, 'danger', 'Error registrando factura: ' + (err.message || err));
    }
  });
}

function guardarFacturaConPdf(clienteNombre, montoUsd, montoBS, fecha, numeroFactura, descripcion, observaciones, rutaPdf, alertId, form) {
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
      estado: 'registrado',
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
  
  const html = ingresos.map(ingreso => `
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
        <div class="col-md-2">
          <small class="text-muted">Descripción</small>
          <div class="small">${ingreso.descripcion || '-'}</div>
        </div>
        <div class="col-md-2">
          <small class="text-muted">Observaciones</small>
          <div class="small">${ingreso.observaciones || '-'}</div>
        </div>
        <div class="col-md-2 text-end">
          ${ingreso.rutaPdf ? `<button class="btn btn-sm btn-info" onclick="window.open('${ingreso.rutaPdf}', '_blank')"><i class="fa fa-file-pdf"></i> Ver PDF</button>` : '<span class="text-muted small">Sin PDF</span>'}
          <button class="btn btn-sm btn-danger" onclick="window.appFunctions.eliminarFactura('${ingreso.id}')">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
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
