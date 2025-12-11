// plugins/finanzas/finanzas.js
// Módulo Finanzas: funciones para gestión de gastos y depreciación de activos (localStorage)

import { getEgresos, saveEgresos, getActivos, saveActivos } from '../../core/storage-utils.js';
import { showAlert } from '../../core/ui-utils.js';

// agregarEgreso: registra un nuevo egreso en localStorage
export function agregarEgreso(tipo, descripcion, monto){
  const nuevoEgreso = {
    id: 'egreso-' + Date.now(),
    tipo,
    descripcion,
    monto: parseFloat(monto),
    fecha: new Date().toISOString()
  };
  
  const egresos = getEgresos();
  egresos.push(nuevoEgreso);
  saveEgresos(egresos);
  
  return nuevoEgreso.id;
}

// setupEgresoForm: configura el formulario de egresos
export function setupEgresoForm(formId, alertId){
  const egresoForm = document.getElementById(formId);
  if (!egresoForm) return;
  
  egresoForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const tipo = document.getElementById('egreso-tipo').value.trim();
    const descripcion = document.getElementById('egreso-descripcion').value.trim();
    const montoVal = document.getElementById('egreso-monto').value.trim();
    const monto = parseFloat(montoVal);

    if(!tipo){ showAlert(alertId,'danger','El tipo de egreso es obligatorio.'); return }
    if(!montoVal || isNaN(monto) || monto <= 0){ showAlert(alertId,'danger','Ingrese un monto válido mayor que 0.'); return }

    try{
      agregarEgreso(tipo, descripcion, monto);
      egresoForm.reset();
      showAlert(alertId,'success','Egreso registrado correctamente.');
    }catch(err){
      console.error('Error registrando egreso', err);
      showAlert(alertId,'danger','Error registrando egreso: ' + (err.message||err));
    }
  });
}

// calcularDepreciacion: calcula la depreciación anual usando método de línea recta
export function calcularDepreciacion(activoId){
  try{
    const activos = getActivos();
    const activo = activos.find(a => a.id === activoId);
    
    if(!activo) throw new Error('Activo no encontrado');
    
    const costo = parseFloat(activo.costo) || 0;
    const vida = parseFloat(activo.vidaUtilEstimada) || 1;
    const D = (costo - 0) / vida; // Valor Residual = 0
    return D; // depreciación anual
  }catch(err){
    console.error('Error calculando depreciación', err);
    throw err;
  }
}

