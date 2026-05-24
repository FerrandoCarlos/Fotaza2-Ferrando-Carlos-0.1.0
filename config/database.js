import sequelize from './db.js';
import { Usuario } from '../src/models/Usuario.js';
import { Rol } from '../src/models/Rol.js';
import { UsuarioRol } from '../src/models/UsuarioRol.js';
import { Sesion } from '../src/models/Sesion.js';
import { Licencia } from '../src/models/Licencia.js';
import { Publicacion } from '../src/models/Publicacion.js';
import { Imagen } from '../src/models/Imagen.js';
import { Etiqueta } from '../src/models/Etiqueta.js';
import { PublicacionEtiqueta } from '../src/models/PublicacionEtiqueta.js';
import { Comentario } from '../src/models/Comentario.js';
import { Valoracion } from '../src/models/Valoracion.js';

/**
 * @fileoverview Configuración central de la BD.
 * Define relaciones entre modelos y sincroniza con PostgreSQL.
 * @module config/database
 */

//  Relaciones

// Usuario y Rol (N:M)
Usuario.belongsToMany(Rol, { through: UsuarioRol, foreignKey: 'usuario_id' });
Rol.belongsToMany(Usuario, { through: UsuarioRol, foreignKey: 'rol_id' });

// Usuario y Sesion (1:N)
Usuario.hasMany(Sesion, { foreignKey: 'usuario_id' });
Sesion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Publicacion e Imagen (1:N)
Publicacion.hasMany(Imagen, { foreignKey: 'publicacion_id' });
Imagen.belongsTo(Publicacion, { foreignKey: 'publicacion_id' });

// Imagen y Licencia (N:1)
Imagen.belongsTo(Licencia, { foreignKey: 'licencia_id' });
Licencia.hasMany(Imagen, { foreignKey: 'licencia_id' });

// Usuario y Publicacion (1:N)
Usuario.hasMany(Publicacion, { foreignKey: 'usuario_id' });
Publicacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

//Publicacion y Etiqueta (N:M)
Publicacion.belongsToMany(Etiqueta, {
  through: PublicacionEtiqueta,
  foreignKey: 'publicacion_id',
});
Etiqueta.belongsToMany(Publicacion, {
  through: PublicacionEtiqueta,
  foreignKey: 'etiqueta_id',
});

// Publicacion y Comentario (1:N)
Publicacion.hasMany(Comentario, { foreignKey: 'publicacion_id' });
Comentario.belongsTo(Publicacion, { foreignKey: 'publicacion_id' });

// Usuario y Comentario (1:N)
Usuario.hasMany(Comentario, { foreignKey: 'usuario_id' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Imagen y Valoracion (1:N)
Imagen.hasMany(Valoracion, { foreignKey: 'imagen_id' });
Valoracion.belongsTo(Imagen, { foreignKey: 'imagen_id' });

// Usauario y Valoracion (1:N)
Usuario.hasMany(Valoracion, { foreignKey: 'usuario_id' });
Valoracion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

/**
 * @function connectDatabase
 * @description Conecta y sincroniza la base de datos.
 * @returns {Promise<void>}
 */

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✔️ Conexión a la BD establecida');

    await sequelize.sync({ alter: true });
    console.log('✔️ BD sincronizada');
  } catch (error) {
    console.error('✖️ Error al conectar la BD:', error.message);
  }
}
