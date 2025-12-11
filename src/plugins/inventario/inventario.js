// plugins/inventario/inventario.js
// Módulo Inventario: gestión de productos y servicios (localStorage)

import { 
  getInventario, saveInventario, agregarProducto, actualizarProducto, 
  eliminarProducto, calcularMargenProducto 
} from '../../core/storage-utils.js';
import { showAlert } from '../../core/ui-utils.js';

/**
 * Renderiza la tabla de inventario
 * @param {string} containerId - ID del contenedor
 */
export function renderInventario(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const inventario = getInventario();
  
  if (inventario.length === 0) {
    container.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay productos registrados</td></tr>';
    return;
  }
  
  container.innerHTML = inventario.map(producto => {
    const margen = calcularMargenProducto(producto.id);
    const margenPorcentaje = margen.porcentajemargen || 0;
    
    return `
      <tr>
        <td><strong>${producto.nombre}</strong></td>
        <td><span class="badge ${producto.tipo === 'producto' ? 'bg-info' : 'bg-success'}">${producto.tipo}</span></td>
        <td>$${parseFloat(producto.precio).toFixed(2)}</td>
        <td>$${parseFloat(producto.costo).toFixed(2)}</td>
        <td>
          <small class="text-${margenPorcentaje > 0 ? 'success' : 'danger'}">
            ${margenPorcentaje}%
          </small>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="window.editarProducto('${producto.id}')">
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="window.eliminarProductoUI('${producto.id}')">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Configura el formulario de productos
 * @param {string} formId - ID del formulario
 * @param {string} alertId - ID del contenedor de alertas
 */
export function setupProductoForm(formId, alertId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('producto-nombre').value.trim();
    const tipo = document.getElementById('producto-tipo').value;
    const precio = parseFloat(document.getElementById('producto-precio').value);
    const costo = parseFloat(document.getElementById('producto-costo').value) || 0;
    
    // Validaciones
    if (!nombre) {
      showAlert(alertId, 'danger', 'El nombre del producto es obligatorio');
      return;
    }
    
    if (!tipo) {
      showAlert(alertId, 'danger', 'Selecciona un tipo (producto o servicio)');
      return;
    }
    
    if (!precio || precio <= 0) {
      showAlert(alertId, 'danger', 'El precio debe ser mayor a 0');
      return;
    }
    
    try {
      agregarProducto({
        nombre,
        tipo,
        precio,
        costo
      });
      
      form.reset();
      showAlert(alertId, 'success', 'Producto agregado correctamente');
      renderInventario('inventario-tbody');
    } catch (err) {
      console.error('Error agregando producto:', err);
      showAlert(alertId, 'danger', 'Error: ' + (err.message || 'Error desconocido'));
    }
  });
}

/**
 * Elimina un producto (función global para onclick)
 * @param {string} productoId - ID del producto
 */
window.eliminarProductoUI = function(productoId) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    try {
      eliminarProducto(productoId);
      showAlert('producto-alert', 'success', 'Producto eliminado correctamente');
      renderInventario('inventario-tbody');
    } catch (err) {
      console.error('Error eliminando producto:', err);
      showAlert('producto-alert', 'danger', 'Error al eliminar producto');
    }
  }
};

/**
 * Edita un producto (función global para onclick)
 * @param {string} productoId - ID del producto
 */
window.editarProducto = function(productoId) {
  const inventario = getInventario();
  const producto = inventario.find(p => p.id === productoId);
  
  if (!producto) {
    showAlert('producto-alert', 'danger', 'Producto no encontrado');
    return;
  }
  
  // Llenar formulario con datos del producto
  document.getElementById('producto-nombre').value = producto.nombre;
  document.getElementById('producto-tipo').value = producto.tipo;
  document.getElementById('producto-precio').value = producto.precio;
  document.getElementById('producto-costo').value = producto.costo;
  
  // Cambiar botón a "Actualizar"
  const form = document.getElementById('producto-form');
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.innerHTML = '<i class="fa fa-save"></i> Actualizar';
  
  // Guardar ID para actualización
  form.dataset.productoId = productoId;
  
  // Cambiar comportamiento del submit
  form.onsubmit = (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('producto-nombre').value.trim();
    const tipo = document.getElementById('producto-tipo').value;
    const precio = parseFloat(document.getElementById('producto-precio').value);
    const costo = parseFloat(document.getElementById('producto-costo').value) || 0;
    
    if (!nombre || !tipo || !precio) {
      showAlert('producto-alert', 'danger', 'Completa todos los campos requeridos');
      return;
    }
    
    try {
      actualizarProducto(productoId, {
        nombre,
        tipo,
        precio,
        costo
      });
      
      form.reset();
      submitBtn.innerHTML = '<i class="fa fa-plus"></i> +';
      delete form.dataset.productoId;
      form.onsubmit = null;
      
      showAlert('producto-alert', 'success', 'Producto actualizado correctamente');
      renderInventario('inventario-tbody');
    } catch (err) {
      console.error('Error actualizando producto:', err);
      showAlert('producto-alert', 'danger', 'Error: ' + (err.message || 'Error desconocido'));
    }
  };
};
