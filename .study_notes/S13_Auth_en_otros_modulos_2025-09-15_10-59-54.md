## Resumen de avance
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# S13 — Auth en otros módulos

En esta sección, extendemos nuestro sistema de autenticación para proteger rutas en otros módulos de la aplicación. El objetivo es asegurar que solo usuarios con roles específicos—en este caso, administradores—puedan ejecutar operaciones críticas como crear, actualizar o eliminar productos.

## Puntos Clave

1.  **Reutilización del `AuthModule`**: La lógica de autenticación y autorización está centralizada en `AuthModule`. Para proteger otros módulos, simplemente importamos `AuthModule` en ellos.
2.  **Protección de Endpoints**: Utilizamos el decorador `@Auth()` para proteger rutas específicas. Este decorador compuesto se encarga de verificar la autenticación (JWT) y los roles del usuario.
3.  **Modularidad**: Este enfoque mantiene nuestro código limpio y modular. La seguridad se aplica de manera declarativa sin duplicar lógica.

---

### 1. Importación de `AuthModule`

Para que los decoradores y servicios de autenticación estén disponibles en `ProductsModule` y `SeedModule`, necesitamos importar `AuthModule`.

#### `products.module.ts`

Se añade `AuthModule` al array de `imports`. Esto permite que `ProductsController` utilice el decorador `@Auth`.

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from './../auth/auth.module'; // <-- Importado

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductImage } from './entities';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [
        TypeOrmModule.forFeature([Product, ProductImage]),
        AuthModule // <-- Añadido
    ],
    exports: [ProductsService, TypeOrmModule]
})
export class ProductsModule { }

#### `seed.module.ts`

De manera similar, se importa `AuthModule` en `SeedModule` para poder proteger el endpoint que ejecuta la semilla de datos.

import { Module } from '@nestjs/common';

import { AuthModule } from './../auth/auth.module'; // <-- Importado
import { ProductsModule } from 'src/products/products.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
    controllers: [SeedController],
    providers: [SeedService],
    imports: [
        ProductsModule,
        AuthModule // <-- Añadido
    ]
})
export class SeedModule { }

---

### 2. Aplicación del Decorador `@Auth`

Una vez que `AuthModule` está importado, podemos usar el decorador `@Auth` en los controladores para proteger los endpoints.

#### `products.controller.ts`

Se aplica el decorador `@Auth(ValidRoles.admin)` a las rutas de `create`, `update` y `remove`. Esto restringe el acceso a estas operaciones exclusivamente a los usuarios que tengan el rol de `admin`.

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Auth } from '../auth/decorators';         // <-- Importado
import { ValidRoles } from 'src/auth/interfaces'; // <-- Importado

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @Auth(ValidRoles.admin) // <-- Endpoint protegido
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    // ... (el resto de los endpoints públicos como findAll y findOne)

    @Patch(':id')
    @Auth(ValidRoles.admin) // <-- Endpoint protegido
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @Auth(ValidRoles.admin) // <-- Endpoint protegido
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.remove(id);
    }
}

## Conclusión

Al centralizar la lógica de autenticación en un módulo reutilizable (`AuthModule`) y aplicar la protección de rutas de forma declarativa con decoradores (`@Auth`), logramos un sistema de seguridad robusto, escalable y fácil de mantener. Cualquier módulo futuro que necesite protección podrá implementarla simplemente importando `AuthModule` y usando el decorador en los endpoints correspondientes.
