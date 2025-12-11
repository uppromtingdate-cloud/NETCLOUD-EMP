// plugins/activos/activos.js
// Módulo Activos: gestión de activos fijos con depreciación contable

import {
  getActivosDepreciacion, saveActivosDepreciacion, agregarActivoDepreciacion, eliminarActivoDepreciacion,
  calcularDepreciacionMensual, calcularValorLibro, obtenerResumenActivosDepreciacion
} from '../../core/storage-utils.js';
import { showAlert } from '../../core/ui-utils.js';

export function setupActivosForm(formId, alertId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('activo-nombre')?.value.trim();
    const precioUsd = document.getElementById('activo-precio-usd')?.value.trim();
    const precioBS = document.getElementById('activo-precio-bs')?.value.trim();
    const fecha = document.getElementById('activo-fecha')?.value;
    const vidaUtil = document.getElementById('activo-vida-util')?.value.trim();
    const factura = document.getElementById('activo-factura')?.value.trim();
    const observaciones = document.getElementById('activo-observaciones')?.value.trim();
    
    if (!nombre) {
      showAlert(alertId, 'danger', 'El nombre del activo es obligatorio.');
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
      showAlert(alertId, 'danger', 'La fecha de compra es obligatoria.');
      return;
    }
    
    if (!vidaUtil || isNaN(parseInt(vidaUtil)) || parseInt(vidaUtil) <= 0) {
      showAlert(alertId, 'danger', 'Ingrese una vida útil válida (en años).');
      return;
    }
    
    try {
      agregarActivoDepreciacion(nombre, precioUsd, precioBS, fecha, vidaUtil, factura, observaciones);
      form.reset();
      showAlert(alertId, 'success', 'Activo registrado correctamente.');
      renderActivos('activos-list');
      actualizarResumenActivos();
    } catch (err) {
      console.error('Error registrando activo:', err);
      showAlert(alertId, 'danger', 'Error registrando activo: ' + (err.message || err));
    }
  });
}

export function renderActivos(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const activos = getActivosDepreciacion();
  const ahora = new Date();
  
  if (activos.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay activos registrados.</p>';
    return;
  }
  
  const html = activos.map(activo => {
    const fechaCompra = new Date(activo.fecha);
    const mesesTranscurridos = (ahora.getFullYear() - fechaCompra.getFullYear()) * 12 + 
                               (ahora.getMonth() - fechaCompra.getMonth());
    
    const depreciacionMensual = calcularDepreciacionMensual(activo.precioUsd, activo.vidaUtil);
    const depreciacionAcumulada = depreciacionMensual * mesesTranscurridos;
    const valorLibro = calcularValorLibro(activo.precioUsd, activo.vidaUtil, mesesTranscurridos);
    const porcentajeDepreciado = ((depreciacionAcumulada / activo.precioUsd) * 100).toFixed(2);
    
    return `
      <div class="card mb-3 p-3">
        <div class="row g-2">
          <div class="col-md-2">
            <strong>${activo.nombre}</strong>
            <small class="d-block text-muted">${new Date(activo.fecha).toLocaleDateString('es-ES')}</small>
            <small class="d-block text-muted">Vida útil: ${activo.vidaUtil} años</small>
          </div>
          <div class="col-md-2">
            <small class="text-muted">Valor Original</small>
            <div>$${activo.precioUsd.toFixed(2)}</div>
            <small class="text-muted">Bs.${activo.precioBS.toFixed(2)}</small>
          </div>
          <div class="col-md-2">
            <small class="text-muted">Depreciación Acumulada</small>
            <div>$${depreciacionAcumulada.toFixed(2)}</div>
            <small class="text-muted">${porcentajeDepreciado}%</small>
          </div>
          <div class="col-md-2">
            <small class="text-muted">Valor en Libros</small>
            <div>$${valorLibro.toFixed(2)}</div>
            <small class="text-muted">Depreciación Mensual: $${depreciacionMensual.toFixed(2)}</small>
          </div>
          <div class="col-md-2">
            <small class="text-muted">Observaciones</small>
            <div class="small">${activo.observaciones || '-'}</div>
          </div>
          <div class="col-md-2 text-end">
            <button class="btn btn-sm btn-danger" onclick="window.appFunctions.eliminarActivo('${activo.id}')">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

export function eliminarActivoUI(activoId) {
  if (confirm('¿Eliminar este activo?')) {
    eliminarActivoDepreciacion(activoId);
    renderActivos('activos-list');
    actualizarResumenActivos();
  }
}

export function actualizarResumenActivos() {
  const resumen = obtenerResumenActivosDepreciacion();
  const container = document.getElementById('activos-resumen');
  
  if (!container) return;
  
  const html = `
    <div class="row g-2 mb-3">
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Cantidad de Activos</small>
          <div class="h5 mb-0">${resumen.cantidad}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Valor Original (USD)</small>
          <div class="h5 mb-0">$${resumen.totalValorOriginalUsd.toFixed(2)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Depreciación Acumulada</small>
          <div class="h5 mb-0">$${resumen.totalDepreciacionAcumuladaUsd.toFixed(2)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-light p-3">
          <small class="text-muted">Valor en Libros Total</small>
          <div class="h5 mb-0">$${resumen.totalValorLibroUsd.toFixed(2)}</div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}
