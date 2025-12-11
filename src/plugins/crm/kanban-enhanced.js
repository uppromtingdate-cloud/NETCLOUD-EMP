// plugins/crm/kanban-enhanced.js
// Módulo para renderizar tarjetas de Kanban mejoradas con más información

import { getClientes, saveClientes } from '../../core/storage-utils.js';

/**
 * KanbanCardBuilder - Construye tarjetas de Kanban enriquecidas
 */
export class KanbanCardBuilder {
  /**
   * Crea una tarjeta de Kanban mejorada
   */
  static createEnhancedCard(cliente, onClientSelect, onDelete) {
    const card = document.createElement('div');
    card.draggable = true;
    card.className = 'kanban-card';
    card.dataset.clienteId = cliente.id;
    
    // Determinar prioridad basada en estado y datos
    const priority = this.calculatePriority(cliente);
    card.classList.add(`priority-${priority}`);

    // Header con badge de prioridad y fecha
    const header = document.createElement('div');
    header.className = 'kanban-card-header';
    
    const badge = document.createElement('span');
    badge.className = `kanban-card-badge ${priority}`;
    badge.innerHTML = `<span>${this.getPriorityIcon(priority)}</span> ${this.getPriorityLabel(priority)}`;
    header.appendChild(badge);

    const dateEl = document.createElement('span');
    dateEl.className = 'kanban-card-date';
    dateEl.textContent = this.formatDate(cliente.fechaPrimerContacto);
    header.appendChild(dateEl);

    card.appendChild(header);

    // Título (nombre del cliente)
    const title = document.createElement('div');
    title.className = 'kanban-card-title';
    title.textContent = cliente.nombre;
    card.appendChild(title);

    // Meta información (empresa y contacto)
    const meta = document.createElement('div');
    meta.className = 'kanban-card-meta';
    
    if (cliente.empresa) {
      const companyEl = document.createElement('span');
      companyEl.className = 'kanban-card-contact';
      companyEl.textContent = cliente.empresa;
      meta.appendChild(companyEl);
    }

    if (cliente.monto) {
      const amountEl = document.createElement('span');
      amountEl.className = 'kanban-card-amount';
      amountEl.textContent = `$${parseFloat(cliente.monto).toLocaleString('es-ES')}`;
      meta.appendChild(amountEl);
    }

    card.appendChild(meta);

    // Acciones
    const actions = document.createElement('div');
    actions.className = 'kanban-card-actions';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'kanban-card-action-btn';
    btnEdit.innerHTML = 'Editar';
    btnEdit.type = 'button';
    btnEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      onClientSelect(cliente);
    });
    actions.appendChild(btnEdit);

    const btnDelete = document.createElement('button');
    btnDelete.className = 'kanban-card-action-btn delete';
    btnDelete.innerHTML = 'Eliminar';
    btnDelete.type = 'button';
    btnDelete.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`¿Eliminar cliente "${cliente.nombre}"?`)) {
        onDelete(cliente.id);
      }
    });
    actions.appendChild(btnDelete);

    card.appendChild(actions);

    // Event listeners
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('clienteId', cliente.id);
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    card.addEventListener('click', () => onClientSelect(cliente));

    return card;
  }

  /**
   * Calcula la prioridad de un cliente
   */
  static calculatePriority(cliente) {
    // Alta prioridad: clientes en negociación con monto alto
    if (cliente.estadoVenta === 'Negociación' && cliente.monto && parseFloat(cliente.monto) > 10000) {
      return 'high';
    }
    
    // Media prioridad: clientes en negociación o propuesta enviada
    if (['Negociación', 'Propuesta enviada'].includes(cliente.estadoVenta)) {
      return 'medium';
    }
    
    // Baja prioridad: clientes nuevos
    return 'low';
  }

  /**
   * Obtiene el icono de prioridad
   */
  static getPriorityIcon(priority) {
    const icons = {
      high: '●',
      medium: '●',
      low: '●'
    };
    return icons[priority] || '●';
  }

  /**
   * Obtiene la etiqueta de prioridad
   */
  static getPriorityLabel(priority) {
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return labels[priority] || 'Normal';
  }

  /**
   * Formatea la fecha
   */
  static formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }
  }
}

/**
 * KanbanEnhanced - Renderiza Kanban mejorado
 */
export class KanbanEnhanced {
  /**
   * Renderiza el Kanban con tarjetas enriquecidas
   */
  static render(containerId, onClientSelect, onDelete) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const clientes = getClientes();

    // Configuración de estados
    const estadosConfig = {
      'Nuevo': { color: '#d4edda', textColor: '#155724', badge: 'success' },
      'Propuesta enviada': { color: '#fff3cd', textColor: '#856404', badge: 'warning' },
      'Negociación': { color: '#d1ecf1', textColor: '#0c5460', badge: 'info' },
      'Cerrado - Perdido': { color: '#f8d7da', textColor: '#721c24', badge: 'danger' },
      'Cerrado - Ganado': { color: '#d4edda', textColor: '#155724', badge: 'success' }
    };

    // Agrupar clientes por estado
    const clientesPorEstado = {};
    Object.keys(estadosConfig).forEach(estado => {
      clientesPorEstado[estado] = [];
    });

    clientes.forEach(cliente => {
      const estado = cliente.estadoVenta || 'Nuevo';
      if (!clientesPorEstado[estado]) {
        clientesPorEstado[estado] = [];
      }
      clientesPorEstado[estado].push(cliente);
    });

    // Limpiar contenedor
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.gap = '20px';
    container.style.overflowX = 'auto';
    container.style.paddingBottom = '10px';

    // Calcular ancho dinámico
    const containerWidth = container.parentElement.offsetWidth - 30;
    const numColumnas = Object.keys(estadosConfig).length;
    const columnWidth = Math.max(300, Math.floor(containerWidth / numColumnas) - 20);

    // Renderizar columnas
    Object.entries(estadosConfig).forEach(([estado, config]) => {
      const columna = document.createElement('div');
      columna.style.width = columnWidth + 'px';
      columna.style.minWidth = columnWidth + 'px';
      columna.style.flexShrink = 0;
      columna.style.display = 'flex';
      columna.style.flexDirection = 'column';
      columna.style.height = '100%';

      // Header
      const header = document.createElement('div');
      header.style.padding = '12px 8px';
      header.style.marginBottom = '12px';
      header.style.fontWeight = '700';
      header.style.color = config.textColor;
      header.style.fontSize = '14px';
      header.style.backgroundColor = config.color;
      header.style.borderRadius = '6px';
      header.style.textAlign = 'center';
      header.innerHTML = `${estado} <span style="font-size: 12px; font-weight: 500; display: block;">(${clientesPorEstado[estado].length})</span>`;
      columna.appendChild(header);

      // Drop zone
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

      // Agregar tarjetas mejoradas
      clientesPorEstado[estado].forEach(cliente => {
        const card = KanbanCardBuilder.createEnhancedCard(
          cliente,
          onClientSelect,
          onDelete
        );
        dropZone.appendChild(card);
      });

      // Eventos de drop
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        dropZone.style.backgroundColor = 'rgba(200,200,200,0.1)';
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = '#f5f5f5';
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#f5f5f5';
        const clienteId = e.dataTransfer.getData('clienteId');

        // Actualizar estado
        const clientesActualizados = clientes.map(c => {
          if (c.id === clienteId) {
            return { ...c, estadoVenta: estado };
          }
          return c;
        });

        saveClientes(clientesActualizados);
        this.render(containerId, onClientSelect, onDelete);
      });

      columna.appendChild(dropZone);
      container.appendChild(columna);
    });
  }
}
