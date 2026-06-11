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
  etiquetasTexto: z.string().optional().default(''),
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
 * @function procesarEtiquetas
 * @description Crea etiquetas si no existen y retorna los registros para bulkCreate.
 * @param {string} etiquetasTexto - Etiquetas separadas por coma
 * @param {number} publicacion_id - ID de la publicación
 * @returns {Promise<void>}
 */
async function procesarEtiquetas(etiquetasTexto, publicacion_id) {
  if (!etiquetasTexto || typeof etiquetasTexto !== 'string') return;

  const nombresUnicos = [
    ...new Set(
      etiquetasTexto
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0)
    ),
  ];

  if (nombresUnicos.length === 0) return;

  const resultados = await Promise.all(
    nombresUnicos.map((nombre) => Etiqueta.findOrCreate({ where: { nombre } }))
  );

  const relacionesExistentes = await PublicacionEtiqueta.findAll({
    where: { publicacion_id: Number(publicacion_id) },
  });

  const idsExistentes = relacionesExistentes.map((r) => r.etiqueta.id);

  const nuevasRelaciones = resultados
    .map((resultado) => resultado[0])
    .filter((etiqueta) => !idsExistentes.includes(etiqueta.id))
    .map((etiqueta) => ({
      publicacion_id: Number(publicacion_id),
      etiqueta_id: Number(etiqueta.id),
    }));

  if (nuevasRelaciones.length > 0) {
    await PublicacionEtiqueta.bulkCreate(nuevasRelaciones, {
      ignoreDuplicates: true,
    });
    console.log(
      `✔️ Se vincularon ${nuevasRelaciones.length} etiquetas nuevas.`
    );
  }
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
    etiquetasTexto = '',
  } = resultado.data;

  try {
    // Verificar si el usuario realmente esta logueado
    if (!req.session || !req.session.userId) {
      console.error('✖️ Intento de publicación sin sesión activa.');
      return res.redirect('/login');
    }
    //   Verificar si la licencia tiene copy para aplicar marca de agua
    const licencia = await Licencia.findByPk(licencia_id);
    if (!licencia) {
      const { licencias, etiquetas } = await getDatosFormulario();
      return res.render('pages/nueva-publicacion', {
        title: 'Nueva publicación',
        licencias,
        etiquetas,
        alert: {
          status: 'error',
          text: 'La licencia seleccionada no es válida.',
        },
        formValues: req.body,
      });
    }
    // Crear publicación
    const publicacion = await Publicacion.create({
      usuario_id: req.session.userId,
      titulo,
      descripcion: descripcion || null,
      estado: 'activo',
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

    try {
      await procesarEtiquetas(etiquetasTexto, publicacion.id);
    } catch (tagError) {
      console.error(
        '⚠️ Error no crítico al procesar etiquetas:',
        tagError.message
      );
    }

    res.redirect('/');
  } catch (error) {
    console.error('✖️ Error al crear publicacion:', error.message);
    console.error(error.stack);

    const { licencias, etiquetas } = await getDatosFormulario();
    res.render('pages/nueva-publicacion', {
      title: 'Nueva publicación',
      licencias,
      etiquetas,
      alert: {
        status: 'error',
        text: `Error al publicar: ${error.message}. Intenta de nuevo.`,
      },
      formValues: req.body,
    });
  }
}
/**
 * @function mostrarEditar
 * @description Muestra el formulario de edición de una publicación.
 */
export async function mostrarEditar(req, res) {
  try {
    const publicacion = await Publicacion.findOne({
      where: { id: req.params.id, usuario_id: req.session.userId },
      include: [{ model: Imagen, as: 'Imagens' }, { model: Etiqueta }],
    });

    if (!publicacion) return res.redirect('/');

    const { licencias, etiquetas } = await getDatosFormulario();
    const etiquetasSeleccionadas = publicacion.Etiqueta.map((e) => e.id);

    res.render('pages/editar-publicacion', {
      title: 'Editar publicación',
      publicacion,
      licencias,
      etiquetas,
      etiquetasSeleccionadas,
      alert: null,
    });
  } catch (error) {
    console.error('✖️ Error al cargar edición:', error.message);
    res.redirect('/');
  }
}
/**
 * @function editar
 * @description Procesa la edición de una publicación existente.
 */
export async function editar(req, res) {
  const resultado = schemaPublicacion.safeParse(req.body);

  if (!resultado.success) {
    const mensaje = resultado.error.issues[0]?.message ?? 'Datos inválidos';
    const { licencias, etiquetas } = await getDatosFormulario();
    const publicacion = await Publicacion.findByPk(req.params.id);
    return res.render('pages/editar-publicacion', {
      title: 'Editar publicación',
      publicacion,
      licencias,
      etiquetas,
      etiquetasSeleccionadas: [],
      alert: { status: 'error', text: mensaje },
    });
  }

  const {
    titulo,
    descripcion,
    imgBase64,
    mimeType,
    licencia_id,
    marca_agua_texto,
    etiquetasTexto = '',
  } = resultado.data;

  try {
    const publicacion = await Publicacion.findOne({
      where: { id: req.params.id, usuario_id: req.session.userId },
    });
    if (!publicacion) return res.redirect('/');

    // verificar denuncias - no editar
    if (publicacion.estado !== 'activo') {
      return res.redirect('/');
    }
    await publicacion.update({ titulo, descripcion: descripcion || null });
    // actualizar imagen
    const licencia = await Licencia.findByPk(licencia_id);
    await Imagen.update(
      {
        licencia_id,
        datos: imgBase64,
        mime_type: mimeType,
        marca_agua_texto:
          licencia.tiene_copyright && marca_agua_texto
            ? marca_agua_texto
            : null,
      },
      { where: { publicacion_id: publicacion.id } }
    );
    await procesarEtiquetas(etiquetasTexto, publicacion.id);
    res.redirect('/');
  } catch (error) {
    console.error('✖️ Error al editar:', error.message);
    res.redirect('/');
  }
}
/**
 * @function eliminar
 * @description Elimina una publicación del usuario autenticado.
 */
export async function eliminar(req, res) {
  try {
    const publicacion = await Publicacion.findOne({
      where: { id: req.params.id, usuario_id: req.session.userId },
    });

    // eliminar si no tiene denuncias activas
    if (!publicacion || publicacion.estado !== 'activo')
      return res.redirect('/');

    await publicacion.destroy();
    res.redirect('/');
  } catch (error) {
    console.error('✖️ Error al eliminar:', error.message);
    res.redirect('/');
  }
}
