import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @fileoverview Modelo de Valoracion.
 * @module models/Valoracion
 */

/**
 * @typedef {object} Valoracion
 * @property {number} id - Clave primaria
 * @property {number} imagen_id - FK hacia Imagen
 * @property {number} usuario_id - FK hacia Usuario
 * @property {number} valor - Valoración del 1 al 5
 * @property {Date} createdAt - Fecha de creación
 */
export class Valoracion extends Model {}

Valoracion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imagen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'imagenes',
        key: 'id',
      },
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    valor: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    sequelize,
    modelName: 'Valoracion',
    tableName: 'valoraciones',
    createdAt: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['imagen_id ', 'usuario_id'],
      },
    ],
  }
);
