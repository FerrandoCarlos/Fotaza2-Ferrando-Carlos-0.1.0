import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import { toDefaultValue } from 'sequelize/lib/utils';

/**
 * @fileoverview Modelo de Imagen.
 * @module models/Imagen
 */

/**
 * @typedef {object} Imagen
 * @property {number} id - Clave primaria
 * @property {number} publicacion_id - FK hacia Publicacion
 * @property {number} licencia_id - FK hacia Licencia
 * @property {string} datos - Imagen en Base64
 * @property {string} mime_type - Tipo de imagen (image/jpeg, image/png)
 * @property {string|null} marca_agua_texto - Texto de marca de agua
 * @property {Date} createdAt - Fecha de creación
 */

export class Imagen extends Model {}

Imagen.init(
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
    licencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'licencias',
        key: 'id',
      },
    },
    datos: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'image/jpeg',
    },
    marca_agua_texto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Imagen',
    tableName: 'imagenes',
    createdAt: true,
    updatedAt: false,
  }
);
