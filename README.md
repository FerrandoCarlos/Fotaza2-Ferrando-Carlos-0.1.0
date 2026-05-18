# 📸 Fotaza 2 - Proyecto Integrador

Comunidad web para compartir y gestionar imágenes.
Desarrollado para la cátedra **Programación Web II**.

## 🛠️ Stack

- **Runtime:** Node.js
- **Framework:** Express v5
- **ORM:** Sequelize
- **Base de Datos:** PostgreSQL
- **Motor de Plantillas:** Pug
- **CSS:** Tailwind CSS v4

## 📁 Estructura del proyecto

     Fotaza2-Ferrando-Carlos-0.1.0/
    │
    ├── app.js                    # Entry point
    ├── .env.example              # Variables de entorno (plantilla)
    ├── .gitignore
    ├── README.md
    │
    ├── config/
    │   ├── db.js                 # Conexión Sequelize/PostgreSQL
    │   └── session.js            # Configuración de sesiones
    │
    ├── src/
    │   ├── controllers/          # Lógica de cada feature
    │   ├── models/               # Modelos Sequelize
    │   ├── services/             # Lógica de negocio (DRY)
    │   ├── middlewares/          # authGuard, roleGuard
    │   ├── routes/               # Definición de rutas
    │   └── utils/                # Helpers reutilizables
    │
    ├── views/
    │   ├── layout.pug            # Layout base
    │   ├── mixins/               # Componentes reutilizables
    │   ├── partials/             # Bloques fijos (navbar, footer)
    │   └── pages/                # Páginas completas
    │
    └── public/
        ├── css/
        ├── js/
        └── uploads/

## 🚀 Cómo correr el proyecto

1.  Clonar el repositorio

        git clone https://github.com/FerrandoCarlos/Fotaza2-Ferrando-Carlos-0.1.0.git

2.  Instalar dependencias

        npm install

3.  Configurar variables de entorno

        cp .env.example .env

    Editar `.env` con tus datos de PostgreSQL

4.  Inicializar la base de datos

        npm run db:init

5.  Compilar Tailwind _(terminal 1)_

        npm run tailwind

6.  Arrancar el servidor _(terminal 2)_

        npm start

## 🧑🏻 Desarrollado por

**Carlos Ferrando** - Programación Web II
