import { z } from 'zod';
import { Usuario } from '../models/Usuario.js';

/**
 * @fileoverview Controller de autenticación.
 * @module controllers/authController
 */

const schemaRegistro = z
  .object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('El email no es válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

const schemaLogin = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

/**
 * @function mostrarLogin
 * @description Muestra el formulario de inicio de sesión.
 */
export function mostrarLogin(req, res) {
  const alert =
    req.query.registro === 'ok'
      ? { status: 'success', text: '¡Cuenta creada! Inicia sesión.' }
      : null;

  res.render('pages/login', {
    title: 'Iniciar sesión',
    alert,
    formValues: null,
  });
}
/**
 * @function mostrarRegistro
 * @description Muestra el formulario de registro.
 */
export function mostrarRegistro(req, res) {
  res.render('pages/register', {
    title: 'Registrarse',
    alert: null,
    formValues: null,
  });
}
/**
 * @function login
 * @description Procesa el inicio de sesión.
 */
export async function login(req, res) {
  const resultado = schemaLogin.safeParse(req.body);

  if (!resultado.success) {
    const mensaje = resultado.error.issues[0].message ?? 'Datos inválidos';
    return res.render('pages/login', {
      alert: { status: 'error', text: mensaje },
      formValues: req.body,
    });
  }
  const { email, password } = resultado.data;
  try {
    const usuario = await Usuario.findOne({ where: { email } });

    const passwordValida =
      usuario && (await usuario.verificarPassword(password));

    if (!passwordValida) {
      return res.render('pages/login', {
        alert: { status: 'error', text: 'Email o contraseña incorrectos.' },
        formValues: req.body,
      });
    }

    if (!usuario.activo) {
      return res.render('pages/login', {
        alert: { status: 'error', text: 'Tu cuenta fue desactivada.' },
        formValues: null,
      });
    }

    req.session.userId = usuario.id;
    res.redirect('/');
  } catch (error) {
    console.error('✖️ Error en login:', error.message);
    res.render('pages/login', {
      alert: { status: 'error', text: 'Ocurrió un error. Intenta de nuevo.' },
      formValues: req.body,
    });
  }
}

/**
 * @function registro
 * @description Procesa el registro de un nuevo usuario.
 */
export async function registro(req, res) {
  const resultado = schemaRegistro.safeParse(req.body);
  if (!resultado.success) {
    const mensaje = resultado.error.issues[0].message ?? 'Datos inválidos';
    return res.render('pages/register', {
      alert: { status: 'error', text: mensaje },
      formValues: req.body,
    });
  }
  const { nombre, apellido, email, password } = resultado.data;
  try {
    await Usuario.create({ nombre, apellido, email, password_hash: password });
    res.redirect('/login?registro=ok');
  } catch (error) {
    const mensaje =
      error.name === 'SequelizeUniqueConstraintError'
        ? 'Ya existe una cuenta con ese email.'
        : 'Ocurrió un error al registrarse. Intentá de nuevo.';

    res.render('pages/register', {
      alert: { status: 'error', text: mensaje },
      formValues: req.body,
    });
  }
}

/**
 * @function logout
 * @description Cierra la sesión del usuario.
 */
export function logout(req, res) {
  req.session.destroy(() => res.redirect('/login'));
}
