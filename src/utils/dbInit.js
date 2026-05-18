import { connectDatabase } from '../../config/database.js';

/**
 * @fileoverview Script de inicialización de la base de datos.
 * Ejecutar con: npm run db:init
 */

console.log('🔄 Inicializando base de datos...');

connectDatabase()
  .then(() => {
    console.log('✅ Base de datos inicializada correctamente');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error al inicializar la BD:', err.message);
    process.exit(1);
  });
