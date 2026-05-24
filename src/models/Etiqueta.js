import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @fileoverview Modelo de Etiqueta.
 * @module models/Etiqueta
 */

/**
 * @typedef {object} Etiqueta
 * @property {number} id - Clave primaria
 * @property {string} nombre - Nombre único de la etiqueta
 */

export class Etiqueta extends Model {}

Etiqueta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Etiqueta',
    tableName: 'etiquetas',
    timestamps: false,
  }
);
