# Apunte de Estudio para Commit: `2da2cca`

## Mensaje del Commit Original

```
S10 Query Builder
```

## Resumen de Gemini

Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

---

### **Apunte de Estudio: Refactorización de Búsqueda y Mejora del Workflow de Documentación**

#### **Mensaje del Commit:**

S10 apuntes 8

#### **Resumen del Código**

Este commit introduce dos mejoras significativas y distintas:

1.  **Funcionalidad de la Aplicación:** Se ha mejorado la lógica de búsqueda en el servicio de productos (`ProductsService`) para permitir encontrar un producto por su `título` o por su `slug`, haciendo la API más flexible.
2.  **Herramientas de Desarrollo:** Se ha refactorizado profundamente el script `study_notes.sh`. El cambio principal es cómo se maneja la nota de estudio generada: en lugar de crear un commit separado, ahora la prepara en el _staging area_, permitiendo al desarrollador incluirla en el mismo commit que los cambios de código.

---

### **Análisis Detallado de Cambios**

#### **1. Mejora en la Lógica de Búsqueda de Productos**

Esta actualización hace que la consulta de un producto sea más intuitiva para el usuario final de la API.

- **Archivo Modificado:** `04-teslo-shop/src/products/products.service.ts`

**Cambios en el Código (`diff`):**

// --- a/04-teslo-shop/src/products/products.service.ts
// +++ b/04-teslo-shop/src/products/products.service.ts
@@ -51,19 +51,21 @@
async findOne(term: string) {
let product: Product;

        if (isUUID(term)) {
            product = await this.productRepository.findOneBy({ id: term });
        } else {

-           product = await this.productRepository.findOneBy({ slug: term });
-

*           const queryBuilder = this.productRepository.createQueryBuilder();
*           product = await queryBuilder
*               .where('title = :title OR slug = :slug', {
*                   title: term,
*                   slug: term,
*               })
*               .getOne();
        }

-       // const product = await this.productRepository.findOneBy({ term })
-
-       if (!product) throw new NotFoundException(`Product whit ${term} not found`);

*       if (!product) throw new NotFoundException(`Product with term "${term}" not found`);

        return product;

  }

**Importancia para el Curso:**

- **Flexibilidad de la API:** Antes, la búsqueda por un término que no fuera un UUID solo se realizaba por el campo `slug`. Ahora, la búsqueda es más potente, ya que busca coincidencias tanto en el `title` como en el `slug`. Esto mejora la experiencia del desarrollador que consume la API.
- **Uso de `QueryBuilder`:** Este cambio introduce el `QueryBuilder` de TypeORM. Es una herramienta fundamental para construir consultas SQL complejas de forma programática y segura, escapando automáticamente las variables para prevenir inyecciones SQL. Es un paso más allá de los métodos básicos como `findOneBy`.

---

#### **2. Refactorización del Script de Notas de Estudio (`study_notes.sh`)**

Este es un cambio crucial en el _workflow_ de desarrollo, que hace que la documentación automatizada sea más limpia y coherente.

- **Archivo Modificado:** `study_notes.sh`

**Cambios Clave en el Script:**

El script anterior creaba un nuevo commit en una rama separada (`study-notes`) solo para el apunte. El nuevo enfoque es mucho más elegante:

1.  **Genera el apunte** como antes.
2.  **Añade el apunte al Staging Area:**
    git add "$NOTE_FILE"
3.  **Crea un Commit Temporal:** Realiza un commit temporal que incluye solo la nota, usando un `core.hooksPath` vacío para evitar bucles infinitos.
    git -c core.hooksPath="$TEMP_HOOKS_DIR" commit -m "temp(notes): ..." --no-verify
4.  **Deshace el Commit (pero mantiene los cambios):** Este es el paso más importante.
    git reset --soft HEAD~1
    Este comando deshace el último commit, pero deja los cambios de ese commit (el archivo del apunte) en el _staging area_.

**Importancia para el Curso:**

- **Commits Atómicos:** La nueva metodología permite al desarrollador crear **commits atómicos**. Un commit atómico es aquel que contiene una unidad lógica de cambio completa. En este caso, el código de la funcionalidad y su documentación (el apunte de estudio) pueden ir juntos en el mismo commit, lo cual es una práctica recomendada.
- **Comando `git reset --soft`:** Este es un concepto avanzado de Git. A diferencia de `reset --hard` (que borra todo) o `reset` (que saca los archivos del staging), `reset --soft` mueve el puntero `HEAD` hacia atrás, pero mantiene intactos tanto el directorio de trabajo como el _staging area_. Es perfecto para "re-hacer" el último commit.
- **Mejora del Flujo de Trabajo (Workflow):** El script ya no impone un nuevo commit en el historial. En su lugar, actúa como un **asistente** que prepara la documentación para que el desarrollador decida cómo y cuándo incluirla. Esto da más control y mantiene el historial de Git más limpio y significativo.
- **Scripts Portables:** Se eliminaron comentarios que advertían sobre rutas absolutas y se crearon nuevos scripts (`generate_study_notes.sh`, `study_notes copy.sh`) que muestran la evolución hacia una herramienta más robusta y portable.

---

_Este apunte fue generado automáticamente por Gemini CLI._

---

_Este apunte fue generado automáticamente por Gemini CLI._
