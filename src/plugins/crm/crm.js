// plugins/crm/crm.js
// Módulo CRM: funciones para gestión de clientes con Kanban (localStorage)

import { getClientes, saveClientes, getInteracciones, saveInteracciones } from '../../core/storage-utils.js';
import { showAlert } from '../../core/ui-utils.js';

// Estados de clientes y sus colores
const estadosConfig = {
  'Nuevo': { color: '#d4edda', textColor: '#155724', badge: 'success' },
  'Propuesta enviada': { color: '#fff3cd', textColor: '#856404', badge: 'warning' },
  'Negociación': { color: '#d1ecf1', textColor: '#0c5460', badge: 'info' },
  'Cerrado - Perdido': { color: '#f8d7da', textColor: '#721c24', badge: 'danger' },
  'Cerrado - Ganado': { color: '#d4edda', textColor: '#155724', badge: 'success' }
};

// renderClientesKanban: renderiza Kanban board con drag and drop
export function renderClientesKanban(kanbanContainerId, onClientSelect){
  const kanbanContainer = document.getElementById(kanbanContainerId);
  
  // Obtener clientes de localStorage
  const clientes = getClientes();
  
  // Agrupar clientes por estado
  const clientesPorEstado = {};
  Object.keys(estadosConfig).forEach(estado => {
    clientesPorEstado[estado] = [];
  });

  clientes.forEach(cliente => {
    const estado = cliente.estadoVenta || 'Nuevo';
    if(!clientesPorEstado[estado]){
      clientesPorEstado[estado] = [];
    }
    clientesPorEstado[estado].push(cliente);
  });

  // Limpiar contenedor - Estilo Notion
  kanbanContainer.innerHTML = '';
  kanbanContainer.style.display = 'flex';
  kanbanContainer.style.gap = '20px';
  kanbanContainer.style.overflowX = 'auto';
  kanbanContainer.style.paddingBottom = '10px';

  // Calcular ancho dinámico de columnas basado en espacio disponible
  const containerWidth = kanbanContainer.parentElement.offsetWidth - 30; // Restar padding
  const numColumnas = Object.keys(estadosConfig).length;
  const columnWidth = Math.max(300, Math.floor(containerWidth / numColumnas) - 20);

  // Renderizar columnas Kanban estilo Notion - Responsivas
  Object.entries(estadosConfig).forEach(([estado, config]) => {
    const columna = document.createElement('div');
    columna.style.width = columnWidth + 'px';
    columna.style.minWidth = columnWidth + 'px';
    columna.style.flexShrink = 0;
    columna.style.display = 'flex';
    columna.style.flexDirection = 'column';
    columna.style.height = '100%';

    // Encabezado de columna - Solo título
    const header = document.createElement('div');
    header.style.padding = '12px 8px';
    header.style.marginBottom = '12px';
    header.style.fontWeight = '700';
    header.style.color = config.textColor;
    header.style.fontSize = '14px';
    header.style.backgroundColor = config.color;
    header.style.borderRadius = '6px';
    header.style.textAlign = 'center';
    header.innerHTML = `${estado}`;
    columna.appendChild(header);

    // Contenedor de tarjetas (drop zone)
    const dropZone = document.createElement('div');
    dropZone.className = 'kanban-drop-zone';
    dropZone.dataset.estado = estado;
    dropZone.style.flex = '1';
    dropZone.style.display = 'flex';
    dropZone.style.flexDirection = 'column';
    dropZone.style.gap = '8px';
    dropZone.style.minHeight = '400px';
    dropZone.style.padding = '8px';
    dropZone.style.borderRadius = '6px';
    dropZone.style.backgroundColor = '#f5f5f5';
    dropZone.style.overflowY = 'auto';

    // Agregar tarjetas de clientes
    clientesPorEstado[estado].forEach(cliente => {
      const card = document.createElement('div');
      card.draggable = true;
      card.className = 'kanban-card';
      card.dataset.clienteId = cliente.id;
      card.style.backgroundColor = 'white';
      card.style.borderRadius = '6px';
      card.style.padding = '12px';
      card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      card.style.cursor = 'grab';
      card.style.border = '1px solid #e8e8e8';
      card.style.transition = 'all 0.2s';
      card.style.fontSize = '13px';
      card.style.color = '#333';
      card.style.lineHeight = '1.4';
      card.style.fontWeight = '500';

      card.textContent = cliente.nombre;

      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('clienteId', cliente.id);
        card.style.opacity = '0.6';
      });

      card.addEventListener('dragend', () => {
        card.style.opacity = '1';
      });

      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
        card.style.backgroundColor = '#f9f9f9';
      });

      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08)';
        card.style.backgroundColor = 'white';
      });

      card.addEventListener('click', () => onClientSelect(cliente));

      dropZone.appendChild(card);
    });

    // Eventos de drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      dropZone.style.backgroundColor = 'rgba(200,200,200,0.1)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.backgroundColor = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = 'transparent';
      const clienteId = e.dataTransfer.getData('clienteId');
      
      // Actualizar estado del cliente
      const clientesActualizados = clientes.map(c => {
        if (c.id === clienteId) {
          return { ...c, estadoVenta: estado };
        }
        return c;
      });
      
      saveClientes(clientesActualizados);
      renderClientesKanban(kanbanContainerId, onClientSelect);
    });

    columna.appendChild(dropZone);
    kanbanContainer.appendChild(columna);
  });
}

// setupAddClientForm: valida y crea un nuevo cliente en localStorage
export function setupAddClientForm(formId, alertId, onClientAdded){
  const addClientForm = document.getElementById(formId);
  if (!addClientForm) return;
  
  addClientForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const empresa = document.getElementById('cliente-empresa').value.trim();
    const email = document.getElementById('cliente-email').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const estadoVenta = document.getElementById('cliente-estado').value || 'Nuevo';

    // Validaciones básicas
    if(!nombre){ showAlert(alertId,'danger','El nombre del cliente es obligatorio.'); return }
    if(email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ showAlert(alertId,'danger','Email inválido.'); return }

    // Crear nuevo cliente
    const nuevoCliente = {
      id: 'cliente-' + Date.now(),
      nombre,
      empresa,
      email,
      telefono,
      estadoVenta,
      fechaPrimerContacto: new Date().toISOString()
    };

    // Guardar en localStorage
    const clientes = getClientes();
    clientes.push(nuevoCliente);
    saveClientes(clientes);

    addClientForm.reset();
    showAlert(alertId,'success','Cliente agregado correctamente.');
    
    // Renderizar kanban nuevamente
    renderClientesKanban('kanban-container', (clienteId) => {
      renderTimeline(clienteId, document.getElementById('timeline'));
    });
    
    if(onClientAdded) onClientAdded();
  });
}

// renderTimeline: muestra interacciones filtradas por clienteId
export function renderTimeline(clienteId, timelineEl){
  if (!timelineEl) return;
  
  const interacciones = getInteracciones();
  const clienteInteracciones = interacciones.filter(i => i.clienteId === clienteId);
  
  if(clienteInteracciones.length === 0) {
    timelineEl.innerHTML = '<div class="small">Sin interacciones</div>';
    return;
  }
  
  const list = document.createElement('div');
  clienteInteracciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(it => {
    const row = document.createElement('div');
    row.className = 'timeline-item';
    row.innerHTML = `<div><strong>${it.tipo}</strong> - ${new Date(it.fecha).toLocaleString()}</div><div>${it.detalle||''}</div>`;
    list.appendChild(row);
  });
  timelineEl.innerHTML = '';
  timelineEl.appendChild(list);
}

// showClienteModal: muestra modal con información editable del cliente
export function showClienteModal(cliente) {
  // Crear modal
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';

  const content = document.createElement('div');
  content.style.backgroundColor = 'white';
  content.style.borderRadius = '8px';
  content.style.padding = '24px';
  content.style.maxWidth = '600px';
  content.style.width = '90%';
  content.style.maxHeight = '80vh';
  content.style.overflowY = 'auto';
  content.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3 style="margin: 0; color: #333;">${cliente.nombre}</h3>
      <button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
      <div>
        <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333; font-size: 12px;">Empresa</label>
        <input type="text" id="cliente-empresa-edit" value="${cliente.empresa || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
      </div>
      <div>
        <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333; font-size: 12px;">Email</label>
        <input type="email" id="cliente-email-edit" value="${cliente.email || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
      </div>
      <div>
        <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333; font-size: 12px;">Teléfono</label>
        <input type="text" id="cliente-telefono-edit" value="${cliente.telefono || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
      </div>
      <div>
        <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333; font-size: 12px;">Estado</label>
        <select id="cliente-estado-edit" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
          <option value="Nuevo" ${cliente.estadoVenta === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
          <option value="Propuesta enviada" ${cliente.estadoVenta === 'Propuesta enviada' ? 'selected' : ''}>Propuesta enviada</option>
          <option value="Negociación" ${cliente.estadoVenta === 'Negociación' ? 'selected' : ''}>Negociación</option>
          <option value="Cerrado - Ganado" ${cliente.estadoVenta === 'Cerrado - Ganado' ? 'selected' : ''}>Cerrado - Ganado</option>
          <option value="Cerrado - Perdido" ${cliente.estadoVenta === 'Cerrado - Perdido' ? 'selected' : ''}>Cerrado - Perdido</option>
        </select>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333; font-size: 12px;">Paquete de Servicios</label>
      <textarea id="cliente-paquete-edit" placeholder="Describe el paquete de servicios que compra el cliente" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; min-height: 80px; font-family: Arial, sans-serif; resize: vertical;">${cliente.paqueteServicios || ''}</textarea>
    </div>

    <div style="margin-bottom: 20px;">
      <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333; font-size: 12px;">Costo del Paquete ($)</label>
      <input type="number" id="cliente-costo-edit" placeholder="Ingresa el costo del paquete" value="${cliente.costoPaquete || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;" step="0.01" min="0">
    </div>

    <div style="margin-bottom: 20px;">
      <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333; font-size: 12px;">Observaciones</label>
      <textarea id="cliente-observaciones-edit" placeholder="Agrega observaciones sobre el cliente" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; min-height: 100px; font-family: Arial, sans-serif; resize: vertical;">${cliente.observaciones || ''}</textarea>
    </div>

    <div style="margin-bottom: 20px;">
      <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333; font-size: 12px;">Historial de Facturas</label>
      <div id="cliente-facturas-historial" style="border: 1px solid #ddd; border-radius: 4px; padding: 12px; min-height: 100px; background-color: #f9f9f9; font-size: 12px; max-height: 200px; overflow-y: auto;"></div>
    </div>

    <div style="display: flex; gap: 10px; justify-content: flex-end;">
      <button id="cancelBtn" style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 12px; color: #333;">Cancelar</button>
      <button id="saveBtn" style="padding: 8px 16px; background: #413DDB; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Guardar</button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Event listeners - usar setTimeout para asegurar que los elementos existan
  setTimeout(() => {
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const fileInput = document.getElementById('cliente-factura-upload');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.remove());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => modal.remove());
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        try {
          const clientes = getClientes();
          const costoPaquete = parseFloat(document.getElementById('cliente-costo-edit').value) || 0;
          
          const clienteActualizado = {
            ...cliente,
            empresa: document.getElementById('cliente-empresa-edit').value,
            email: document.getElementById('cliente-email-edit').value,
            telefono: document.getElementById('cliente-telefono-edit').value,
            estadoVenta: document.getElementById('cliente-estado-edit').value,
            paqueteServicios: document.getElementById('cliente-paquete-edit').value,
            costoPaquete: costoPaquete,
            observaciones: document.getElementById('cliente-observaciones-edit').value
          };

          const clientesActualizados = clientes.map(c => c.id === cliente.id ? clienteActualizado : c);
          saveClientes(clientesActualizados);
          
          // Mostrar mensaje de éxito
          const alertDiv = document.createElement('div');
          alertDiv.style.position = 'fixed';
          alertDiv.style.top = '20px';
          alertDiv.style.right = '20px';
          alertDiv.style.backgroundColor = '#28a745';
          alertDiv.style.color = 'white';
          alertDiv.style.padding = '12px 20px';
          alertDiv.style.borderRadius = '4px';
          alertDiv.style.zIndex = '10000';
          alertDiv.textContent = 'Cliente actualizado correctamente';
          document.body.appendChild(alertDiv);
          
          setTimeout(() => alertDiv.remove(), 3000);
          
          // Recargar kanban
          if (window.appFunctions && window.appFunctions.initializePlugins) {
            window.appFunctions.initializePlugins();
          }
          
          modal.remove();
        } catch (err) {
          console.error('Error guardando cliente:', err);
          const alertDiv = document.createElement('div');
          alertDiv.style.position = 'fixed';
          alertDiv.style.top = '20px';
          alertDiv.style.right = '20px';
          alertDiv.style.backgroundColor = '#dc3545';
          alertDiv.style.color = 'white';
          alertDiv.style.padding = '12px 20px';
          alertDiv.style.borderRadius = '4px';
          alertDiv.style.zIndex = '10000';
          alertDiv.textContent = 'Error guardando cliente: ' + err.message;
          document.body.appendChild(alertDiv);
          
          setTimeout(() => alertDiv.remove(), 3000);
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const facturaInfo = document.getElementById('factura-info');
          if (facturaInfo) {
            facturaInfo.innerHTML = `<strong>Archivo:</strong> ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
          }
        }
      });
    }
  }, 0);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

