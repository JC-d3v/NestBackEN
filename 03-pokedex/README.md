<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en Desarrollo

1. Clonar el repositorio 
2. Ejecutar 
```
yarn install
```
3. Tener Nest CLI install
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```

5. Clonar el archivo ___.env.template__ y renombrar la copia a ```.env```

6. llenar las variables de entorno definidas en el ```.env```

7. ejecutar la aplicacion en dev:
```
yarn start:dev
```

8. construir la base con la semilla 
http://localhost:3000/api/v2/seed

heroku fue descartado pues al momento de edicion no cuenta con plan gratuito.


## Stack Usado
* MonogDB
* Nest, CLI
