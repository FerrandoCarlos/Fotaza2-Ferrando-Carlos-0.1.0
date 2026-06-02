import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

/**
 * @fileoverview Conexión a la base de datos  con Sequelize.
 * @module config/db
 */

/**
 * @type {Sequelize}
 * @description Instancia de Sequelize conectada a PostgreSQL.
 */

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export default sequelize;
