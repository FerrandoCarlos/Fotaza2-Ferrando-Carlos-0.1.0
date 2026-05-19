import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @fileoverview Modelo de Licencia de imagen.
 * @module models/Licencia
 */

/**
 * @typedef {object} Licencia
 * @property {number} id - Clave primaria
 * @property {string} nombre - Nombre de la licencia
 * @property {boolean} tiene_copyright - Si tiene copyright
 */

export class Licencia extends Model {}

Licencia.init(
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
    tiene_copyright: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Licencia',
    tableName: 'licencias',
    timestamps: false,
  }
);
