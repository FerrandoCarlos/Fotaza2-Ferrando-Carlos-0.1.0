import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

/**
 * @fileoverview Modelo de Publicacion.
 * @module models/Publicacion
 */

/**
 * @typedef {object} Publicacion
 * @property {number} id - Clave primaria
 * @property {number} usuario_id - FK hacia Usuario
 * @property {string} titulo - Título de la publicación
 * @property {string|null} descripcion - Descripción opcional
 * @property {string} estado - Estado de la publicación
 * @property {boolean} comentarios_cerrados - Si los comentarios están cerrados
 * @property {Date} createdAt - Fecha de creación
 * @property {Date|null} deletedAt - Fecha de baja lógica
 */

export class Publicacion extends Model {}

Publicacion.init({
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
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'activo',
    validate: {
      isIn: [['activo', 'baja', 'revision']],
    },
  },
    comentarios_cerrados: {
        type: DataTypes.BOOLEAN,
        dafaultValue: false
    },
    {
        sequelize,
        modelName: 'Publicacion',
        tableName: 'publicaciones',
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        paranoid:true
    }
});
