import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import { types } from 'pg';

/**
 * @fileoverview Modelo de tabla intermedia Usuario-Rol.
 * @module models/UsuarioRol
 */

/**
 * @typedef {object} UsuarioRol
 * @property {number} usuario_id - FK hacia Usuario
 * @property {number} rol_id - FK hacia Rol
 * @property {Date} createdAt - Fecha de asignación
 */

export class UsuarioRol extends Model {}

UsuarioRol.init(
  {
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'UsuarioRol',
    tableName: 'usuario_roles',
    createdAt: true,
    updatedAt: false,
    timestamps: true,
  }
);
