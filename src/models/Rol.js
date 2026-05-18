import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @fileoverview Modelo de Rol.
 * @module models/Rol
 */

/**
 * @typedef {object} Rol
 * @property {number} id - Clave primaria
 * @property {string} nombre - Nombre del rol
 * @property {string|null} descripcion - Descripción del rol
 */

export class Rol extends Model {}

Rol.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isIn: [['usuario', 'validador']],
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Rol',
    tableName: 'roles',
    timestamps: false,
  }
);
