## Resumen de avance
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

***

# Apunte de Estudio: Eliminación en Cascada y Limpieza de Base de Datos

Este apunte analiza cómo implementar la "eliminación en cascada" a nivel de base de datos usando TypeORM y cómo crear un método de servicio para la eliminación masiva de registros, una técnica común en desarrollo y pruebas.

---

### 1. Configuración de `onDelete: 'CASCADE'` en Entidades

La modificación clave se realiza en la entidad `ProductImage`, que tiene una relación de muchos a uno con la entidad `Product`.

**Archivo Modificado:** `src/products/entities/product-image.entity.ts`

#### El Cambio

Se añade la opción `{ onDelete: 'CASCADE' }` al decorador `@ManyToOne`.

**Código Anterior:**
@ManyToOne(
    () => Product,
    (product) => product.images
)
product: Product

**Código Nuevo:**
@ManyToOne(
    () => Product,
    (product) => product.images,
    { onDelete: 'CASCADE' }
)
product: Product

#### ¿Qué significa y por qué es importante?

*   **`onDelete: 'CASCADE'`**: Esta es una instrucción a nivel de la base de datos. Le dice al gestor de base de datos (como PostgreSQL) que, si un registro de `Product` es eliminado, todos los registros de `ProductImage` que estén asociados a ese producto también deben ser eliminados automáticamente.
*   **Integridad Referencial**: Su principal objetivo es mantener la integridad de los datos. Previene la existencia de "registros huérfanos", es decir, imágenes de productos que ya no tienen un producto al cual pertenecer. Esto asegura que la base de datos se mantenga consistente y libre de datos basura.

---

### 2. Método de Servicio para Eliminación Masiva

Para aprovechar la configuración de cascada y para facilitar las pruebas, se añade un nuevo método en `ProductsService`.

**Archivo Modificado:** `src/products/products.service.ts`

#### El Cambio

Se introduce el método asíncrono `deleteAllProducts`.

**Código Nuevo:**
async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
        return await query
            .delete()
            .where({})
            .execute();

    } catch (error) {
        this.handleDBExceptions(error);
    }
}

#### ¿Qué hace y para qué sirve?

*   **`createQueryBuilder`**: Se utiliza el constructor de consultas de TypeORM para tener un control más granular sobre la operación de base de datos.
*   **`.delete().where({}).execute()`**: Esta cadena de métodos construye y ejecuta una consulta SQL `DELETE` que elimina **todos** los registros de la tabla de productos, ya que la cláusula `WHERE` está vacía.
*   **Utilidad en Desarrollo**: Este método es extremadamente útil durante el desarrollo y las pruebas. Permite "limpiar" la tabla de productos de forma rápida y sencilla, por ejemplo, antes de ejecutar un proceso de "seeding" (sembrado de datos) o para restaurar un estado limpio de la base de datos antes de correr pruebas automatizadas.

### Conclusión

La combinación de estos dos cambios es muy poderosa. Al invocar el método `productsService.deleteAllProducts()`, no solo se borran todos los productos, sino que la configuración `onDelete: 'CASCADE'` garantiza que la base de datos se encargue de limpiar automáticamente todas las imágenes asociadas. Esto resulta en una operación de limpieza completa, eficiente y segura, manteniendo la consistencia de los datos con una sola llamada.

---
*Este apunte fue generado automáticamente.*
