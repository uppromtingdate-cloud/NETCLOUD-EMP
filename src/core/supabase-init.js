// core/supabase-init.js
// Inicialización de Supabase para autenticación y base de datos

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/+esm';

// Configuración de Supabase
// NOTA: Reemplaza estos valores con tus credenciales de Supabase
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Crear cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Obtiene la sesión actual del usuario
 */
export async function getCurrentSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    return null;
  }
}

/**
 * Registra un nuevo usuario
 */
export async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error en registro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Inicia sesión con email y contraseña
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Cierra sesión del usuario actual
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Escucha cambios en la autenticación
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session);
  });
}
