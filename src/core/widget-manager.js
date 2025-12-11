// core/widget-manager.js
// Sistema de gestión de widgets reutilizable - Core module

/**
 * WidgetManager - Gestiona widgets del dashboard
 * Responsabilidades:
 * - Persistencia de estado de widgets (visible/oculto, orden)
 * - Drag-and-drop para reordenar
 * - Actualización de datos
 * - Controles de widget (ocultar, actualizar, etc)
 */

const WIDGET_STATE_KEY = 'netcloud_widget_state';

export class WidgetManager {
  constructor() {
    this.widgets = new Map();
    this.state = this.loadState();
    this.draggedWidget = null;
  }

  /**
   * Registra un widget en el sistema
   * @param {string} widgetId - ID único del widget
   * @param {Object} config - Configuración del widget
   */
  registerWidget(widgetId, config = {}) {
    const defaultConfig = {
      visible: true,
      order: Array.from(this.widgets.keys()).length,
      refreshable: true,
      hideable: true,
      draggable: true,
      ...config
    };

    this.widgets.set(widgetId, defaultConfig);
    
    // Restaurar estado guardado si existe
    if (this.state[widgetId]) {
      this.widgets.set(widgetId, {
        ...defaultConfig,
        ...this.state[widgetId]
      });
    }

    return defaultConfig;
  }

  /**
   * Obtiene la configuración de un widget
   */
  getWidget(widgetId) {
    return this.widgets.get(widgetId);
  }

  /**
   * Obtiene todos los widgets ordenados
   */
  getAllWidgets() {
    return Array.from(this.widgets.entries())
      .sort((a, b) => a[1].order - b[1].order)
      .map(([id, config]) => ({ id, ...config }));
  }

  /**
   * Alterna visibilidad de un widget
   */
  toggleWidgetVisibility(widgetId) {
    const widget = this.widgets.get(widgetId);
    if (widget && widget.hideable) {
      widget.visible = !widget.visible;
      this.saveState();
      return widget.visible;
    }
    return false;
  }

  /**
   * Oculta un widget
   */
  hideWidget(widgetId) {
    const widget = this.widgets.get(widgetId);
    if (widget && widget.hideable) {
      widget.visible = false;
      this.saveState();
    }
  }

  /**
   * Muestra un widget
   */
  showWidget(widgetId) {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      widget.visible = true;
      this.saveState();
    }
  }

  /**
   * Reordena widgets
   */
  reorderWidget(widgetId, newOrder) {
    const widget = this.widgets.get(widgetId);
    if (widget && widget.draggable) {
      widget.order = newOrder;
      this.saveState();
    }
  }

  /**
   * Carga estado guardado de widgets
   */
  loadState() {
    try {
      const saved = localStorage.getItem(WIDGET_STATE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error loading widget state:', e);
      return {};
    }
  }

  /**
   * Guarda estado de widgets
   */
  saveState() {
    try {
      const state = {};
      this.widgets.forEach((config, id) => {
        state[id] = {
          visible: config.visible,
          order: config.order
        };
      });
      localStorage.setItem(WIDGET_STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving widget state:', e);
    }
  }

  /**
   * Resetea estado de todos los widgets
   */
  resetState() {
    localStorage.removeItem(WIDGET_STATE_KEY);
    this.state = {};
    this.widgets.forEach((config, id) => {
      config.visible = true;
      config.order = Array.from(this.widgets.keys()).indexOf(id);
    });
  }
}

/**
 * WidgetRenderer - Renderiza widgets con estructura estándar
 */
export class WidgetRenderer {
  /**
   * Crea estructura HTML de un widget
   */
  static createWidget(widgetId, title, icon = '', options = {}) {
    const {
      showRefresh = true,
      showHide = true,
      showDrag = true,
      minHeight = '200px'
    } = options;

    const widget = document.createElement('div');
    widget.className = 'widget-card';
    widget.id = `widget-${widgetId}`;
    widget.dataset.widgetId = widgetId;
    widget.style.minHeight = minHeight;

    // Header
    const header = document.createElement('div');
    header.className = 'widget-header';
    
    const titleEl = document.createElement('h6');
    titleEl.innerHTML = `${icon ? `<span class="widget-header-icon">${icon}</span>` : ''}${title}`;
    header.appendChild(titleEl);

    const controls = document.createElement('div');
    controls.className = 'widget-controls';

    if (showDrag) {
      const dragBtn = document.createElement('button');
      dragBtn.className = 'widget-btn drag-handle';
      dragBtn.innerHTML = '≡';
      dragBtn.title = 'Reordenar';
      dragBtn.type = 'button';
      controls.appendChild(dragBtn);
    }

    if (showRefresh) {
      const refreshBtn = document.createElement('button');
      refreshBtn.className = 'widget-btn refresh-btn';
      refreshBtn.innerHTML = '↻';
      refreshBtn.title = 'Actualizar';
      refreshBtn.type = 'button';
      controls.appendChild(refreshBtn);
    }

    if (showHide) {
      const hideBtn = document.createElement('button');
      hideBtn.className = 'widget-btn hide-btn';
      hideBtn.innerHTML = '✕';
      hideBtn.title = 'Ocultar';
      hideBtn.type = 'button';
      controls.appendChild(hideBtn);
    }

    header.appendChild(controls);
    widget.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'widget-body';
    body.id = `widget-body-${widgetId}`;
    widget.appendChild(body);

    return widget;
  }

  /**
   * Crea una tarjeta de estadística
   */
  static createStatCard(data) {
    const {
      icon = '',
      label = 'Métrica',
      value = '0',
      trend = null,
      trendType = 'neutral',
      className = ''
    } = data;

    const card = document.createElement('div');
    card.className = `stat-card ${className}`;

    const content = document.createElement('div');
    content.className = 'stat-content';

    const labelEl = document.createElement('div');
    labelEl.className = 'stat-label';
    labelEl.textContent = label;
    content.appendChild(labelEl);

    const valueEl = document.createElement('div');
    valueEl.className = 'stat-value';
    valueEl.textContent = value;
    content.appendChild(valueEl);

    if (trend) {
      const trendEl = document.createElement('div');
      trendEl.className = `stat-trend ${trendType}`;
      trendEl.textContent = trend;
      content.appendChild(trendEl);
    }

    card.appendChild(content);
    return card;
  }

  /**
   * Crea un item de lista para widgets
   */
  static createListItem(label, meta = '', value = '') {
    const item = document.createElement('div');
    item.className = 'widget-list-item';

    const content = document.createElement('div');
    content.className = 'widget-list-item-content';

    const labelEl = document.createElement('div');
    labelEl.className = 'widget-list-item-label';
    labelEl.textContent = label;
    content.appendChild(labelEl);

    if (meta) {
      const metaEl = document.createElement('div');
      metaEl.className = 'widget-list-item-meta';
      metaEl.textContent = meta;
      content.appendChild(metaEl);
    }

    item.appendChild(content);

    if (value) {
      const valueEl = document.createElement('div');
      valueEl.className = 'widget-list-item-value';
      valueEl.textContent = value;
      item.appendChild(valueEl);
    }

    return item;
  }

  /**
   * Muestra estado vacío
   */
  static createEmptyState(icon = '-', message = 'Sin datos') {
    const empty = document.createElement('div');
    empty.className = 'widget-empty';

    const iconEl = document.createElement('div');
    iconEl.className = 'widget-empty-icon';
    iconEl.textContent = icon;
    empty.appendChild(iconEl);

    const textEl = document.createElement('div');
    textEl.className = 'widget-empty-text';
    textEl.textContent = message;
    empty.appendChild(textEl);

    return empty;
  }

  /**
   * Muestra estado de carga
   */
  static createLoadingState() {
    const loading = document.createElement('div');
    loading.className = 'widget-loading';

    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    loading.appendChild(spinner);

    return loading;
  }
}

/**
 * WidgetEventManager - Gestiona eventos de widgets
 */
export class WidgetEventManager {
  constructor(widgetManager) {
    this.widgetManager = widgetManager;
    this.refreshCallbacks = new Map();
    this.draggedElement = null;
  }

  /**
   * Registra callback para actualización de widget
   */
  onRefresh(widgetId, callback) {
    this.refreshCallbacks.set(widgetId, callback);
  }

  /**
   * Inicializa eventos de un widget
   */
  initWidgetEvents(widgetElement, widgetId) {
    const hideBtn = widgetElement.querySelector('.hide-btn');
    const refreshBtn = widgetElement.querySelector('.refresh-btn');
    const dragHandle = widgetElement.querySelector('.drag-handle');

    if (hideBtn) {
      hideBtn.addEventListener('click', () => {
        const visible = this.widgetManager.toggleWidgetVisibility(widgetId);
        widgetElement.classList.toggle('hidden', !visible);
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.handleRefresh(widgetId, widgetElement);
      });
    }

    if (dragHandle) {
      dragHandle.addEventListener('mousedown', (e) => {
        this.startDrag(e, widgetElement, widgetId);
      });
    }
  }

  /**
   * Maneja actualización de widget
   */
  handleRefresh(widgetId, widgetElement) {
    const body = widgetElement.querySelector('.widget-body');
    if (body) {
      body.innerHTML = '';
      body.appendChild(WidgetRenderer.createLoadingState());

      const callback = this.refreshCallbacks.get(widgetId);
      if (callback) {
        Promise.resolve(callback()).then(() => {
          // El callback debe actualizar el contenido del body
        }).catch(err => {
          console.error(`Error refreshing widget ${widgetId}:`, err);
          body.innerHTML = '';
          body.appendChild(WidgetRenderer.createEmptyState('❌', 'Error al actualizar'));
        });
      }
    }
  }

  /**
   * Inicia drag de widget
   */
  startDrag(e, element, widgetId) {
    this.draggedElement = element;
    element.classList.add('dragging');
    element.style.opacity = '0.7';

    const startY = e.clientY;
    const startX = e.clientX;

    const handleMouseMove = (moveEvent) => {
      const diffY = moveEvent.clientY - startY;
      const diffX = moveEvent.clientX - startX;
      
      if (Math.abs(diffY) > 5 || Math.abs(diffX) > 5) {
        element.style.cursor = 'grabbing';
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      element.classList.remove('dragging');
      element.style.opacity = '1';
      element.style.cursor = 'grab';
      this.draggedElement = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
}

// Exportar instancia global
export const globalWidgetManager = new WidgetManager();
export const globalWidgetEventManager = new WidgetEventManager(globalWidgetManager);
