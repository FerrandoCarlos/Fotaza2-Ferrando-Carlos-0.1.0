import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import { types } from 'pg';

/**
 * @fileoverview Modelo de Sesion.
 * @module models/Sesion
 */

/**
 * @typedef {object} Sesion
 * @property {number} id - Clave primaria
 * @property {number} usuario_id - FK hacia Usuario
 * @property {string} token - Token único de sesión
 * @property {string|null} ip_address - IP del cliente
 * @property {string|null} user_agent - Navegador del cliente
 * @property {boolean} activa - Si la sesión está activa
 * @property {Date} expires_at - Fecha de expiración
 * @property {Date} createdAt - Fecha de creación
 */

export class Sesion extends Model {}

Sesion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Sesion',
    tableName: 'sesiones',
    createdAt: true,
    updatedAt: false,
  }
);
