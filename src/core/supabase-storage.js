// core/supabase-storage.js
// Gestión de datos en Supabase (reemplaza storage-utils.js)

import { supabase } from './supabase-init.js';

/**
 * Obtiene todos los clientes del usuario actual
 */
export async function getClientes() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return [];
  }
}

/**
 * Guarda o actualiza clientes
 */
export async function saveClientes(clientes) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    // Eliminar clientes existentes
    await supabase.from('clientes').delete().eq('user_id', user.id);

    // Insertar nuevos clientes
    const { error } = await supabase
      .from('clientes')
      .insert(clientes.map(c => ({ ...c, user_id: user.id })));

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error guardando clientes:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene todos los ingresos del usuario
 */
export async function getEgresos() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('ingresos')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo ingresos:', error);
    return [];
  }
}

/**
 * Guarda ingresos
 */
export async function saveEgresos(ingresos) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    await supabase.from('ingresos').delete().eq('user_id', user.id);

    const { error } = await supabase
      .from('ingresos')
      .insert(ingresos.map(i => ({ ...i, user_id: user.id })));

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error guardando ingresos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene todos los documentos del usuario
 */
export async function getDocumentos() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo documentos:', error);
    return [];
  }
}

/**
 * Guarda documentos
 */
export async function saveDocumentos(documentos) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    await supabase.from('documentos').delete().eq('user_id', user.id);

    const { error } = await supabase
      .from('documentos')
      .insert(documentos.map(d => ({ ...d, user_id: user.id })));

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error guardando documentos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene todas las interacciones del usuario
 */
export async function getInteracciones() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('interacciones')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo interacciones:', error);
    return [];
  }
}

/**
 * Guarda interacciones
 */
export async function saveInteracciones(interacciones) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    await supabase.from('interacciones').delete().eq('user_id', user.id);

    const { error } = await supabase
      .from('interacciones')
      .insert(interacciones.map(i => ({ ...i, user_id: user.id })));

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error guardando interacciones:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Agrega una interacción
 */
export async function agregarInteraccion(clienteId, clienteNombre, tipo, descripcion) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const { error } = await supabase
      .from('interacciones')
      .insert([{
        user_id: user.id,
        clienteId,
        clienteNombre,
        tipo,
        descripcion,
        fecha: new Date().toISOString()
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error agregando interacción:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Elimina un cliente
 */
export async function eliminarCliente(clienteId) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', clienteId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    return { success: false, error: error.message };
  }
}
