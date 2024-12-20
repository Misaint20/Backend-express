# Express.js Server Base

## Descripción
Este proyecto proporciona una base sólida para un servidor Express.js con funcionalidades CRUD y un sistema de autenticación básico. Está diseñado para ser un punto de partida robusto y escalable para aplicaciones web y APIs RESTful.

## Características
- Implementación de Express.js 5.0
- Sistema de registro e inicio de sesión de usuarios
- Operaciones CRUD para usuarios
- Manejo de archivos JSON para almacenamiento de datos (fácilmente adaptable a bases de datos)
- Middleware para parsing de JSON y URL-encoded data
- Implementación de CORS
- Logging con Morgan y Winston
- Autenticación con JWT
- Manejo de errores centralizado
- Tests unitarios con Jest

## Instalación
1. Clona el repositorio: 
```
git clone https://github.com/Misaint20/Backend-express.git
```
2. Instala las dependencias:
```
cd Backend-express
npm install
```
3. Inicia el servidor:
```
npm start
```
Nota: Para correr el servidor en modo de desarrollo, ejecuta `npm run dev` en lugar de `npm start`.
Nota 2: Es necesario tener Node.js v22.0 o superior instalado en su sistema.

## Uso
El servidor proporciona las siguientes rutas:

- `POST /api/v1/auth/register`: Registra un nuevo usuario
- `POST /api/v1/auth/login`: Inicia sesión de un usuario
- `GET /api/v1/users`: Obtiene la lista de usuarios (sin contraseñas)
- `GET /api/v1/users/:id`: Obtiene información de un usuario específico
- `PUT /api/v1/users/:id`: Actualiza información de un usuario
- `DELETE /api/v1/users/:id`: Elimina un usuario
- `GET /api/v1/next-routes`: Proximas rutas

Para más detalles sobre cómo usar cada ruta, consulta la documentación en la ruta raíz del servidor. (En desarrollo)

## Contribuir
Las contribuciones son bienvenidas y apreciadas. Si deseas contribuir:

1. Haz un Fork del proyecto
2. Crea una nueva rama (`git checkout -b feature/exampleFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some feature'`)
4. Push a la rama (`git push origin feature/exampleFeature`)
5. Abre un Pull Request

Por favor, asegúrate de que tu código sigue las mejores prácticas y está bien documentado. Además:

- Agrega tests para cualquier nueva funcionalidad o cambios realizados.
- Actualiza la documentación existente para reflejar los cambios o nuevas características.
- Agrega tus rutas y funcionalidades a la documentación, al README.md y al archivo de licencia.
- Si introduces nuevas dependencias o cambios en la configuración, asegúrate de documentarlos.

Las contribuciones de igual forma pueden ser sobre la documentación, la estructura del proyecto, o cualquier otra mejora que puedas sugerir.

Recuerda añadir tu usuario al apartado de contribuidores para aparecer en la lista.

## Contribuidores
- [Misaint20](https://github.com/Misaint20) - Creador del proyecto

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Contacto
Misaint20 - [zmisaintm@gmail.com](mailto:zmisaintm@gmail.com)

Link del proyecto: [https://github.com/Misaint20/Backend-express](https://github.com/Misaint20/Backend-express)