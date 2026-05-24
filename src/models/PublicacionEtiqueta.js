import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @fileoverview Modelo de tabla intermedia Publicacion-Etiqueta.
 * @module models/PublicacionEtiqueta
 */

/**
 * @typedef {object} PublicacionEtiqueta
 * @property {number} publicacion_id - FK hacia Publicacion
 * @property {number} etiqueta_id - FK hacia Etiqueta
 */

export class PublicacionEtiqueta extends Model {}

PublicacionEtiqueta.init(
  {
    publicacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'publicaciones',
        key: 'id',
      },
      etiqueta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'etiquetas',
          key: 'id',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'PublicacionEtiquetas',
    tableName: 'publicacion_etiquetas',
    timestamps: false,
  }
);
