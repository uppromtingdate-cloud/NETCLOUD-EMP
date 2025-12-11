// core/clear-data.js
// Script para limpiar datos de prueba de localStorage

export function clearAllData() {
  const keys = [
    'netcloud_clientes',
    'netcloud_ingresos',
    'netcloud_documentos',
    'netcloud_interacciones',
    'netcloud_gastos_empresariales',
    'netcloud_refrigerios',
    'netcloud_pagos_personal',
    'netcloud_activos',
    'netcloud_inventario',
    'netcloud_widget_state'
  ];

  keys.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('Todos los datos de prueba han sido eliminados');
}

// Ejecutar al cargar si es necesario
if (typeof window !== 'undefined' && window.location.hash === '#clear-data') {
  clearAllData();
  window.location.hash = '';
}
