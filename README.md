# 📸 Fotaza 2 - Proyecto Integrador

Comunidad web para compartir y gestionar imágenes.
Desarrollado para la cátedra **Programación Web II**.

## 🛠️ Stack

- **Runtime:** Node.js
- **Framework:** Express v5
- **ORM:** Sequelize
- **Base de Datos:** PostgreSQL (Neon en producción)
- **Motor de Plantillas:** Pug
- **Estilos / CSS:** Tailwind CSS v4 (vía `@tailwindcss/cli`)
- **Validación de Datos:** Zod

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
    │   └── database.js           # Relaciones y sincronización
    │
    ├── src/
    │   ├── controllers/          # Lógica de cada feature
    │   ├── models/               # Modelos Sequelize
    │   ├── middlewares/          # authGuard, roleGuard
    │   ├── routes/               # Definición de rutas
    │   └── utils/                # dbinit y seed
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

### 1. Clonar el repositorio

```bash
git clone https://github.com/FerrandoCarlos/Fotaza2-Ferrando-Carlos-0.1.0.git
cd Fotaza2-Ferrando-Carlos-0.1.0
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Inicializar la base de datos y cargar datos de prueba

```bash
npm run db:init
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus datos de PostgreSQL.

### 5. Iniciar el servidor

```bash
npm start
```

La aplicación quedará disponible en **http://localhost:3000**

---

## ⚙️ Variables de entorno

Crear un archivo `.env` basado en `.env.example`:

| Variable         | Descripción                 | Ejemplo                  |
| ---------------- | --------------------------- | ------------------------ |
| `DB_HOST`        | Host de PostgreSQL          | `localhost`              |
| `DB_PORT`        | Puerto de PostgreSQL        | `5432`                   |
| `DB_NAME`        | Nombre de la base de datos  | `fotaza2`                |
| `DB_USER`        | Usuario de PostgreSQL       | `postgres`               |
| `DB_PASSWORD`    | Contraseña de PostgreSQL    | `tu_password`            |
| `PORT`           | Puerto del servidor         | `3000`                   |
| `SESSION_SECRET` | Clave secreta para sesiones | `cadena_larga_aleatoria` |
| `NODE_ENV`       | Entorno de ejecución        | `development`            |

---

## 👥 Usuarios de prueba

Luego de ejecutar `npm run db:init` estarán disponibles los siguientes usuarios:

| Nombre            | Email              | Contraseña | Rol     |
| ----------------- | ------------------ | ---------- | ------- |
| Carlos Ferrando   | carlos@fotaza.com  | 12345678   | usuario |
| Ana Gomez         | ana@fotaza.com     | 12345678   | usuario |
| Luis Martinez     | luis@fotaza.com    | 12345678   | usuario |
| Mariano Silva     | mariano@fotaza.com | 12345678   | usuario |
| Florencia Carrizo | flor@fotaza.com    | 12345678   | usuario |
| Bautista Perez    | bauti@fotaza.com   | 12345678   | usuario |

---

## ✅ Funcionalidades implementadas

### 📤 Creación de publicación

- Subida de imagen con compresión via Canvas (Base64)
- Título, descripción y etiquetas (se crean si no existen)
- Selección de licencia (con o sin copyright)
- Marca de agua con texto personalizado para imágenes con copyright
- Edición y eliminación de publicaciones propias

### 🔍 Buscador

- Búsqueda por título, descripción y etiquetas
- Barra de búsqueda integrada en el navbar
- Resultados en tiempo real al enviar el formulario

### 💬 Módulo de comentarios

- Comentar publicaciones (usuarios autenticados)
- Eliminar comentarios propios
- Muestra autor, fecha y contador de comentarios

### ⭐ Valoración de imágenes

- Sistema de 1 a 5 estrellas
- Un voto por usuario por imagen (actualizable)
- Promedio y cantidad de votos visibles
- El autor no puede valorar sus propias imágenes
- Publicaciones mejor valoradas tienen preferencia en el feed (promedio ≥ 4 y ≥ 3 votos)

### 👤 Seguimiento de usuarios

- Seguir / dejar de seguir usuarios
- Perfil público con contador de seguidores y seguidos
- Acceso al perfil desde las cards y el detalle de publicación

---

## 🌐 Producción

La aplicación se encuentra completamente desplegada y operativa en la nube mediante los siguientes servicios:

- Hosting del Servidor Web: Render (Entorno de Node.js con Auto-Deploy).

- Hosting de Base de Datos: Neon PostgreSQL (Instancia Cloud en AWS).

🔗 URL del Proyecto en Vivo: https://fotaza2-comunidad-academica.onrender.com

🎬 Video de la Demostración (YouTube): [Mirar video de defensa del proyecto]()

## 🧗 Desafíos técnicos y soluciones

- **Falso Positivo en Seguridad de Despliegue (Google Web Risk):** Durante el proceso de Continuous Deployment en Render, los algoritmos automatizados de seguridad clasificaron erróneamente el dominio asignado por la plataforma como potencial riesgo de seguridad (Google Web Risk). Esto derivó en una suspensión temporal preventiva de la cuenta. Tras realizar el descargo técnico correspondiente, demostrar la legitimidad del código fuente del TPI y verificar que no existían scripts maliciosos, la cuenta fue restituida y el proyecto quedó operativo en producción sin inconvenientes.

- **Persistencia de Conexión SSL en Producción vs. Local:** La infraestructura cloud de Neon PostgreSQL exige conexiones cifradas mediante SSL de forma mandatoria. Para evitar conflictos de entorno y asegurar la portabilidad del código, se implementó una configuración condicional de Sequelize basada en variables de entorno (`NODE_ENV`). De esta manera, el servidor se conecta localmente sin restricciones y activa dinámicamente el objeto `dialectOptions: { ssl: { rejectUnauthorized: false } }` únicamente cuando corre en producción.

- **Optimización del Almacenamiento e Impacto de Base64:** La transferencia de imágenes crudas en formato Base64 incrementa el peso del payload en un 33% aproximado sobre el canal HTTP. Para mitigar la latencia y optimizar el almacenamiento en la base de datos, se desarrolló una lógica en el lado del cliente (Frontend) utilizando la API de Canvas del navegador. El script intercepta el archivo, reduce dimensionalmente la escala de la imagen y aplica compresión de calidad, logrando una reducción del peso final de hasta un 60% antes de la conversión a Base64.

- **Manejo de Convenciones e Incompatibilidades en Sequelize (Pluralización):** Un desafío de depuración crítico surgió debido a la pluralización automática que realiza Sequelize en inglés sobre los nombres de los modelos en las relaciones. El framework mapeó el modelo `Imagen` de forma inesperada como `Imagens` al momento de realizar los `include` de consultas complejas. Se resolvió identificando esta convención implícita e integrando el alias exacto (`as: 'Imagens'`) en los controladores de la aplicación para garantizar la consistencia en el renderizado de vistas con Pug.

## 🧑🏻 Desarrollado por

**Carlos Ferrando** - Programación Web II 2026 - **TUDS** - ULP
