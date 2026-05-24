import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @fileoverview Modelo de Comentario.
 * @module models/Comentario
 */

/**
 * @typedef {object} Comentario
 * @property {number} id - Clave primaria
 * @property {number} publicacion_id - FK hacia Publicacion
 * @property {number} usuario_id - FK hacia Usuario
 * @property {string} contenido - Texto del comentario
 * @property {Date} createdAt - Fecha de creación
 * @property {Date|null} deletedAt - Fecha de baja lógica
 */

export class Comentario extends Model {}

Comentario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    publicacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'publicaciones',
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
  },
  {
    sequelize,
    modelName: 'Comentario',
    tableName: 'comentarios',
    createdAt: true,
    updatedAt: false,
    deletedAt: false,
    paranoid: true,
  }
);
