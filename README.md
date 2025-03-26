# IT Rock Challenge

## Requerimientos

`node`
`npm`
`docker`
`docker-compose`

## Instalación

**Clonar repositorio**

```bash
git clone https://github.com/adriancolunga/itrock-challenge.git
```

**Desplegar**

```bash
docker compose up -d
```

## Variables de entorno

En el archivo .env se encuentran variables modificables para testear

`USER_ID` (id del usuario autenticado)

`USER_ROLE` (role del usuario autenticado)

`CACHE_ON` (Por defecto es true para comprobar que redis anda correctamente y trae lo guardado en cache. Se recomienda pasarlo a false para probar todas las funcionalidades del GET /tasks, como paginación y filtrado)

`API_KEY` Api key para autenticarse en /tasks/populate

Aclaración de porque las variables USER_ID y USER_ROLE:
Se optó por esta solución ya que se solicitaba controlar que la/s tarea/s a buscar sean del usuario que hace la petición, esto tipicamente se haría con una entidad User y el id que lo identifique pero el challenge no lo especificaba de esa forma.
Al loguearse con admin/password se setean estas variables en el payload del jwt.

## Documentación API

[Swagger](http://localhost:3000/api)
