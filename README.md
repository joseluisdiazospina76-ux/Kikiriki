# Pollos Asados Kikiriki — MVP MongoDB

Sistema académico basado en el proyecto de aula: gestión de productos, categorías, clientes, pedidos, ventas, inventarios y residuos del Corredor Ecológico.

## Tecnologías
- Frontend: HTML, CSS y JavaScript sin framework (carpeta `public/`).
- Backend: Node.js 20+, Express.
- Datos: MongoDB, Mongoose; colecciones `users`, `categories`, `products`, `inventories`, `customers`, `orders`, `sales`, `wastes`, `counters` y `sessions`.
- Autenticación: sesiones de servidor, contraseñas BCrypt y cookie httpOnly.
- Despliegue: Dockerfile y configuración por variables de entorno para Atlas + Render/Railway u otro hosting Node.

## Instalación rápida usando MongoDB Atlas (recomendado)
1. Instala Node.js 20+ y descomprime el proyecto; ábrelo con VS Code.
2. Crea un proyecto y un clúster en https://cloud.mongodb.com/ . En **Database Access** crea un usuario de base de datos con contraseña segura; en **Network Access** permite la IP necesaria para la conexión. En producción usa restricciones por IP cuando tu hosting provea IP fija; si necesitas autorizar temporalmente 0.0.0.0/0, utiliza usuario de permisos mínimos y credenciales robustas.
3. En **Connect > Drivers > Node.js**, copia la URI `mongodb+srv://...`, sustituye usuario y contraseña (codifica caracteres especiales), y usa `/kikiriki` antes de los parámetros de consulta.
4. Copia `.env.example` como `.env`. Sustituye `MONGODB_URI` por la URI real de Atlas, `SESSION_SECRET` por un valor aleatorio de al menos 32 caracteres, `ADMIN_USER` y `ADMIN_PASSWORD` (12 caracteres mínimo).
5. En la terminal ejecuta:
   ```sh
   npm install
   npm run seed
   npm start
   ```
6. Abre http://localhost:3000 e inicia sesión con ADMIN_USER y ADMIN_PASSWORD. Los productos y precios generados por `seed` son DEMOSTRATIVOS: no se presentan como menú oficial.

### MongoDB local
La creación y cancelación de pedidos usa **transacciones MongoDB** para garantizar que inventario, detalle y ventas no se desincronicen. Por esa razón, la base local tiene que funcionar como **replica set de un nodo**, no como un MongoDB standalone común.

Ejemplo orientativo, con el servidor detenido y un directorio propio:
```sh
mongod --dbpath /ruta/a/tus/datos --replSet rs0 --bind_ip 127.0.0.1 --port 27017
```
En otra consola:
```sh
mongosh --eval 'rs.initiate()'
```
Usa `MONGODB_URI=mongodb://127.0.0.1:27017/kikiriki?replicaSet=rs0`. Si prefieres omitir configuración local, Atlas ya utiliza replica set y es más sencillo para desarrollar y desplegar.

## Publicación con GitHub y Render (backend + frontend en el mismo servicio)
1. Crea repositorio GitHub y sube **solo el código**. No subas `.env`. Los directorios `node_modules` están ignorados.
2. En Render crea un **Web Service** desde ese repositorio. Runtime: Node; build command: `npm install`; start command: `npm start`. Alternativamente utiliza el Dockerfile incluido.
3. En Render > Environment configura `MONGODB_URI`, `SESSION_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD`, `NODE_ENV=production` (y opcionalmente `PORT`; por lo general Render lo proporciona). Copia credenciales desde tu propio Atlas, nunca del repositorio.
4. Configura en Atlas > Network Access la IP de salida de tu servicio. Cuando la plataforma no proporcione IP fija, se suele usar temporalmente acceso desde todas las IPs con medidas de seguridad adicionales; limita acceso en cuanto sea posible.
5. Despliega. Render proporciona una URL HTTPS pública. El frontend se sirve desde el mismo backend; no necesita CORS ni un hosting separado.
6. Para datos iniciales, ejecuta `npm run seed` desde tu equipo apuntando a Atlas (o desde una consola remota del servicio, si tu plan la ofrece). No hagas seed automático con cada arranque del servicio.
7. Comprueba `https://TU-URL/api/health`, inicia sesión y prueba un pedido, entrega, venta y stock. Activa copias de seguridad y monitorización en MongoDB Atlas.

## Flujo de demostración
- Inicia sesión con usuario administrador.
- Visualiza el catálogo semilla y crea/edita productos.
- Registra un cliente, y crea un pedido con varios productos.
- El inventario se descuenta al crear el pedido. Si se cancela, se reintegra.
- Cambia estado a **entregado** para registrar una venta una sola vez.
- Consulta ventas, ajusta inventario y registra un residuo clasificado como verde, blanco o negro.

## Seguridad y alcance
- No es un sistema de cobros en línea; los montos son valores de demostración.
- La aplicación usa cookies seguras cuando NODE_ENV=production y detrás de un proxy HTTPS.
- El usuario admin inicial se crea al iniciar si aún no existe; cambiar la contraseña de `.env` posteriormente **no** reemplaza automáticamente la contraseña ya guardada.
- Para uso comercial se recomiendan políticas de privacidad y consentimiento, controles de roles ampliados, auditoría de cambios, rotación de secretos, copias de seguridad y pruebas de carga.
- MongoDB es documental **no relacional**. Esta implementación modifica la decisión original del documento académico que especificaba MySQL y tablas SQL; conviene actualizar ese apartado antes de entregar el informe.

## Validación
`npm test` ejecuta pruebas estructurales; no sustituye pruebas funcionales integradas con Atlas. Las operaciones que requieren transacciones únicamente funcionan con replica sets de MongoDB.
