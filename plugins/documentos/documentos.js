// plugins/documentos/documentos.js
// Módulo Documentos: funciones para gestión de archivos y documentos (localStorage)

import { getDocumentos, saveDocumentos } from '../../core/storage-utils.js';
import { showAlert } from '../../core/ui-utils.js';

// generarNotaEntrega: crea un documento con tipoDoc 'NotaEntrega'
export function generarNotaEntrega(clienteId, meta={}){
  const nuevoDoc = {
    id: 'doc-' + Date.now(),
    clienteId,
    tipoDoc: 'NotaEntrega',
    urlStorage: meta.url || null,
    fechaRegistro: new Date().toISOString(),
    meta
  };
  
  const documentos = getDocumentos();
  documentos.push(nuevoDoc);
  saveDocumentos(documentos);
  
  return nuevoDoc.id;
}

// uploadFileFactura: guarda referencia del archivo en localStorage
export function uploadFileFactura(file, clienteId, tipoDoc='Factura'){
  if(!file) throw new Error('No file provided');
  
  const nuevoDoc = {
    id: 'doc-' + Date.now(),
    clienteId,
    tipoDoc,
    fileName: file.name,
    fileSize: file.size,
    fechaRegistro: new Date().toISOString()
  };
  
  const documentos = getDocumentos();
  documentos.push(nuevoDoc);
  saveDocumentos(documentos);
  
  return {docId: nuevoDoc.id, fileName: file.name};
}

// setupUploadForm: configura el formulario de subida
export function setupUploadForm(formId, alertId){
  const uploadForm = document.getElementById(formId);
  if (!uploadForm) return;
  
  uploadForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const clienteId = document.getElementById('upload-clienteId').value.trim();
    const tipoDoc = document.getElementById('upload-tipoDoc').value;
    const fileInput = document.getElementById('upload-file');
    const file = fileInput.files && fileInput.files[0];

    if(!clienteId){ showAlert(alertId,'danger','Ingrese el clienteId.'); return }
    if(!file){ showAlert(alertId,'danger','Seleccione un archivo para subir.'); return }

    try{
      const res = uploadFileFactura(file, clienteId, tipoDoc);
      uploadForm.reset();
      showAlert(alertId,'success','Documento registrado. ID: ' + res.docId);
    }catch(err){
      console.error(err);
      showAlert(alertId,'danger','Error registrando documento: ' + (err.message||err));
    }
  });
}

