import { Publicacion } from '../models/Publicacion.js';
import { Imagen } from '../models/Imagen.js';
import { Usuario } from '../models/Usuario.js';
import { Etiqueta } from '../models/Etiqueta.js';
import { Licencia } from '../models/Licencia.js';
import { Comentario } from '../models/Comentario.js';
import { Op } from 'sequelize';
/**
 * @fileoverview Controller de la página de inicio.
 * @module controllers/homeController
 */
/**
 * @function detalle
 * @description Muestra el detalle de una publicación.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function detalle(req, res) {
  try {
    const { id } = req.params;

    const publicacion = await Publicacion.findOne({
      where: { id, estado: 'activo' },
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido'] },
        {
          model: Imagen,
          as: 'Imagens',
          include: [{ model: Licencia }],
        },
        { model: Etiqueta },
        {
          model: Comentario,
          required: false,
          paranoid: false,
          include: [
            {
              model: Usuario,
              attributes: ['nombre', 'apellido', 'avatar_url'],
            },
          ],
        },
      ],
    });

    if (!publicacion) return res.redirect('/');

    // si anónimo ingresa a una imagen con copy a registro
    const tieneCopyright = publicacion.Imagens.some(
      (img) => img.Licencium?.tiene_copyright
    );

    if (tieneCopyright && !res.locals.currentUser) {
      return res.redirect('/login');
    }

    res.render('pages/detalle', {
      title: publicacion.titulo,
      publicacion,
    });
  } catch (error) {
    console.error('✖️ Error en detalle: ', error.message);
    console.error(error.stack);
    res.redirect('/');
  }
}
/**
 * @function index
 * @description Muestra la galería pública de publicaciones.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function index(req, res) {
  try {
    const currentUser = res.locals.currentUser;
    const { search } = req.query;
    // Condición base de la consulta
    let condicionesMisFotos = { estado: 'activo' };
    let condicionesOtrasFotos = { estado: 'activo' };
    // si el usuario usó el buscador, agrego el filtro por titulo
    if (search) {
      const filtroBusqueda = {
        [Op.or]: [
          { titulo: { [Op.iLike]: `%${search}%` } },
          { descripcion: { [Op.iLike]: `%${search}%` } },
          { '$Etiqueta.nombre$': { [Op.iLike]: `%${search}%` } },
        ],
      };
      condicionesMisFotos = { ...condicionesMisFotos, ...filtroBusqueda };
      condicionesOtrasFotos = { ...condicionesOtrasFotos, ...filtroBusqueda };
    }

    // estructura de relaciones
    const includeEstructura = [
      { model: Usuario, attributes: ['nombre', 'apellido'] },
      {
        model: Imagen,
        as: 'Imagens',
        include: [{ model: Licencia }],
      },
      { model: Etiqueta },
    ];

    let misPublicaciones = [];
    let otrasPublicaciones = [];
    // Si hay sesión, separo mis publicaciones de las del resto
    if (currentUser) {
      condicionesMisFotos.usuario_id = currentUser.id;
      condicionesOtrasFotos.usuario_id = { [Op.ne]: currentUser.id };

      misPublicaciones = await Publicacion.findAll({
        where: condicionesMisFotos,
        include: includeEstructura,
        order: [['createdAt', 'DESC']],
        subQuery: false,
      });

      otrasPublicaciones = await Publicacion.findAll({
        where: condicionesOtrasFotos,
        include: includeEstructura,
        order: [['createdAt', 'DESC']],
        subQuery: false,
      });
    } else {
      // Si no hay sesión, todo va directo a otrasPublicaciones
      otrasPublicaciones = await Publicacion.findAll({
        where: condicionesOtrasFotos,
        include: includeEstructura,
        order: [['createdAt', 'DESC']],
      });
    }

    // Se muestran en carrusel solo publicaciones publicas
    const publicacionesCarrusel = otrasPublicaciones.filter((p) => {
      return (
        p.Imagens &&
        p.Imagens.length &&
        p.Imagens[0].Licencium &&
        !p.Imagens[0].Licencium.tiene_copyright
      );
    });

    const etiquetas = await Etiqueta.findAll();

    res.render('pages/index', {
      title: 'Inicio',
      misPublicaciones,
      otrasPublicaciones,
      publicacionesCarrusel,
      etiquetas,
      queryActual: search,
    });
  } catch (error) {
    console.error('❌ Error en home:', error.message);
    res.render('pages/index', {
      title: 'Inicio',
      misPublicaciones: [],
      otrasPublicaciones: [],
      publicacionesCarrusel: [],
      etiquetas: [],
      queryActual: '',
    });
  }
}
