import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @fileoverview Modelo de Seguimiento entre usuarios.
 * @module models/Seguimiento
 */

/**
 * @typedef {object} Seguimiento
 * @property {number} seguidor_id - FK hacia Usuario (quien sigue)
 * @property {number} seguido_id - FK hacia Usuario (quien es seguido)
 * @property {Date} createdAt - Fecha de seguimiento
 */

export class Seguimiento extends Model {}

Seguimiento.init(
  {
    seguidor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      seguido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'Seguimiento',
    tableName: 'seguimientos',
    createdAt: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['seguidor_id', 'seguido_id'],
      },
    ],
  }
);
