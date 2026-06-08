import { connectDatabase } from '../../config/database.js';
import sequelize from '../../config/db.js';
import { Usuario } from '../models/Usuario.js';
import { Rol } from '../models/Rol.js';
import { Licencia } from '../models/Licencia.js';
import { Etiqueta } from '../models/Etiqueta.js';
import { Publicacion } from '../models/Publicacion.js';
import { Imagen } from '../models/Imagen.js';
import { PublicacionEtiqueta } from '../models/PublicacionEtiqueta.js';
import { Comentario } from '../models/Comentario.js';
import { Valoracion } from '../models/Valoracion.js';
import { Seguimiento } from '../models/Seguimiento.js';
/**
 * @fileoverview Seed de datos de prueba.
 * Ejecutar con: npm run seed
 * @module utils/seed
 */

/**
 * @function imagenBase64Pura
 * @description Para las publicaciones. Devuelve el Base64 SIN prefijo y su mimetype.
 * @param {string} url - URL de la imagen
 * @returns {Promise<Object>} Objeto con datosPuros y mimeType
 */
async function imagenBase64Pura(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mimeType = response.headers.get('content-type') || 'image/jpeg';
  return {
    datosPuros: base64,
    mimeType: mimeType,
  };
}

/**
 * @function avatarBase64Completo
 * @description Para los avatares. Devuelve el Base64 CON prefijo listo para usar como URL.
 */
async function avatarBase64Completo(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mimeType = response.headers.get('content-type') || 'image/svg+xml';
  return `data:${mimeType};base64,${base64}`;
}

async function seed() {
  await connectDatabase();

  await sequelize.query(
    'TRUNCATE TABLE publicacion_etiquetas, imagenes, publicaciones, comentarios, valoraciones, seguimientos, etiquetas, licencias, usuario_roles, sesiones, usuarios, roles RESTART IDENTITY CASCADE'
  );

  // Roles
  const roles = await Rol.bulkCreate([
    { nombre: 'usuario', descripcion: 'Usuario registrado' },
    { nombre: 'validador', descripcion: 'Validador de contenido' },
  ]);

  // Descarga de avatares
  console.log('📥 Descargando Avatares para pruebas....');
  const avatares = await Promise.all([
    avatarBase64Completo(
      'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
    ),
    avatarBase64Completo(
      'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka'
    ),
    avatarBase64Completo(
      'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack'
    ),
  ]);
  console.log('✅ Avatares descargados');

  // Usuarios
  const datosUsuarios = [
    {
      nombre: 'Carlos',
      apellido: 'Ferrando',
      email: 'carlos@fotaza.com',
      password_hash: '12345678',
      avatar_url: avatares[0],
    },
    {
      nombre: 'Ana',
      apellido: 'Gomez',
      email: 'ana@fotaza.com',
      password_hash: '12345678',
      avatar_url: avatares[1],
    },
    {
      nombre: 'Luis',
      apellido: 'Martinez',
      email: 'luis@fotaza.com',
      password_hash: '12345678',
      avatar_url: avatares[2],
    },
    {
      nombre: 'Mariano',
      apellido: 'Silva',
      email: 'mariano@fotaza.com',
      password_hash: '12345678',
      avatar_url: null,
    },
    {
      nombre: 'Florencia',
      apellido: 'Carrizo',
      email: 'flor@fotaza.com',
      password_hash: '12345678',
      avatar_url: null,
    },
    {
      nombre: 'Bautista',
      apellido: 'Perez',
      email: 'bauti@fotaza.com',
      password_hash: '12345678',
      avatar_url: null,
    },
    {
      nombre: 'Valentina',
      apellido: 'Luna',
      email: 'valen@fotaza.com',
      password_hash: '12345678',
      avatar_url: null,
    },
    {
      nombre: 'Facundo',
      apellido: 'Rios',
      email: 'facu@fotaza.com',
      password_hash: '12345678',
      avatar_url: null,
    },
  ];

  console.log('👥 Insertando usuarios secuencialmente...');
  const usuarios = [];
  for (const datos of datosUsuarios) {
    const nuevoUsuario = await Usuario.create(datos);
    usuarios.push(nuevoUsuario);
  }
  console.log('✅ Usuarios insertados en orden perfecto');
  // Licencias
  const licencias = await Licencia.bulkCreate([
    { nombre: 'Sin copyright', tiene_copyright: false },
    { nombre: 'Con copyright', tiene_copyright: true },
  ]);

  //  Etiquetas
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
  console.log('📥 Descargando Imágenes estables para la Home...');
  const imgs = await Promise.all([
    imagenBase64Pura('https://picsum.photos/seed/naturaleza/800/600'), // 0. Atardecer en las sierras (Es una playa/costa grisácea)
    imagenBase64Pura('https://picsum.photos/id/43/800/600'), // 1. Arquitectura urbana (Ana Gomez - Candado)
    imagenBase64Pura('https://picsum.photos/seed/retrato/800/600'), // 2. Retrato en blanco y negro (Manos en consola)
    imagenBase64Pura('https://picsum.photos/id/1016/800/600'), // 3. Paisaje patagónico (Montañas reales de la Patagonia)
    imagenBase64Pura('https://picsum.photos/id/1080/800/600'), // 4. Mundo macro (Ana Gomez - Candado)
    imagenBase64Pura('https://picsum.photos/seed/animales/800/600'), // 5. Fauna silvestre (Leopardo)
    imagenBase64Pura('https://picsum.photos/id/111/800/600'), // 6. Nissan en la ciudad (Un auto real metido en la calle)
    imagenBase64Pura('https://picsum.photos/id/122/800/600'), // 7. Luces de neón (Flor Carrizo - Candado)
    imagenBase64Pura('https://picsum.photos/id/292/800/600'), // 8. Detalles gastronómicos (Un plato de comida/restaurante real)
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
    {
      usuario_id: usuarios[3].id,
      titulo: 'Nissan en la ciudad',
      descripcion: 'Fotografía nocturna urbana cazando joyitas sobre ruedas',
      estado: 'activo',
    },
    {
      usuario_id: usuarios[4].id,
      titulo: 'Luces de neón',
      descripcion: 'Larga exposición en el centro financiero',
      estado: 'activo',
    },
    {
      usuario_id: usuarios[5].id,
      titulo: 'Detalles gastronómicos',
      descripcion: 'Fotografía de producto en restaurante local',
      estado: 'activo',
    },
  ]);

  // Imagenes
  await Imagen.bulkCreate([
    {
      publicacion_id: publicaciones[0].id,
      licencia_id: licencias[0].id,
      datos: imgs[0].datosPuros,
      mime_type: imgs[0].mimeType,
    },
    {
      publicacion_id: publicaciones[1].id,
      licencia_id: licencias[1].id,
      datos: imgs[1].datosPuros,
      mime_type: imgs[1].mimeType,
      marca_agua_texto: '© Ana Gomez',
    },
    {
      publicacion_id: publicaciones[2].id,
      licencia_id: licencias[0].id,
      datos: imgs[2].datosPuros,
      mime_type: imgs[2].mimeType,
    },
    {
      publicacion_id: publicaciones[3].id,
      licencia_id: licencias[0].id,
      datos: imgs[3].datosPuros,
      mime_type: imgs[3].mimeType,
    },
    {
      publicacion_id: publicaciones[4].id,
      licencia_id: licencias[1].id,
      datos: imgs[4].datosPuros,
      mime_type: imgs[4].mimeType,
      marca_agua_texto: '© Ana Gomez',
    },
    {
      publicacion_id: publicaciones[5].id,
      licencia_id: licencias[0].id,
      datos: imgs[5].datosPuros,
      mime_type: imgs[5].mimeType,
    },
    {
      publicacion_id: publicaciones[6].id,
      licencia_id: licencias[0].id,
      datos: imgs[6].datosPuros,
      mime_type: imgs[6].mimeType,
    },
    {
      publicacion_id: publicaciones[7].id,
      licencia_id: licencias[1].id,
      datos: imgs[7].datosPuros,
      mime_type: imgs[7].mimeType,
      marca_agua_texto: '© Flor Carrizo',
    },
    {
      publicacion_id: publicaciones[8].id,
      licencia_id: licencias[0].id,
      datos: imgs[8].datosPuros,
      mime_type: imgs[8].mimeType,
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
    { publicacion_id: publicaciones[6].id, etiqueta_id: etiquetas[1].id },
    { publicacion_id: publicaciones[7].id, etiqueta_id: etiquetas[5].id },
    { publicacion_id: publicaciones[8].id, etiqueta_id: etiquetas[4].id },
  ]);

  // Comentarios
  await Comentario.bulkCreate([
    {
      publicacion_id: publicaciones[1].id,
      usuario_id: usuarios[0].id,
      contenido: 'Increíble captura, los detalles son impresionantes.',
    },
    {
      publicacion_id: publicaciones[1].id,
      usuario_id: usuarios[2].id,
      contenido: 'Me encanta la composición urbana.',
    },
    {
      publicacion_id: publicaciones[0].id,
      usuario_id: usuarios[1].id,
      contenido: 'Qué hermoso atardecer, me recuerda a Córdoba.',
    },
    {
      publicacion_id: publicaciones[3].id,
      usuario_id: usuarios[2].id,
      contenido: 'La Patagonia siempre sorprende.',
    },
    {
      publicacion_id: publicaciones[5].id,
      usuario_id: usuarios[0].id,
      contenido: 'Foto increíble, el leopardo está perfecto.',
    },
    {
      publicacion_id: publicaciones[6].id,
      usuario_id: usuarios[1].id,
      contenido: 'Gran ojo para los autos clásicos.',
    },
  ]);

  // Valoraciones (no puede valorar el autor de la publicación)
  await Valoracion.bulkCreate([
    { imagen_id: 1, usuario_id: usuarios[1].id, valor: 5 }, // Ana valora foto de Carlos
    { imagen_id: 1, usuario_id: usuarios[2].id, valor: 4 }, // Luis valora foto de Carlos
    { imagen_id: 1, usuario_id: usuarios[3].id, valor: 5 }, // Mariano valora foto de Carlos
    { imagen_id: 2, usuario_id: usuarios[0].id, valor: 4 }, // Carlos valora foto de Ana
    { imagen_id: 2, usuario_id: usuarios[2].id, valor: 5 }, // Luis valora foto de Ana
    { imagen_id: 2, usuario_id: usuarios[3].id, valor: 4 }, // Mariano valora foto de Ana
    { imagen_id: 3, usuario_id: usuarios[0].id, valor: 3 }, // Carlos valora foto de Luis
    { imagen_id: 3, usuario_id: usuarios[1].id, valor: 4 }, // Ana valora foto de Luis
    { imagen_id: 5, usuario_id: usuarios[0].id, valor: 5 }, // Carlos valora foto de Ana (macro)
    { imagen_id: 6, usuario_id: usuarios[1].id, valor: 4 }, // Ana valora foto de Luis (fauna)
  ]);

  // Seguimientos
  await Seguimiento.bulkCreate([
    { seguidor_id: usuarios[0].id, seguido_id: usuarios[1].id }, // Carlos sigue a Ana
    { seguidor_id: usuarios[0].id, seguido_id: usuarios[2].id }, // Carlos sigue a Luis
    { seguidor_id: usuarios[1].id, seguido_id: usuarios[0].id }, // Ana sigue a Carlos
    { seguidor_id: usuarios[2].id, seguido_id: usuarios[0].id }, // Luis sigue a Carlos
    { seguidor_id: usuarios[3].id, seguido_id: usuarios[1].id }, // Mariano sigue a Ana
  ]);

  const count = await Usuario.count();
  console.log(` px ✅ Usuarios en BD: ${count}`);

  console.log('✅ Seed completado');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en el seed:', err.message);
  process.exit(1);
});
