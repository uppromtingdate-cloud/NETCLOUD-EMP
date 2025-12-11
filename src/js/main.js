// js/main.js
// Dashboard principal que orquesta los plugins Core + Plugins (Auth Local, sin Firebase)

// Importar módulos de plugins
import { renderClientesKanban, setupAddClientForm, renderTimeline, showClienteModal } from '../plugins/crm/crm.js';
import { setupUploadForm } from '../plugins/documentos/documentos.js';
import { setupFacturasForm, renderFacturas, actualizarResumenFacturasUI, eliminarFacturaUI, poblarSelectorClientes, setupGastosEmpresarialesForm, renderGastosEmpresariales, obtenerResumenGastosUI, eliminarGastoEmpresarialUI, setupRefrigeriosForm, renderRefrigerios, obtenerResumenRefrigeriosUI, eliminarRefrigerioUI, setupPagosPersonalForm, renderPagosPersonal, obtenerResumenPagosPersonalUI, eliminarPagoPersonalUI } from '../plugins/finanzas/finanzas-v2.js';
import { setupActivosForm, renderActivos, actualizarResumenActivos, eliminarActivoUI } from '../plugins/activos/activos.js';
import { renderInventario, setupProductoForm } from '../plugins/inventario/inventario.js';
import { getClientes, getEgresos, getDocumentos, getInteracciones } from '../core/storage-utils.js';

// Control de sesión local
function checkAuth() {
  const auth = localStorage.getItem('netcloud_auth');
  if (!auth) {
    window.location.href = 'login.html';
    return null;
  }
  try {
    return JSON.parse(auth);
  } catch (e) {
    window.location.href = 'login.html';
    return null;
  }
}

// Manejo de vistas
function showPanel(panelName) {
  const panels = {
    dashboard: document.getElementById('panel-dashboard'),
    clientes: document.getElementById('panel-clientes'),
    documentos: document.getElementById('panel-documentos'),
    finanzas: document.getElementById('panel-finanzas'),
    inventario: document.getElementById('panel-inventario'),
    activos: document.getElementById('panel-activos')
  };
  
  Object.values(panels).forEach(p => {
    if (p) p.style.display = 'none';
  });
  if (panels[panelName]) panels[panelName].style.display = 'block';
  
  // Mostrar/ocultar botón flotante solo en pestaña Clientes
  const btnAddClientFloat = document.getElementById('btn-add-client-float');
  if (btnAddClientFloat) {
    btnAddClientFloat.style.display = panelName === 'clientes' ? 'flex' : 'none';
  }
  
  // Renderizar inventario cuando se muestra el panel
  if (panelName === 'inventario') {
    renderInventario('inventario-tbody');
  }
  
  // Renderizar finanzas cuando se muestra el panel
  if (panelName === 'finanzas') {
    poblarSelectorClientes();
    actualizarResumenFacturasUI();
    renderFacturas('facturas-list');
    
    const ahora = new Date();
    const mes = ahora.getMonth();
    const anio = ahora.getFullYear();
    
    document.getElementById('gastos-resumen').innerHTML = obtenerResumenGastosUI(mes, anio);
    renderGastosEmpresariales('gastos-empresariales-list');
    
    document.getElementById('refrigerios-resumen').innerHTML = obtenerResumenRefrigeriosUI(mes, anio);
    renderRefrigerios('refrigerios-list');
    
    document.getElementById('pagos-resumen').innerHTML = obtenerResumenPagosPersonalUI(mes, anio);
    renderPagosPersonal('pagos-personal-list');
  }
  
  // Renderizar activos cuando se muestra el panel
  if (panelName === 'activos') {
    actualizarResumenActivos();
    renderActivos('activos-list');
  }
}

// Actualizar resumen de actividades
function updateResumen() {
  const clientes = JSON.parse(localStorage.getItem('netcloud_clientes') || '[]');
  const ingresos = JSON.parse(localStorage.getItem('netcloud_ingresos') || '[]');
  const documentos = JSON.parse(localStorage.getItem('netcloud_documentos') || '[]');
  const interacciones = JSON.parse(localStorage.getItem('netcloud_interacciones') || '[]');
  
  // Total clientes
  document.getElementById('stat-total-clientes').textContent = clientes.length;
  
  // Clientes nuevos
  const clientesNuevos = clientes.filter(c => c.estadoVenta === 'Nuevo').length;
  document.getElementById('stat-clientes-nuevos').textContent = clientesNuevos;
  
  // Ingresos del mes actual (basado en facturas registradas)
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();
  const ingresosMes = ingresos
    .filter(i => {
      const fecha = new Date(i.fecha);
      return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
    })
    .reduce((sum, i) => sum + (parseFloat(i.montoUsd) || 0), 0);
  document.getElementById('stat-egresos-mes').textContent = '$' + ingresosMes.toFixed(2);
  
  // Total documentos
  document.getElementById('stat-documentos').textContent = documentos.length;
  
  // Últimas interacciones
  const ultimasInteracciones = interacciones.slice(-5).reverse();
  const interaccionesHtml = ultimasInteracciones.length > 0
    ? ultimasInteracciones.map(i => `
        <div class="timeline-item">
          <strong>${i.clienteNombre || 'Cliente'}</strong>
          <small>${i.tipo || 'Interacción'}</small>
          <p class="mb-0">${i.descripcion || ''}</p>
          <small class="text-muted">${new Date(i.fecha).toLocaleDateString('es-ES')}</small>
        </div>
      `).join('')
    : '<p class="text-muted">No hay interacciones registradas</p>';
  document.getElementById('ultimas-interacciones').innerHTML = interaccionesHtml;
}

// Inicializar plugins
function initializePlugins() {
  renderClientesKanban('kanban-container', (cliente) => {
    showClienteModal(cliente);
  });
  
  setupAddClientForm('add-client-form', 'add-client-alert', () => {
    renderClientesKanban('kanban-container', (cliente) => {
      showClienteModal(cliente);
    });
    updateResumen();
  });

  setupUploadForm('upload-form', 'upload-alert');
  setupProductoForm('producto-form', 'producto-alert');
  
  setupFacturasForm('facturas-form', 'factura-alert');
  setupGastosEmpresarialesForm('gastos-empresariales-form', 'gasto-alert');
  setupRefrigeriosForm('refrigerios-form', 'refrig-alert');
  setupPagosPersonalForm('pagos-personal-form', 'pago-personal-alert');
  setupActivosForm('activos-form', 'activo-alert');
  
  renderInventario('inventario-tbody');
  updateResumen();
}

// Inicializar cuando DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = checkAuth();
  if (!currentUser) return;
  
  // Mostrar usuario
  const userEmailEl = document.getElementById('user-email');
  const btnLogout = document.getElementById('btn-logout');
  
  if (userEmailEl) {
    userEmailEl.textContent = currentUser.email;
    userEmailEl.style.display = 'block';
  }
  
  if (btnLogout) {
    btnLogout.style.display = 'inline-block';
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('netcloud_auth');
      window.location.href = 'login.html';
    });
  }
  
  // Configurar navegación
  const navInicio = document.getElementById('nav-inicio');
  const navClientes = document.getElementById('nav-clientes');
  const navDocumentos = document.getElementById('nav-documentos');
  const navFinanzas = document.getElementById('nav-finanzas');
  const navInventario = document.getElementById('nav-inventario');
  const navActivos = document.getElementById('nav-activos');
  
  if (navInicio) {
    navInicio.addEventListener('click', (e) => {
      e.preventDefault();
      showPanel('dashboard');
    });
  }
  
  if (navClientes) {
    navClientes.addEventListener('click', (e) => {
      e.preventDefault();
      showPanel('clientes');
    });
  }
  
  if (navDocumentos) {
    navDocumentos.addEventListener('click', (e) => {
      e.preventDefault();
      showPanel('documentos');
    });
  }
  
  if (navFinanzas) {
    navFinanzas.addEventListener('click', (e) => {
      e.preventDefault();
      showPanel('finanzas');
    });
  }
  
  if (navInventario) {
    navInventario.addEventListener('click', (e) => {
      e.preventDefault();
      showPanel('inventario');
    });
  }
  
  if (navActivos) {
    navActivos.addEventListener('click', (e) => {
      e.preventDefault();
      showPanel('activos');
    });
  }
  
  // Botón flotante y botón en header
  const btnAddClientFloat = document.getElementById('btn-add-client-float');
  const btnAddClientHeader = document.getElementById('btn-add-cliente-header');
  const addClientModal = new bootstrap.Modal(document.getElementById('addClientModal'));
  
  const openAddClientModal = (e) => {
    e.preventDefault();
    addClientModal.show();
  };
  
  if (btnAddClientFloat) {
    btnAddClientFloat.addEventListener('click', openAddClientModal);
  }
  
  if (btnAddClientHeader) {
    btnAddClientHeader.addEventListener('click', openAddClientModal);
  }
  
  // Mostrar dashboard por defecto
  showPanel('dashboard');
  
  // Inicializar plugins
  initializePlugins();
});

window.appFunctions = { 
  showPanel, 
  initializePlugins, 
  checkAuth,
  eliminarFactura: eliminarFacturaUI,
  eliminarGasto: eliminarGastoEmpresarialUI,
  eliminarRefrigerio: eliminarRefrigerioUI,
  eliminarPagoPersonal: eliminarPagoPersonalUI,
  eliminarActivo: eliminarActivoUI
};
