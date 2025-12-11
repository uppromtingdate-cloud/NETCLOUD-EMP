// tests/structure-validation.js
// Script para validar que la estructura Core + Plugins sea correcta

console.log('=== Validación de Estructura Core + Plugins ===\n');

// 1. Verificar core/firebase-init.js
console.log('1. Verificando core/firebase-init.js...');
import { auth, db, storage } from '../core/firebase-init.js';
console.log('   ✓ Firebase auth:', typeof auth);
console.log('   ✓ Firestore db:', typeof db);
console.log('   ✓ Storage:', typeof storage);

// 2. Verificar plugins/crm/crm.js
console.log('\n2. Verificando plugins/crm/crm.js...');
import { 
  renderClientesList as crmRender,
  setupAddClientForm as crmSetup,
  renderTimeline as crmTimeline
} from '../plugins/crm/crm.js';
console.log('   ✓ renderClientesList:', typeof crmRender);
console.log('   ✓ setupAddClientForm:', typeof crmSetup);
console.log('   ✓ renderTimeline:', typeof crmTimeline);

// 3. Verificar plugins/documentos/documentos.js
console.log('\n3. Verificando plugins/documentos/documentos.js...');
import { 
  uploadFileFactura as docUpload,
  generarNotaEntrega as docNota,
  setupUploadForm as docSetup
} from '../plugins/documentos/documentos.js';
console.log('   ✓ uploadFileFactura:', typeof docUpload);
console.log('   ✓ generarNotaEntrega:', typeof docNota);
console.log('   ✓ setupUploadForm:', typeof docSetup);

// 4. Verificar plugins/finanzas/finanzas.js
console.log('\n4. Verificando plugins/finanzas/finanzas.js...');
import { 
  agregarEgreso as finEgreso,
  setupEgresoForm as finSetup,
  calcularDepreciacion as finDepr
} from '../plugins/finanzas/finanzas.js';
console.log('   ✓ agregarEgreso:', typeof finEgreso);
console.log('   ✓ setupEgresoForm:', typeof finSetup);
console.log('   ✓ calcularDepreciacion:', typeof finDepr);

console.log('\n=== ✓ Estructura Core + Plugins VÁLIDA ===');
