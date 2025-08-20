## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes un apunte de estudio en formato Markdown basado en los cambios del commit.

***

# Apunte de Estudio: Aplanando Imágenes en la Respuesta del API

En este apunte, analizaremos una refactorización común y muy útil en el desarrollo de APIs con NestJS y TypeORM: la simplificación o "aplanamiento" de las entidades relacionadas en la respuesta JSON. El objetivo es hacer que el API sea más fácil de consumir para el cliente, entregando una estructura de datos limpia y directa.

## El Problema: Respuestas con Objetos Anidados

Inicialmente, cuando un cliente solicitaba un producto, nuestro API devolvía el objeto `Product` y, dentro de él, un arreglo de objetos `ProductImage`.

**Ejemplo de respuesta JSON (Antes):**

{
  "id": "some-uuid",
  "title": "Un Producto",
  "price": 150,
  // ...otras propiedades
  "images": [
    {
      "id": 1,
      "url": "https://example.com/image1.jpg"
    },
    {
      "id": 2,
      "url": "https://example.com/image2.jpg"
    }
  ]
}

Aunque esta estructura es un reflejo directo de nuestras entidades de base de datos, el cliente (una aplicación web o móvil) probablemente solo necesita un arreglo con las URL de las imágenes, no los objetos completos con sus IDs.

## La Solución: Aplanar el Arreglo de Imágenes

La refactorización busca transformar la respuesta para que sea más directa.

**Ejemplo de respuesta JSON (Después):**

{
  "id": "some-uuid",
  "title": "Un Producto",
  "price": 150,
  // ...otras propiedades
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}

Esta estructura es más limpia y eficiente para el consumidor del API. Veamos cómo se implementó.

---

## Cambios Clave en el Código

### 1. Carga de Relaciones con `Eager Loading`

Para poder manipular las imágenes, primero debemos asegurarnos de que TypeORM las cargue junto con el producto. Una forma de hacerlo es con la opción `eager: true`.

`src/products/entities/product.entity.ts`
  // ...
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {
      cascade: true,
      eager: true // <-- ¡Importante!
    }
  )
  images: ProductImage[];
  // ...

-   **`eager: true`**: Esta opción le indica a TypeORM que cargue automáticamente esta relación (`images`) cada vez que se busque una entidad `Product`. Es una forma sencilla de asegurar que los datos relacionados siempre estén presentes.

### 2. Nuevo Método de Servicio: `findOnePlain`

Se creó un método "envoltorio" (`wrapper`) en el servicio para manejar la lógica de aplanamiento, manteniendo el método original `findOne` intacto para uso interno.

`src/products/products.service.ts`
  // ...
  async findOnePlain(term: string) {
    const { images = [], ...prod } = await this.findOne(term);
    return {
      ...prod,
      images: images.map(image => image.url)
    }
  }
  // ...

-   **`const { images = [], ...prod } = await this.findOne(term);`**: Esta línea es clave.
    1.  Llama al método `findOne` que, gracias a la carga `eager` (o al `leftJoinAndSelect` que veremos después), devuelve el producto con su arreglo de `ProductImage`s.
    2.  Usa desestructuración de objetos para separar el arreglo `images` del resto de las propiedades del producto, que se agrupan en la variable `prod`.
-   **`images: images.map(image => image.url)`**: Aquí ocurre la magia. Se utiliza el método `map` para transformar el arreglo de objetos `ProductImage` en un simple arreglo de strings, extrayendo únicamente la propiedad `url` de cada objeto.

### 3. Actualización del Controlador

El controlador se actualiza para que el endpoint `/products/:term` llame al nuevo método `findOnePlain` en lugar del `findOne` original.

`src/products/products.controller.ts`
  // ...
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }
  // ...

### 4. Refinando `findOne` y `findAll`

Para optimizar las consultas a la base de datos y tener más control, también se ajustaron los métodos de búsqueda.

`src/products/products.service.ts`
  // ...
  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { // <-- Carga explícita de la relación
        images: true,
      }
    })

    // Aplanamiento directo en el método findAll
    return products.map((product) => ({
      ...product,
      images: product.images.map(img => img.url)
    }))
  }

  async findOne(term: string) {
    // ...
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) = :title OR slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        // Une la tabla de imágenes y las selecciona en la misma consulta
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    // ...
  }
  // ...

-   **`relations: { images: true }`**: En `findAll`, en lugar de depender de `eager`, se especifica explícitamente que se debe cargar la relación `images`. Esto ofrece un control más granular que la carga `eager`.
-   **`leftJoinAndSelect('prod.images', 'prodImages')`**: En `findOne`, se usa el `QueryBuilder` para construir una consulta SQL más eficiente. `leftJoinAndSelect` realiza un `LEFT JOIN` a la tabla de imágenes y selecciona sus datos, todo en una única consulta a la base de datos, lo cual es extremadamente performante.

## Conclusión

Esta refactorización demuestra varios conceptos importantes:

1.  **Diseño de API Centrado en el Cliente**: Se modifica la estructura de la respuesta para que sea más simple y útil para quien la consume.
2.  **Carga de Relaciones en TypeORM**: Se exploran tres métodos para cargar datos relacionados: `eager: true` para cargas automáticas, `relations: {}` para cargas explícitas en operaciones `find`, y `leftJoinAndSelect` para un control total con el `QueryBuilder`.
3.  **Transformación de Datos**: Se utiliza la desestructuración y el método `map` de JavaScript para remodelar los datos antes de enviarlos como respuesta.

---
*Este apunte fue generado automáticamente.*
