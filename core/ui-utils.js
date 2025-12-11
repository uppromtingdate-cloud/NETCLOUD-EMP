// core/ui-utils.js
// Utilidades de UI compartidas entre plugins

export function showAlert(containerId, type, message, timeout = 5000) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('Alert container not found:', containerId);
    return;
  }
  
  const alertId = 'alert-' + Date.now();
  const alertClass = type === 'success' ? 'alert-success' : 
                     type === 'danger' ? 'alert-danger' :
                     type === 'warning' ? 'alert-warning' :
                     type === 'info' ? 'alert-info' : 'alert-secondary';
  
  container.innerHTML = `<div id="${alertId}" class="alert ${alertClass} alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  
  if (timeout > 0) {
    setTimeout(() => {
      const alert = document.getElementById(alertId);
      if (alert) alert.remove();
    }, timeout);
  }
}
