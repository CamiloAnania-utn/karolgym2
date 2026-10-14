# 🧡 KAROLGYM

App de entrenamiento personal: contenido gratuito, packs de entrenamiento pagos, cuenta de usuario
con calendario/favoritos/historial, caminatas con cronómetro, checks de comunidad, planes
personalizados 1:1, y un panel de administración completo.

**Stack**: React + Vite + Tailwind (frontend) · Express + Sequelize + PostgreSQL (backend).

Este proyecto ya fue probado de punta a punta (instalación, seed, y un flujo completo de
compra → confirmación de admin → activación del pack) antes de entregarse.

---

## 1. Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior corriendo localmente (o accesible por red)

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editá `.env` con los datos de tu base de datos:

```
DB_NAME=karolgym
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=127.0.0.1
DB_PORT=5432
JWT_SECRET=un_string_largo_y_random
```

Creá la base de datos (una sola vez):

```bash
createdb karolgym
# o, desde psql:  CREATE DATABASE karolgym;
```

Cargá datos de ejemplo (crea tablas, un admin y una usuaria demo, un pack "Full Body Fem" y un
pack "Running" con rutinas y contenido gratuito):

```bash
npm run seed
```

Esto deja creados:
- **Admin** → `admin@karolgym.com` / `admin1234`
- **Usuaria demo** → `demo@karolgym.com` / `usuario1234`

Arrancá el servidor:

```bash
npm run dev
```

La API queda en `http://localhost:4000/api`. Podés chequear que esté viva en
`http://localhost:4000/api/health`.

> ⚠️ `npm run seed` borra y recrea todas las tablas (`sequelize.sync({ force: true })`).
> Usalo solo en desarrollo. En producción, reemplazá `sequelize.sync()` en `src/server.js`
> por migraciones reales con `sequelize-cli`.

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La app queda en `http://localhost:5173`, con el proxy de Vite ya configurado para pegarle a
`http://localhost:4000` sin problemas de CORS en desarrollo.

Iniciá sesión con el admin (`admin@karolgym.com` / `admin1234`) y vas a ver el link **"Panel"**
en la barra de navegación para entrar al panel de administración en `/admin`.

---

## 4. Estructura del proyecto

```
karolgym/
├── backend/
│   └── src/
│       ├── config/database.js       # conexión Sequelize
│       ├── models/                  # User, Pack, SubPack, Routine, Purchase, etc.
│       ├── controllers/             # lógica de cada recurso
│       ├── routes/                  # endpoints agrupados por recurso
│       ├── middleware/auth.js       # requireAuth / requireAdmin / attachUserIfPresent
│       ├── seed/seed.js             # datos de ejemplo
│       └── server.js                # punto de entrada
└── frontend/
    └── src/
        ├── api/client.js            # instancia de axios con el token
        ├── context/AuthContext.jsx  # sesión del usuario
        ├── layouts/                 # Public / Account / Admin
        ├── components/              # piezas reutilizables (cards, badges, etc.)
        └── pages/
            ├── *.jsx                 # páginas públicas (home, packs, checkout, etc.)
            ├── account/              # perfil, mis packs, calendario, favoritos, historial, caminatas, checks
            └── admin/                # estadísticas, CRUD de packs, contenido gratis, compras, usuarios, personalizados
```

## 5. Cómo está organizado el modelo de datos (resumen)

- **Pack** = la carpeta general (ej. "Full Body Fem"). No tiene precio propio.
- **SubPack** = la versión comprable (ej. "Inicial — 2 días"). Tiene precio, nivel y días/semana propios.
- **Routine** = un día de entrenamiento = **un solo video** ya editado con todo adentro (como pediste:
  no se cargan ejercicios sueltos).
- **Purchase** → cuando se confirma (manual para transferencia, o automática si se integra el webhook
  de Mercado Pago) crea un **UserPack**, que es lo que activa el pack para ese usuario. Un usuario
  puede tener varios `UserPack` activos al mismo tiempo.
- **FreeContent** se puede ver sin cuenta, pero el campo `videoUrl` solo viaja en la respuesta si hay
  sesión — así se cumple la regla de "mirar sin cuenta, reproducir con cuenta".

## 6. Qué es un primer corte funcional y qué falta profundizar

Lo que ya funciona de punta a punta: registro/login, navegación de contenido gratis con el gate de
login para reproducir, catálogo de packs → subpacks → rutinas, compra (Mercado Pago queda como
integración pendiente — el flujo de transferencia es 100% funcional con confirmación manual desde el
panel), activación automática de packs, cuenta de usuario completa, caminatas con cronómetro, checks
con muro de comunidad, solicitud de personalizados, y el panel de administración con CRUD completo de
packs/subpacks/rutinas/contenido gratis, gestión de compras, usuarios y estadísticas.

Quedan como siguientes pasos (señalados también en el documento original como decisiones pendientes):

1. **Integración real de Mercado Pago** (Checkout Pro o API de pagos + webhook de confirmación).
2. **Subida de archivos**: hoy `videoUrl`, `coverImageUrl`, `thumbnailUrl` se cargan como URLs de texto.
   Para subir videos/imágenes directamente habría que sumar almacenamiento (ej. S3/Cloudinary) + un
   endpoint de upload (el backend ya trae `multer` como dependencia, listo para esto).
3. **Asignación de días del calendario**: hoy el calendario muestra las rutinas de cada pack activo
   agrupadas por pack; falta definir la lógica de qué rutina le toca a qué día de la semana cuando hay
   varios packs combinados (es una de las decisiones que el documento original dejó abierta).
4. **Notificaciones push/email reales**: la configuración de recordatorios (noche anterior / mismo día)
   ya se guarda por usuario; falta el servicio que efectivamente las dispare.
5. **Generación del "check de caminata" como PNG** para compartir en Instagram.
6. **Migraciones de base de datos** para producción (reemplazar `sequelize.sync()`).

Decime por cuál de estos seguimos y lo armamos.
