<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# ApiRest SU Carnet Digital

1. clonar proyecto

2. clonar el archivo ``` .env.template``` y renombrarlo a ``` .env```

3. Cambiar las variables de entorno

4. Levantar DB
  ```
  docker-compose up -d
  ```
5. Iniciar el proyecto modo desaroollo 

  ```
  yarn start:dev
  ```


### Mapear entidades de la BD

  ```
    npx typeorm-model-generator -h [host] -d [database] -u [username] -x [password] -e postgres -o ./src
  ```


### Crear nuevas endpoints

  ```
    nest g resource <nombre>

  ```
  