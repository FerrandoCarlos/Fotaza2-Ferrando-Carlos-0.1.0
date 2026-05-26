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
      email: 'carlos@fotaza2.com',
      password_hash: '12345678',
    },
    {
      nombre: 'Karen',
      apellido: 'Gil',
      email: 'karen@fotaza2.com',
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
  ]);

  // Publicaciones
  const publicaciones = await Publicacion.bulkCreate([
    {
      usuario_id: usuarios[0].id,
      titulo: 'Atardecer en la sierras',
      descripcion: 'Foto tomada en las sierras de Córdoba',
      estado: 'activo',
    },
    {
      usuario_id: usuarios[1].id,
      titulo: 'Arquitectura urbana',
      descripcion: 'Centro histórico de la ciudad',
      estado: 'activo',
    },
  ]);

  // Etiquetas de publicaciones
  await PublicacionEtiqueta.bulkCreate([
    { publicacion_id: publicaciones[0].id, etiqueta_id: etiquetas[0].id },
    { publicacion_id: publicaciones[0].id, etiqueta_id: etiquetas[3].id },
    { publicacion_id: publicaciones[1].id, etiqueta_id: etiquetas[1].id },
  ]);
  console.log('✅ Seed completado');
  process.exit(0);
}
seed().catch((err) => {
  console.error('❌ Error en el seed:', err.message);
  process.exit(1);
});
