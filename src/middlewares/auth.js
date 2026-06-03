import { Usuario } from '../models/Usuario.js';

/**
 * @fileoverview Middleware de autenticación.
 * @module middlewares/auth
 */

/**
 * @function authMiddleware
 * @description Verifica si hay una sesión activa y carga el usuario en res.locals.
 */
export async function authMiddleware(req, res, next) {
  const userId = req.session.userId;
  if (!userId) {
    next();
    return;
  }
  try {
    const usuario = await Usuario.findByPk(userId, {
      attributes: ['id', 'nombre', 'apellido', 'email', 'avatar_url', 'activo'],
    });
    if (!usuario) {
      req.session.destroy();
      next();
      return;
    }
    res.locals.currentUser = usuario;
  } catch (error) {
    console.error('✖️ Error en authMiddleware:', error.message);
  }
  next();
}
/**
 * @function requireAuth
 * @description Redirige al login si no hay sesión activa.
 */
export function requireAuth(req, res, next) {
  if (!res.locals.currentUser) {
    return res.redirect('/login');
  }
  if (!res.locals.currentUser.activo) {
    req.session.destroy();
    return res.redirect('/login');
  }
  next();
}
