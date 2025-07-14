## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

---

# Apunte de Estudio: Fundamentos de TypeScript—Variables y `template strings`

> **Nota:** Aunque el mensaje del commit es “S10 - UPDATE en TypeORM”, los cambios de código ilustran conceptos fundamentales de TypeScript que son esenciales antes de trabajar con cualquier framework o ORM.

En esta lección, repasamos dos características clave de TypeScript y JavaScript moderno: la diferencia entre `let` y `const` para la declaración de variables y el poder de los `template strings` para crear cadenas de texto dinámicas y legibles.

### 1. Flexibilidad en Variables: `let` vs. `const`

El primer cambio clave es la modificación de `const` a `let` en la declaración de la variable `name`.

**Código Anterior:**
	export const name: string = 'Jorge';

**Código Nuevo:**
	export let name: string = 'Jorge';
	name = 'TEST';

**Importancia:**

*   **`const` (Constante):** Se usa para declarar variables cuyo valor no cambiará. Una vez asignado, no se puede reasignar. Intentar hacerlo generaría un error.
*   **`let` (Variable de Bloque):** Se usa para declarar variables que se espera que cambien de valor en el futuro. Permite la reasignación.

Este cambio es fundamental para entender cuándo y por qué elegir una u otra declaración, afectando directamente la predictibilidad y seguridad del código.

### 2. Cadenas de Texto Avanzadas: `template strings`

El cambio más significativo es la introducción de un `template string` (también conocido como plantilla literal). Estas cadenas se definen con comillas invertidas (`` ` ``) en lugar de comillas simples o dobles.

**Código Nuevo:**
	export const templateString = `Esto es un string
	multilinea
	que puede tener 
	" dobles
	' Simples
	y permite inyeccion de valores ${name}
	expresiones ${1 + 1}
	numeros ${age}
	booleanos ${isValid}
	`

**Características y Ventajas:**

1.  **Cadenas Multilínea:** Permiten escribir texto en varias líneas sin necesidad de caracteres de escape como `\n`, haciendo el código mucho más limpio.
2.  **Interpolación de Expresiones:** Usando la sintaxis `${...}`, podemos incrustar (“interpolar”) variables y expresiones de JavaScript directamente dentro de la cadena. El código es más legible y conciso que la concatenación tradicional con el operador `+`.
3.  **Uso de Comillas sin Escapar:** Se pueden usar comillas simples (`'`) y dobles (`"`) dentro de la cadena sin necesidad de escaparlas con una barra invertida (`\`), lo que simplifica la escritura de texto que contiene citas.

Estos conceptos son la base para construir aplicaciones robustas y fáciles de mantener en TypeScript. Dominarlos te permitirá escribir un código más expresivo y con menos errores.

---
*Este apunte fue generado automáticamente.*
