// main-simple.js - Dashboard principal

console.log('=== INICIANDO DASHBOARD ===');

// ============ FUNCIONES DE ALMACENAMIENTO ============

function getClientes() {
  return JSON.parse(localStorage.getItem('netcloud_clientes') || '[]');
}

function saveClientes(clientes) {
  localStorage.setItem('netcloud_clientes', JSON.stringify(clientes));
}

function getInteracciones() {
  return JSON.parse(localStorage.getItem('netcloud_interacciones') || '[]');
}

function saveInteracciones(interacciones) {
  localStorage.setItem('netcloud_interacciones', JSON.stringify(interacciones));
}

function getEgresos() {
  return JSON.parse(localStorage.getItem('netcloud_egresos') || '[]');
}

function saveEgresos(egresos) {
  localStorage.setItem('netcloud_egresos', JSON.stringify(egresos));
}

function getDocumentos() {
  return JSON.parse(localStorage.getItem('netcloud_documentos') || '[]');
}

function saveDocumentos(documentos) {
  localStorage.setItem('netcloud_documentos', JSON.stringify(documentos));
}

// ============ UTILIDADES ============

function showAlert(containerId, type, message, timeout = 5000) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const alertId = 'alert-' + Date.now();
  container.innerHTML = `<div id="${alertId}" class="alert alert-${type}" role="alert">${message}</div>`;
  if (timeout > 0) {
    setTimeout(() => {
      const el = document.getElementById(alertId);
      if (el) el.remove();
    }, timeout);
  }
}

// Verificar autenticación
function checkAuth() {
  const auth = localStorage.getItem('netcloud_auth');
  if (!auth) {
    console.log('No auth found, redirecting to login');
    window.location.href = 'login.html';
    return null;
  }
  try {
    return JSON.parse(auth);
  } catch (e) {
    console.log('Auth parse error', e);
    window.location.href = 'login.html';
    return null;
  }
}

// ============ FUNCIONES DE NEGOCIO ============

// Actualizar resumen de actividades
function updateResumen() {
  const clientes = getClientes();
  const egresos = getEgresos();
  const documentos = getDocumentos();
  const interacciones = getInteracciones();
  
  document.getElementById('stat-total-clientes').textContent = clientes.length;
  
  const clientesNuevos = clientes.filter(c => c.estadoVenta === 'Nuevo').length;
  document.getElementById('stat-clientes-nuevos').textContent = clientesNuevos;
  
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();
  const egresosMes = egresos
    .filter(e => {
      const fecha = new Date(e.fecha);
      return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
    })
    .reduce((sum, e) => sum + (parseFloat(e.monto) || 0), 0);
  document.getElementById('stat-egresos-mes').textContent = '$' + egresosMes.toFixed(2);
  
  document.getElementById('stat-documentos').textContent = documentos.length;
  
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

// Renderizar Kanban de clientes - Minimalista
function renderKanban() {
  const clientes = getClientes();
  const kanbanContainer = document.getElementById('kanban-container');
  if (!kanbanContainer) return;
  
  const estados = ['Nuevo', 'Propuesta enviada', 'Negociación', 'Cerrado - Ganado', 'Cerrado - Perdido'];
  const colores = {
    'Nuevo': '#d4edda',
    'Propuesta enviada': '#fff3cd',
    'Negociación': '#d1ecf1',
    'Cerrado - Ganado': '#c8e6c9',
    'Cerrado - Perdido': '#ffccbc'
  };
  
  kanbanContainer.innerHTML = '';
  
  estados.forEach(estado => {
    const clientesEstado = clientes.filter(c => c.estadoVenta === estado);
    
    // Contenedor de la columna
    const columna = document.createElement('div');
    columna.style.flex = '0 0 auto';
    columna.style.minWidth = '200px';
    
    // Título del estado
    const titulo = document.createElement('div');
    titulo.style.backgroundColor = colores[estado];
    titulo.style.padding = '8px 12px';
    titulo.style.borderRadius = '4px 4px 0 0';
    titulo.style.fontWeight = 'bold';
    titulo.style.fontSize = '13px';
    titulo.style.marginBottom = '8px';
    titulo.innerHTML = `${estado} <span style="float: right; font-weight: normal; font-size: 12px;">(${clientesEstado.length})</span>`;
    columna.appendChild(titulo);
    
    // Contenedor de cards
    const cardContainer = document.createElement('div');
    cardContainer.style.display = 'flex';
    cardContainer.style.flexDirection = 'column';
    cardContainer.style.gap = '8px';
    
    clientesEstado.forEach(cliente => {
      const card = document.createElement('div');
      card.style.backgroundColor = colores[estado];
      card.style.borderRadius = '4px';
      card.style.padding = '10px';
      card.style.cursor = 'pointer';
      card.style.border = '1px solid rgba(0,0,0,0.1)';
      card.style.transition = 'all 0.2s';
      card.innerHTML = `
        <div style="font-weight: 600; font-size: 13px; color: #333; margin-bottom: 4px;">${cliente.nombre}</div>
        <div style="font-size: 11px; color: #666;">${cliente.empresa || ''}</div>
      `;
      
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        card.style.transform = 'translateY(-1px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = 'none';
        card.style.transform = 'translateY(0)';
      });
      
      card.addEventListener('click', () => {
        openEditClienteModal(cliente);
      });
      
      cardContainer.appendChild(card);
    });
    
    columna.appendChild(cardContainer);
    kanbanContainer.appendChild(columna);
  });
  
  // Hacer el contenedor scrollable horizontalmente
  kanbanContainer.style.display = 'flex';
  kanbanContainer.style.gap = '15px';
  kanbanContainer.style.overflowX = 'auto';
}

// Renderizar documentos corporativos
function renderDocumentosCorporativos() {
  const documentos = getDocumentos().filter(d => d.clienteId === null);
  const docsContainer = document.getElementById('docs-container');
  if (!docsContainer) return;
  
  if (documentos.length === 0) {
    docsContainer.innerHTML = '<p class="text-muted small">No hay documentos corporativos cargados</p>';
    return;
  }
  
  const tiposColores = {
    'Política': '#e7f3ff',
    'Branding': '#fff3e0',
    'Manual': '#f3e5f5',
    'Procedimiento': '#e8f5e9',
    'Otro': '#f5f5f5'
  };
  
  docsContainer.innerHTML = documentos.map(doc => `
    <div class="card mb-2 p-3" style="background-color: ${tiposColores[doc.tipoDoc] || '#f5f5f5'}; border: 1px solid #ddd;">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <strong>${doc.fileName}</strong>
          <br>
          <small class="text-muted">${doc.tipoDoc} • ${new Date(doc.fechaRegistro).toLocaleDateString('es-ES')}</small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarDocumento('${doc.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

// Eliminar documento
function eliminarDocumento(docId) {
  if (!confirm('¿Eliminar este documento?')) return;
  
  let documentos = getDocumentos();
  documentos = documentos.filter(d => d.id !== docId);
  saveDocumentos(documentos);
  
  renderDocumentosCorporativos();
  updateResumen();
}

// Abrir modal para editar cliente
function openEditClienteModal(cliente) {
  const modalBody = document.getElementById('editClienteModalBody');
  if (!modalBody) return;
  
  const documentos = getDocumentos().filter(d => d.clienteId === cliente.id && d.tipoDoc === 'Factura');
  
  modalBody.innerHTML = `
    <form id="form-editar-cliente" class="row g-3">
      <div class="col-12">
        <label class="form-label small">Nombre</label>
        <input type="text" id="edit-nombre" class="form-control form-control-sm" value="${cliente.nombre}" required />
      </div>
      <div class="col-12">
        <label class="form-label small">Empresa</label>
        <input type="text" id="edit-empresa" class="form-control form-control-sm" value="${cliente.empresa || ''}" />
      </div>
      <div class="col-12">
        <label class="form-label small">Email</label>
        <input type="email" id="edit-email" class="form-control form-control-sm" value="${cliente.email || ''}" />
      </div>
      <div class="col-12">
        <label class="form-label small">Teléfono</label>
        <input type="text" id="edit-telefono" class="form-control form-control-sm" value="${cliente.telefono || ''}" />
      </div>
      <div class="col-12">
        <label class="form-label small">Estado</label>
        <select id="edit-estado" class="form-select form-select-sm">
          <option value="Nuevo" ${cliente.estadoVenta === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
          <option value="Propuesta enviada" ${cliente.estadoVenta === 'Propuesta enviada' ? 'selected' : ''}>Propuesta enviada</option>
          <option value="Negociación" ${cliente.estadoVenta === 'Negociación' ? 'selected' : ''}>Negociación</option>
          <option value="Cerrado - Ganado" ${cliente.estadoVenta === 'Cerrado - Ganado' ? 'selected' : ''}>Cerrado - Ganado</option>
          <option value="Cerrado - Perdido" ${cliente.estadoVenta === 'Cerrado - Perdido' ? 'selected' : ''}>Cerrado - Perdido</option>
        </select>
      </div>
    </form>
    
    <hr>
    
    <div class="mt-3">
      <h6>Cargar Factura</h6>
      <form id="form-cargar-factura" class="row g-2">
        <div class="col-12">
          <input type="file" id="input-factura" class="form-control form-control-sm" accept=".pdf,.jpg,.png,.doc,.docx" />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-brand btn-sm w-100">Cargar Factura</button>
        </div>
      </form>
      <div id="alert-factura" class="mt-2"></div>
    </div>
    
    <div class="mt-3">
      <h6>Historial de Facturas</h6>
      <div id="lista-facturas">
        ${documentos.length > 0 
          ? documentos.map(doc => `
              <div class="card card-body mb-2 p-2">
                <small><strong>${doc.fileName}</strong></small>
                <small class="text-muted">${new Date(doc.fechaRegistro).toLocaleDateString('es-ES')}</small>
              </div>
            `).join('')
          : '<p class="text-muted small">No hay facturas cargadas</p>'
        }
      </div>
    </div>
  `;
  
  // Guardar cambios del cliente
  const formEditarCliente = document.getElementById('form-editar-cliente');
  if (formEditarCliente) {
    formEditarCliente.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }
  
  // Cargar factura
  const formCargarFactura = document.getElementById('form-cargar-factura');
  if (formCargarFactura) {
    formCargarFactura.addEventListener('submit', (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('input-factura');
      const file = fileInput.files && fileInput.files[0];
      
      if (!file) {
        showAlert('alert-factura', 'danger', 'Seleccione un archivo');
        return;
      }
      
      const nuevoDoc = {
        id: 'doc-' + Date.now(),
        clienteId: cliente.id,
        tipoDoc: 'Factura',
        fileName: file.name,
        fileSize: file.size,
        fechaRegistro: new Date().toISOString()
      };
      
      const documentos = getDocumentos();
      documentos.push(nuevoDoc);
      saveDocumentos(documentos);
      
      formCargarFactura.reset();
      showAlert('alert-factura', 'success', 'Factura cargada correctamente');
      updateResumen();
      
      setTimeout(() => openEditClienteModal(cliente), 1500);
    });
  }
  
  // Mostrar modal
  const editClienteModal = new bootstrap.Modal(document.getElementById('editClienteModal'));
  document.getElementById('editClienteModalTitle').textContent = cliente.nombre;
  editClienteModal.show();
  
  // Guardar cambios al cerrar modal
  document.getElementById('editClienteModal').addEventListener('hidden.bs.modal', () => {
    const nombre = document.getElementById('edit-nombre').value.trim();
    const empresa = document.getElementById('edit-empresa').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const telefono = document.getElementById('edit-telefono').value.trim();
    const estadoVenta = document.getElementById('edit-estado').value;
    
    if (nombre && (nombre !== cliente.nombre || empresa !== cliente.empresa || email !== cliente.email || telefono !== cliente.telefono || estadoVenta !== cliente.estadoVenta)) {
      let clientes = getClientes();
      const index = clientes.findIndex(c => c.id === cliente.id);
      if (index !== -1) {
        clientes[index] = { ...clientes[index], nombre, empresa, email, telefono, estadoVenta };
        saveClientes(clientes);
        renderKanban();
        updateResumen();
      }
    }
  }, { once: true });
}

// Abrir modal del cliente con facturas (antiguo)
function openClienteModal(cliente) {
  const documentos = getDocumentos().filter(d => d.clienteId === cliente.id && d.tipoDoc === 'Factura');
  
  const modalBody = document.getElementById('clienteModalBody');
  if (!modalBody) return;
  
  modalBody.innerHTML = `
    <div class="mb-3">
      <h5>${cliente.nombre}</h5>
      <p class="mb-1"><strong>Empresa:</strong> ${cliente.empresa || 'N/A'}</p>
      <p class="mb-1"><strong>Email:</strong> ${cliente.email || 'N/A'}</p>
      <p class="mb-3"><strong>Teléfono:</strong> ${cliente.telefono || 'N/A'}</p>
    </div>
    
    <div class="mb-3">
      <h6>Cargar Factura</h6>
      <form id="form-cargar-factura" class="row g-2">
        <div class="col-12">
          <input type="file" id="input-factura" class="form-control form-control-sm" accept=".pdf,.jpg,.png,.doc,.docx" required />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-brand btn-sm w-100">Cargar Factura</button>
        </div>
      </form>
      <div id="alert-factura" class="mt-2"></div>
    </div>
    
    <div>
      <h6>Historial de Facturas</h6>
      <div id="lista-facturas">
        ${documentos.length > 0 
          ? documentos.map(doc => `
              <div class="card card-body mb-2 p-2">
                <small><strong>${doc.fileName}</strong></small>
                <small class="text-muted">${new Date(doc.fechaRegistro).toLocaleDateString('es-ES')}</small>
              </div>
            `).join('')
          : '<p class="text-muted small">No hay facturas cargadas</p>'
        }
      </div>
    </div>
  `;
  
  // Configurar formulario de carga de factura
  const formCargarFactura = document.getElementById('form-cargar-factura');
  if (formCargarFactura) {
    formCargarFactura.addEventListener('submit', (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('input-factura');
      const file = fileInput.files && fileInput.files[0];
      
      if (!file) {
        showAlert('alert-factura', 'danger', 'Seleccione un archivo');
        return;
      }
      
      const nuevoDoc = {
        id: 'doc-' + Date.now(),
        clienteId: cliente.id,
        tipoDoc: 'Factura',
        fileName: file.name,
        fileSize: file.size,
        fechaRegistro: new Date().toISOString()
      };
      
      const documentos = getDocumentos();
      documentos.push(nuevoDoc);
      saveDocumentos(documentos);
      
      formCargarFactura.reset();
      showAlert('alert-factura', 'success', 'Factura cargada correctamente');
      updateResumen();
      
      // Recargar modal
      setTimeout(() => openClienteModal(cliente), 1500);
    });
  }
  
  // Mostrar modal
  const clienteModal = new bootstrap.Modal(document.getElementById('clienteModal'));
  document.getElementById('clienteModalTitle').textContent = cliente.nombre;
  clienteModal.show();
}

// Mostrar/ocultar paneles
function showPanel(panelName) {
  console.log('showPanel llamado con:', panelName);
  
  const panelIds = ['panel-dashboard', 'panel-clientes', 'panel-documentos', 'panel-finanzas', 'panel-activos'];
  
  panelIds.forEach(id => {
    const panel = document.getElementById(id);
    if (panel) {
      panel.style.display = 'none';
    }
  });
  
  const targetPanel = document.getElementById('panel-' + panelName);
  if (targetPanel) {
    targetPanel.style.display = 'block';
    if (panelName === 'clientes') {
      renderKanban();
      // Mostrar botón flotante solo en Clientes
      const btnAddClientFloat = document.getElementById('btn-add-client-float');
      if (btnAddClientFloat) btnAddClientFloat.style.display = 'flex';
    } else {
      // Ocultar botón flotante en otras pestañas
      const btnAddClientFloat = document.getElementById('btn-add-client-float');
      if (btnAddClientFloat) btnAddClientFloat.style.display = 'none';
    }
    console.log('Panel mostrado:', panelName);
  } else {
    console.log('Panel no encontrado:', 'panel-' + panelName);
  }
}

// ============ FORMULARIOS ============

function setupFormularios() {
  // Formulario agregar cliente
  const addClientForm = document.getElementById('add-client-form');
  if (addClientForm) {
    addClientForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('cliente-nombre').value.trim();
      const empresa = document.getElementById('cliente-empresa').value.trim();
      const email = document.getElementById('cliente-email').value.trim();
      const telefono = document.getElementById('cliente-telefono').value.trim();
      const estadoVenta = document.getElementById('cliente-estado').value || 'Nuevo';
      
      if (!nombre) {
        showAlert('add-client-alert', 'danger', 'El nombre es obligatorio');
        return;
      }
      
      const nuevoCliente = {
        id: 'cliente-' + Date.now(),
        nombre,
        empresa,
        email,
        telefono,
        estadoVenta,
        fechaPrimerContacto: new Date().toISOString()
      };
      
      const clientes = getClientes();
      clientes.push(nuevoCliente);
      saveClientes(clientes);
      
      addClientForm.reset();
      showAlert('add-client-alert', 'success', 'Cliente agregado correctamente');
      updateResumen();
      renderKanban();
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('addClientModal'));
      if (modal) modal.hide();
    });
  }
  
  // Formulario documentos corporativos
  const uploadForm = document.getElementById('upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tipoDoc = document.getElementById('upload-tipoDoc').value.trim();
      const fileInput = document.getElementById('upload-file');
      const file = fileInput.files && fileInput.files[0];
      
      if (!tipoDoc) {
        showAlert('upload-alert', 'danger', 'Seleccione un tipo de documento');
        return;
      }
      if (!file) {
        showAlert('upload-alert', 'danger', 'Seleccione un archivo');
        return;
      }
      
      const nuevoDoc = {
        id: 'doc-' + Date.now(),
        clienteId: null,
        tipoDoc,
        fileName: file.name,
        fileSize: file.size,
        fechaRegistro: new Date().toISOString()
      };
      
      const documentos = getDocumentos();
      documentos.push(nuevoDoc);
      saveDocumentos(documentos);
      
      uploadForm.reset();
      showAlert('upload-alert', 'success', 'Documento corporativo cargado');
      updateResumen();
      renderDocumentosCorporativos();
    });
  }
  
  // Mostrar documentos corporativos
  renderDocumentosCorporativos();
  
  // Formulario egresos
  const egresoForm = document.getElementById('egreso-form');
  if (egresoForm) {
    egresoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tipo = document.getElementById('egreso-tipo').value.trim();
      const descripcion = document.getElementById('egreso-descripcion').value.trim();
      const montoVal = document.getElementById('egreso-monto').value.trim();
      const monto = parseFloat(montoVal);
      
      if (!tipo) {
        showAlert('egreso-alert', 'danger', 'El tipo es obligatorio');
        return;
      }
      if (!montoVal || isNaN(monto) || monto <= 0) {
        showAlert('egreso-alert', 'danger', 'Ingrese un monto válido');
        return;
      }
      
      const nuevoEgreso = {
        id: 'egreso-' + Date.now(),
        tipo,
        descripcion,
        monto,
        fecha: new Date().toISOString()
      };
      
      const egresos = getEgresos();
      egresos.push(nuevoEgreso);
      saveEgresos(egresos);
      
      egresoForm.reset();
      showAlert('egreso-alert', 'success', 'Egreso registrado');
      updateResumen();
    });
  }
}

// ============ INICIALIZACIÓN ============

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded disparado');
  
  const currentUser = checkAuth();
  if (!currentUser) {
    console.log('Usuario no autenticado');
    return;
  }
  
  console.log('Usuario autenticado:', currentUser.email);
  
  // Mostrar email del usuario
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
  
  // Configurar botones de navegación
  console.log('Buscando botones de navegación...');
  
  const navInicio = document.getElementById('nav-inicio');
  const navClientes = document.getElementById('nav-clientes');
  const navDocumentos = document.getElementById('nav-documentos');
  const navFinanzas = document.getElementById('nav-finanzas');
  const navActivos = document.getElementById('nav-activos');
  
  console.log('Botones encontrados:', {
    navInicio: !!navInicio,
    navClientes: !!navClientes,
    navDocumentos: !!navDocumentos,
    navFinanzas: !!navFinanzas,
    navActivos: !!navActivos
  });
  
  // Agregar event listeners
  if (navInicio) {
    navInicio.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Click en Inicio');
      showPanel('dashboard');
    });
  }
  
  if (navClientes) {
    navClientes.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Click en Clientes');
      showPanel('clientes');
    });
  }
  
  if (navDocumentos) {
    navDocumentos.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Click en Documentos');
      showPanel('documentos');
    });
  }
  
  if (navFinanzas) {
    navFinanzas.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Click en Finanzas');
      showPanel('finanzas');
    });
  }
  
  if (navActivos) {
    navActivos.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Click en Activos');
      showPanel('activos');
    });
  }
  
  // Botón flotante
  const btnAddClientFloat = document.getElementById('btn-add-client-float');
  if (btnAddClientFloat) {
    btnAddClientFloat.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Click en botón flotante');
      const addClientModal = new bootstrap.Modal(document.getElementById('addClientModal'));
      addClientModal.show();
    });
  }
  
  // Configurar formularios
  setupFormularios();
  
  // Mostrar dashboard por defecto
  showPanel('dashboard');
  updateResumen();
  
  console.log('=== DASHBOARD INICIALIZADO ===');
});

window.appFunctions = { showPanel, checkAuth, updateResumen, renderKanban };
