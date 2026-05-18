import sequelize from './db.js';
import { Usuario } from '../src/models/Usuario.js';
import { Rol } from '../src/models/Rol.js';
import { UsuarioRol } from '../src/models/UsuarioRol.js';

/**
 * @fileoverview Configuración central de la BD.
 * Define relaciones entre modelos y sincroniza con PostgreSQL.
 * @module config/database
 */

//  Relaciones

// Usuario y Rol (N:M)

Usuario.belongsToMany(Rol, { through: UsuarioRol, foreignKey: 'usuario_id' });
Rol.belongsToMany(Usuario, { through: UsuarioRol, foreignKey: 'rol_id' });

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
