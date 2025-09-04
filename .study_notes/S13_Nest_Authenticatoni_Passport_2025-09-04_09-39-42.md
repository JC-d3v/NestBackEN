## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# S13 Nest Authentication Passport

En esta sección, se sientan las bases para implementar un sistema de autenticación robusto en nuestra aplicación NestJS utilizando `Passport.js`, una de las librerías de autenticación más populares en el ecosistema de Node.js. La estrategia específica que se implementará es JWT (JSON Web Tokens), un estándar para crear tokens de acceso que afirman ciertas propiedades sobre un usuario.

## 1. Instalación de Dependencias

El primer paso es agregar las dependencias necesarias al proyecto. Estos paquetes nos proporcionarán las herramientas para integrar Passport y manejar los JWT.

Los cambios se reflejan en el archivo `package.json`:

{
    // ...
    "dependencies": {
        "@nestjs/common": "^10.0.0",
        "@nestjs/config": "^4.0.2",
        "@nestjs/core": "^10.0.0",
        "@nestjs/jwt": "^11.0.0",
        "@nestjs/mapped-types": "*",
        "@nestjs/passport": "^11.0.5",
        "@nestjs/platform-express": "^10.0.0",
        // ...
        "passport": "^0.7.0",
        "passport-jwt": "^4.0.1",
        // ...
    },
    "devDependencies": {
        // ...
        "@types/passport-jwt": "^4.0.1",
        // ...
    }
}

**Importancia de cada paquete:**

*   `@nestjs/passport` y `passport`: Son el núcleo de la integración. Permiten que NestJS utilice el middleware de Passport de una manera idiomática y declarativa.
*   `@nestjs/jwt` y `passport-jwt`: Proporcionan la implementación específica para la estrategia de autenticación con JSON Web Tokens. Nos ayudarán a crear, firmar y verificar los tokens.
*   `@types/passport-jwt`: Contiene las definiciones de TypeScript para `passport-jwt`, lo que mejora la experiencia de desarrollo con autocompletado y tipado estático.

## 2. Configuración del Módulo de Autenticación (`auth.module.ts`)

Una vez instaladas las dependencias, es necesario configurar el `AuthModule` para que reconozca e integre el sistema de Passport.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';


@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        TypeOrmModule.forFeature([User]),

        PassportModule.register({ defaultStrategy: 'jwt' }),

        // JwtModule.register({
        //   secret: '11111',
        //   signOptions: {
        //     expiresIn: '2h'
        //   }
        // })
    ],
    exports: [TypeOrmModule]
})
export class AuthModule {}

**Puntos Clave de la Configuración:**

*   **`PassportModule.register({ defaultStrategy: 'jwt' })`**: Esta línea es fundamental. Importa el módulo de Passport y lo registra en el contexto de la aplicación, especificando que la estrategia de autenticación por defecto será `'jwt'`. Esto nos permitirá proteger rutas fácilmente más adelante.

*   **`JwtModule` (comentado)**: Se ha añadido la importación del `JwtModule`, pero su registro (`JwtModule.register`) está comentado. Esto indica una preparación para el siguiente paso, que será configurar el módulo JWT con un `secret` (la clave para firmar los tokens) y las opciones de firma, como el tiempo de expiración (`expiresIn`). Dejarlo comentado sugiere que la configuración completa se realizará en una etapa posterior, posiblemente utilizando variables de entorno para manejar el `secret` de forma segura.

### Resumen de la Importancia

Este commit establece la infraestructura esencial para la autenticación. Al instalar y registrar los módulos de Passport y JWT, la aplicación ya está preparada para:

1.  Definir una “estrategia” JWT que especifique cómo validar los tokens.
2.  Crear “guards” (guardianes) que protejan los endpoints, asegurando que solo los usuarios autenticados puedan acceder a ellos.
3.  Generar tokens JWT cuando un usuario inicie sesión correctamente.

Este es un paso crucial para construir una API segura y profesional.
