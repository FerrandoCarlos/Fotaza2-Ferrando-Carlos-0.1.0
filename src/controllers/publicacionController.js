import { z } from 'zod';
import { Publicacion } from '../models/Publicacion.js';
import { Imagen } from '../models/Imagen.js';
import { Etiqueta } from '../models/Etiqueta.js';
import { Licencia } from '../models/Licencia.js';
import { PublicacionEtiqueta } from '../models/PublicacionEtiqueta.js';

/**
 * @fileoverview Controller de publicaciones.
 * @module controllers/publicacionController
 */

const schemaPublicacion = z.object({
  titulo: z
    .string()
    .min(3, 'El titulo debe tener al menos 3 caracteres')
    .max(200),
  descripcion: z.string().max(2000).optional(),
  imgBase64: z.string().min(1, 'Debés seleccionar una imagen'),
  mimeType: z.string().min(1),
  licencia_id: z.coerce.number().int().positive(),
  marca_agua_texto: z.string().max(100).optional(),
  etiquetas: z
    .union([
      z.array(z.coerce.number().int()),
      z.coerce
        .number()
        .int()
        .transform((v) => [v]),
      z.string().transform((v) => [parseInt(v)]),
    ])
    .optional()
    .default([]),
});

/**
 * @function getDatosFormulario
 * @description Obtiene licencias y etiquetas para el formulario.
 * @returns {Promise<{licencias: Licencia[], etiquetas: Etiqueta[]}>}
 */
async function getDatosFormulario() {
  const [licencias, etiquetas] = await Promise.all([
    Licencia.findAll(),
    Etiqueta.findAll(),
  ]);
  return { licencias, etiquetas };
}
/**
 * @function mostrarFormulario
 * @description Muestra el formulario de nueva publicación.
 */
export async function mostrarFormulario(req, res) {
  try {
    const { licencias, etiquetas } = await getDatosFormulario();

    res.render('pages/nueva-publicacion', {
      title: 'Nueva publicación',
      licencias,
      etiquetas,
      alert: null,
      formValues: null,
    });
  } catch (error) {
    console.error('✖️ Error al cargar formulario:', error.message);
    res.redirect('/');
  }
}
/**
 * @function crear
 * @description Procesa la creación de una nueva publicación con su imagen.
 * Aplica marca de agua en el servidor si la licencia tiene copyright.
 */
export async function crear(req, res) {
  // Validación con zod
  const resultado = schemaPublicacion.safeParse(req.body);

  if (!resultado.success) {
    const mensaje = resultado.error.issues[0]?.message ?? 'Datos inválidos';
    const { licencias, etiquetas } = await getDatosFormulario();

    return res.render('pages/nueva-publicacion', {
      title: 'Nueva publicación',
      licencias,
      etiquetas,
      alert: { status: 'error', text: mensaje },
      formValues: req.body,
    });
  }
  const {
    titulo,
    descripcion,
    imgBase64,
    mimeType,
    licencia_id,
    marca_agua_texto,
    etiquetas,
  } = resultado.data;

  try {
    //   Verificar si la licencia tiene copy para aplicar marca de agua
    const licencia = await Licencia.findByPk(licencia_id);
    if (!licencia) {
      throw new Error('Licencia no encontrada');
    }
    // Crear publicación
    const publicacion = await Publicacion.create({
      usuario_id: req.session.userId,
      titulo,
      descripcion: descripcion || null,
    });
    // Crear la imagen asociada
    await Imagen.create({
      publicacion_id: publicacion.id,
      licencia_id,
      mime_type: mimeType,
      datos: imgBase64,
      marca_agua_texto:
        licencia.tiene_copyright && marca_agua_texto ? marca_agua_texto : null,
    });
    // Asociar etiquetas si se seleccionaron
    if (etiquetas.length > 0) {
      const registros = etiquetas.map((etiqueta_id) => ({
        publicacion_id: publicacion.id,
        etiqueta_id,
      }));
      await PublicacionEtiqueta.bulkCreate(registros);
    }

    res.redirect('/');
  } catch (error) {
    console.error('✖️ Error al crear publicacion:', error.message);
    const { licencias, etiquetas } = await getDatosFormulario();
    res.render('pages/nueva-publicacion', {
      title: 'Nueva publicación',
      licencias,
      etiquetas,
      alert: {
        status: 'error',
        text: 'Ocurrió un error al publicar. Intenta de nuevo',
      },
      formValues: req.body,
    });
  }
}
