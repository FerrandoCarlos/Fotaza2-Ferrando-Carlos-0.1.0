import { connectDatabase } from '../../config/database.js';
import { Usuario } from '../models/Usuario.js';
import { Rol } from '../models/Rol.js';
import { Licencia } from '../models/Licencia.js';
import { Etiqueta } from '../models/Etiqueta.js';
import { Publicacion } from '../models/Publicacion.js';
import { Imagen } from '../models/Imagen.js';
import { PublicacionEtiqueta } from '../models/PublicacionEtiqueta.js';

/**
 * @fileoverview Seed de datos de prueba.
 * Ejecutar con: npm run seed
 * @module utils/seed
 */

/**
 * @function imagenBase64
 * @description Descarga una imagen y la convierte a Base64.
 * @param {string} url - URL de la imagen
 * @returns {Promise<string>} Base64 de la imagen
 */
async function imagenBase64(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mimeType = response.headers.get('content-type') || 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
}

async function seed() {
  await connectDatabase();

  // Roles
  const roles = await Rol.bulkCreate([
    { nombre: 'usuario', descripcion: 'Usuario registrado' },
    { nombre: 'validador', descripcion: 'Validador de contenido' },
  ]);

  // Usuarios
  const usuarios = await Usuario.bulkCreate([
    {
      nombre: 'Carlos',
      apellido: 'Ferrando',
      email: 'carlos@fotaza.com',
      password_hash: '12345678',
    },
    {
      nombre: 'Ana',
      apellido: 'Gomez',
      email: 'ana@fotaza.com',
      password_hash: '12345678',
    },
    {
      nombre: 'Luis',
      apellido: 'Martinez',
      email: 'luis@fotaza.com',
      password_hash: '12345678',
    },
  ]);

  // Licencias
  const licencias = await Licencia.bulkCreate([
    { nombre: 'Sin copyright', tiene_copyright: false },
    { nombre: 'Con copyright', tiene_copyright: true },
  ]);

  // Etiquetas
  const etiquetas = await Etiqueta.bulkCreate([
    { nombre: 'naturaleza' },
    { nombre: 'arquitectura' },
    { nombre: 'retrato' },
    { nombre: 'paisaje' },
    { nombre: 'macro' },
    { nombre: 'urbano' },
    { nombre: 'animales' },
  ]);
  // Descargar Imagenes
  console.log('📥 Descargando Imágenes....');
  const imgs = await Promise.all([
    imagenBase64('https://picsum.photos/seed/naturaleza/800/600'),
    imagenBase64('https://picsum.photos/seed/ciudad/800/600'),
    imagenBase64('https://picsum.photos/seed/retrato/800/600'),
    imagenBase64('https://picsum.photos/seed/paisaje/800/600'),
    imagenBase64('https://picsum.photos/seed/macro/800/600'),
    imagenBase64('https://picsum.photos/seed/animales/800/600'),
  ]);
  console.log('✅ Imágenes descargadas');

  // Publicaciones
  const publicaciones = await Publicacion.bulkCreate([
    {
      usuario_id: usuarios[0].id,
      titulo: 'Atardecer en las sierras',
      descripcion: 'Foto tomada en las sierras de Córdoba al atardecer',
      estado: 'activo',
    },
    {
      usuario_id: usuarios[1].id,
      titulo: 'Arquitectura urbana',
      descripcion: 'Centro histórico de la ciudad',
      estado: 'activo',
    },
    {
      usuario_id: usuarios[2].id,
      titulo: 'Retrato en blanco y negro',
      descripcion: 'Sesión de retratos en estudio',
      estado: 'activo',
    },
    {
      usuario_id: usuarios[0].id,
      titulo: 'Paisaje patagónico',
      descripcion: 'Vista de la Patagonia en otoño',
      estado: 'activo',
    },
    {
      usuario_id: usuarios[1].id,
      titulo: 'Mundo macro',
      descripcion: 'Fotografía macro de insectos',
      estado: 'activo',
    },
    {
      usuario_id: usuarios[2].id,
      titulo: 'Fauna silvestre',
      descripcion: 'Animales en su hábitat natural',
      estado: 'activo',
    },
  ]);
  // Imagenes
  await Imagen.bulkCreate([
    {
      publicacion_id: publicaciones[0].id,
      licencia_id: licencias[0].id,
      datos: imgs[0],
      mime_type: 'image/jpeg',
    },
    {
      publicacion_id: publicaciones[1].id,
      licencia_id: licencias[1].id,
      datos: imgs[1],
      mime_type: 'image/jpeg',
      marca_agua_texto: '© Ana Gomez',
    },
    {
      publicacion_id: publicaciones[2].id,
      licencia_id: licencias[0].id,
      datos: imgs[2],
      mime_type: 'image/jpeg',
    },
    {
      publicacion_id: publicaciones[3].id,
      licencia_id: licencias[0].id,
      datos: imgs[3],
      mime_type: 'image/jpeg',
    },
    {
      publicacion_id: publicaciones[4].id,
      licencia_id: licencias[1].id,
      datos: imgs[4],
      mime_type: 'image/jpeg',
      marca_agua_texto: '© Ana Gomez',
    },
    {
      publicacion_id: publicaciones[5].id,
      licencia_id: licencias[0].id,
      datos: imgs[5],
      mime_type: 'image/jpeg',
    },
  ]);

  // Etiquetas de publicaciones
  await PublicacionEtiqueta.bulkCreate([
    { publicacion_id: publicaciones[0].id, etiqueta_id: etiquetas[0].id },
    { publicacion_id: publicaciones[0].id, etiqueta_id: etiquetas[3].id },
    { publicacion_id: publicaciones[1].id, etiqueta_id: etiquetas[1].id },
    { publicacion_id: publicaciones[1].id, etiqueta_id: etiquetas[5].id },
    { publicacion_id: publicaciones[2].id, etiqueta_id: etiquetas[2].id },
    { publicacion_id: publicaciones[3].id, etiqueta_id: etiquetas[3].id },
    { publicacion_id: publicaciones[4].id, etiqueta_id: etiquetas[4].id },
    { publicacion_id: publicaciones[5].id, etiqueta_id: etiquetas[6].id },
  ]);
  console.log('✅ Seed completado');
  process.exit(0);
}
seed().catch((err) => {
  console.error('❌ Error en el seed:', err.message);
  process.exit(1);
});
