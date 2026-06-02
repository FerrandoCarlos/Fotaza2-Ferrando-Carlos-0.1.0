import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import bcrypt from 'bcrypt';

/**
 * @fileoverview Modelo de Usuario
 * @module models/Usuario
 */

/**
 * @typedef {object} Usuario
 * @property {number} id - Clave primaria
 * @property {string} nombre - Nombre del usuario
 * @property {string} apellido - Apellido del usuario
 * @property {string} email - Email único del usuario
 * @property {string} password_hash - Contraseña hasheada
 * @property {string|null} avatar_url - URL del avatar
 * @property {Date} createdAt - Fecha de creación
 * @property {Date|null} deletedAt - Fecha de baja lógica
 */

export class Usuario extends Model {
  /**
   * @method verificarPassword
   * @description Verifica si la contraseña ingresada coincide con el hash guardado.
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<boolean>}
   */
  async verificarPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    createdAt: true,
    deletedAt: true,
    updatedAt: false,
    paranoid: true,
    hooks: {
      beforeSave: async (usuario) => {
        if (!usuario.password_hash) return;
        if (!usuario.isNewRecord && !usuario.changed('password_hash')) return;
        const salt = await bcrypt.genSalt(10);
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
      },
    },
  }
);
