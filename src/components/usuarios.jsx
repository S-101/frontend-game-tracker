import { useState, useEffect } from 'react';

const USUARIOS_KEY = 'usuarios_reseñas';

// Cargar usuarios desde localStorage
const cargarUsuarios = () => {
  try {
    const stored = localStorage.getItem(USUARIOS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Guardar usuarios en localStorage
const guardarUsuarios = (lista) => {
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(lista));
};

// Estado global compartido para usuarios que vienen del formulario de reseñas
let usuarios = cargarUsuarios();

// Función para que reseña.jsx guarde un nuevo usuario
export const guardarUsuarioLocal = (nuevoUsuario) => {
  if (!nuevoUsuario.trim()) return;
  // Evitar duplicados
  if (!usuarios.includes(nuevoUsuario.trim())) {
    usuarios = [...usuarios, nuevoUsuario.trim()];
    guardarUsuarios(usuarios);
  }
};

// Función para que el card de reseñas obtenga la lista actualizada
export const obtenerUsuarioLocal = () => {
  return usuarios.length > 0 ? usuarios[usuarios.length - 1] : '';
};

// Hook personalizado para suscribirse a cambios en la lista
export const useUsuarios = () => {
  const [lista, setLista] = useState(usuarios);

  useEffect(() => {
    const sync = () => setLista(cargarUsuarios());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return lista;
};
