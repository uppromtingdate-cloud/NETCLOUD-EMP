// core/storage-utils.js
// Utilidades de almacenamiento local compartidas entre plugins

// Clientes
export function getClientes() {
  const data = localStorage.getItem('netcloud_clientes');
  return data ? JSON.parse(data) : [];
}

export function saveClientes(clientes) {
  localStorage.setItem('netcloud_clientes', JSON.stringify(clientes));
}

// Interacciones
export function getInteracciones() {
  const data = localStorage.getItem('netcloud_interacciones');
  return data ? JSON.parse(data) : [];
}

export function saveInteracciones(interacciones) {
  localStorage.setItem('netcloud_interacciones', JSON.stringify(interacciones));
}

// Egresos
export function getEgresos() {
  const data = localStorage.getItem('netcloud_egresos');
  return data ? JSON.parse(data) : [];
}

export function saveEgresos(egresos) {
  localStorage.setItem('netcloud_egresos', JSON.stringify(egresos));
}

// Documentos
export function getDocumentos() {
  const data = localStorage.getItem('netcloud_documentos');
  return data ? JSON.parse(data) : [];
}

export function saveDocumentos(documentos) {
  localStorage.setItem('netcloud_documentos', JSON.stringify(documentos));
}

// Activos
export function getActivos() {
  const data = localStorage.getItem('netcloud_activos');
  return data ? JSON.parse(data) : [];
}

export function saveActivos(activos) {
  localStorage.setItem('netcloud_activos', JSON.stringify(activos));
}
