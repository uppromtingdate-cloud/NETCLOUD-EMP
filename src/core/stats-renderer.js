// core/stats-renderer.js
// Módulo para renderizar tarjetas de estadísticas mejoradas

import { WidgetRenderer } from './widget-manager.js';

/**
 * StatsRenderer - Renderiza tarjetas de estadísticas del dashboard
 */
export class StatsRenderer {
  /**
   * Renderiza todas las tarjetas de estadísticas
   */
  static renderAllStats(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const stats = [
      {
        icon: '',
        label: 'Total Clientes',
        value: '0',
        trend: null,
        trendType: 'neutral',
        className: 'clients',
        dataId: 'stat-total-clientes'
      },
      {
        icon: '',
        label: 'Clientes Nuevos',
        value: '0',
        trend: null,
        trendType: 'neutral',
        className: 'clients',
        dataId: 'stat-clientes-nuevos'
      },
      {
        icon: '',
        label: 'Ingresos Mes',
        value: '$0',
        trend: null,
        trendType: 'neutral',
        className: 'revenue',
        dataId: 'stat-egresos-mes'
      },
      {
        icon: '',
        label: 'Documentos',
        value: '0',
        trend: null,
        trendType: 'neutral',
        className: 'pending',
        dataId: 'stat-documentos'
      }
    ];

    stats.forEach(stat => {
      const card = WidgetRenderer.createStatCard(stat);
      card.id = stat.dataId;
      container.appendChild(card);
    });
  }

  /**
   * Actualiza el valor de una tarjeta de estadística
   */
  static updateStat(statId, value, trend = null, trendType = 'neutral') {
    const statCard = document.getElementById(statId);
    if (!statCard) return;

    const valueEl = statCard.querySelector('.stat-value');
    if (valueEl) {
      valueEl.textContent = value;
    }

    const trendEl = statCard.querySelector('.stat-trend');
    if (trend) {
      if (trendEl) {
        trendEl.textContent = trend;
        trendEl.className = `stat-trend ${trendType}`;
      } else {
        const newTrendEl = document.createElement('div');
        newTrendEl.className = `stat-trend ${trendType}`;
        newTrendEl.textContent = trend;
        statCard.querySelector('.stat-content').appendChild(newTrendEl);
      }
    }
  }

  /**
   * Calcula tendencia basada en comparación
   */
  static calculateTrend(current, previous) {
    if (previous === 0) return null;
    
    const percentChange = ((current - previous) / previous) * 100;
    const trendType = percentChange > 0 ? 'positive' : percentChange < 0 ? 'negative' : 'neutral';
    const arrow = percentChange > 0 ? '↑' : percentChange < 0 ? '↓' : '→';
    const trend = `${arrow} ${Math.abs(percentChange).toFixed(1)}% vs mes anterior`;
    
    return { trend, trendType };
  }
}

/**
 * WidgetsRenderer - Renderiza widgets del dashboard
 */
export class WidgetsRenderer {
  /**
   * Renderiza todos los widgets del dashboard
   */
  static renderAllWidgets(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const widgets = [
      {
        id: 'alertas',
        title: 'Alertas',
        icon: '',
        showRefresh: true,
        showHide: true,
        showDrag: true
      },
      {
        id: 'interacciones',
        title: 'Últimas Interacciones',
        icon: '',
        showRefresh: true,
        showHide: true,
        showDrag: true
      },
      {
        id: 'kpis',
        title: 'KPIs',
        icon: '',
        showRefresh: true,
        showHide: true,
        showDrag: true
      },
      {
        id: 'resumen-financiero',
        title: 'Resumen Financiero',
        icon: '',
        showRefresh: true,
        showHide: true,
        showDrag: true
      },
      {
        id: 'clientes-por-cerrar',
        title: 'Clientes por Cerrar',
        icon: '',
        showRefresh: true,
        showHide: true,
        showDrag: true
      },
      {
        id: 'facturas-pendientes',
        title: 'Facturas Pendientes',
        icon: '',
        showRefresh: true,
        showHide: true,
        showDrag: true
      },
      {
        id: 'grafico-ingreso-egreso',
        title: 'Ingresos vs Egresos',
        icon: '',
        showRefresh: true,
        showHide: true,
        showDrag: true
      },
      {
        id: 'grafico-clientes-estado',
        title: 'Clientes por Estado',
        icon: '',
        showRefresh: true,
        showHide: true,
        showDrag: true
      }
    ];

    widgets.forEach(widget => {
      const widgetEl = WidgetRenderer.createWidget(
        widget.id,
        widget.title,
        widget.icon,
        {
          showRefresh: widget.showRefresh,
          showHide: widget.showHide,
          showDrag: widget.showDrag,
          minHeight: '240px'
        }
      );

      // Crear contenedor para el contenido específico del widget
      const body = widgetEl.querySelector('.widget-body');
      const contentDiv = document.createElement('div');
      contentDiv.id = widget.id;
      body.appendChild(contentDiv);

      container.appendChild(widgetEl);
    });
  }

  /**
   * Obtiene el contenedor de un widget específico
   */
  static getWidgetContent(widgetId) {
    return document.getElementById(widgetId);
  }

  /**
   * Limpia el contenido de un widget
   */
  static clearWidget(widgetId) {
    const content = this.getWidgetContent(widgetId);
    if (content) {
      content.innerHTML = '';
    }
  }

  /**
   * Muestra estado de carga en un widget
   */
  static showLoading(widgetId) {
    const content = this.getWidgetContent(widgetId);
    if (content) {
      content.innerHTML = '';
      content.appendChild(WidgetRenderer.createLoadingState());
    }
  }

  /**
   * Muestra estado vacío en un widget
   */
  static showEmpty(widgetId, icon = '📭', message = 'Sin datos') {
    const content = this.getWidgetContent(widgetId);
    if (content) {
      content.innerHTML = '';
      content.appendChild(WidgetRenderer.createEmptyState(icon, message));
    }
  }

  /**
   * Agrega un item de lista a un widget
   */
  static addListItem(widgetId, label, meta = '', value = '') {
    const content = this.getWidgetContent(widgetId);
    if (content) {
      const item = WidgetRenderer.createListItem(label, meta, value);
      content.appendChild(item);
    }
  }

  /**
   * Renderiza una lista completa en un widget
   */
  static renderList(widgetId, items) {
    const content = this.getWidgetContent(widgetId);
    if (!content) return;

    content.innerHTML = '';

    if (!items || items.length === 0) {
      content.appendChild(WidgetRenderer.createEmptyState('📭', 'Sin elementos'));
      return;
    }

    items.forEach(item => {
      const listItem = WidgetRenderer.createListItem(
        item.label,
        item.meta || '',
        item.value || ''
      );
      content.appendChild(listItem);
    });
  }
}
