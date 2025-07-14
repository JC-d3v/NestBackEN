## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

---

# Apuntes de Estudio: Interfaces y Objetos en TypeScript

Este apunte se basa en la introducción de un nuevo archivo, `02-objects.ts`, que establece las bases para trabajar con objetos fuertemente tipados en TypeScript. Los cambios ilustran cómo definir la "forma" de un objeto usando interfaces y cómo esto mejora la robustez y predictibilidad del código.

## 1. Interfaces: Definiendo Contratos de Datos

El cambio más significativo es la introducción de una `interface` de TypeScript. Una interfaz es un "contrato" que define la estructura que un objeto debe tener. No se compila a JavaScript; su único propósito es ayudar en el desarrollo y la verificación de tipos.

En el nuevo archivo `src/bases/02-objects.ts`, se define la interfaz `Pokemon`:

    interface Pokemon {
      id: number;
      name: string;
      age: number;
    }

**Importancia:**

*   **Claridad:** Cualquiera que vea esta interfaz sabe inmediatamente qué propiedades esperar de un objeto `Pokemon`.
*   **Seguridad de Tipos:** TypeScript se asegurará de que cualquier variable declarada como tipo `Pokemon` cumpla con esta estructura, evitando errores comunes como propiedades mal escritas o tipos de datos incorrectos.

## 2. Creación de Objetos Tipados

Una vez definida la interfaz, podemos crear objetos que se adhieran a ese contrato. TypeScript verificará que el objeto cumpla con las reglas de la interfaz.

    export const bulbasor: Pokemon = {
      id: 1,
      name: 'Bulbasor',
      age: 2
    }

    export const charmander: Pokemon = {
      id: 3,
      name: 'Charmander',
      age: 3
    }

**Puntos Clave:**

*   Al declarar `const bulbasor: Pokemon`, le estamos diciendo a TypeScript que este objeto *debe* tener las propiedades `id`, `name` y `age` con los tipos `number`, `string` y `number` respectivamente.
*   Si intentáramos omitir una propiedad o asignarle un tipo incorrecto, el compilador de TypeScript arrojaría un error, previniendo bugs antes de que el código se ejecute.

## 3. Arrays Tipados

El archivo también introduce un array con un tipo inferido.

    export const pokemonIds = [1, 20, 30, 34, 66];

    // pokemonIds.push('qwerty'); // --> Esto daría un error

**Explicación:**

*   TypeScript analiza el contenido del array `pokemonIds` y deduce que es un array de números (`number[]`).
*   Gracias a esta inferencia, si intentamos añadir un elemento que no sea un número (como el string `'qwerty'`), TypeScript nos advertirá de un error. Esto garantiza que el array mantenga su integridad.

## 4. Integración mediante Módulos (Import/Export)

Finalmente, los cambios en `src/main.ts` muestran cómo se utilizan estos nuevos objetos en otra parte de la aplicación.

*   **Exportación:** En `02-objects.ts`, las palabras clave `export` hacen que las constantes `bulbasor` y `charmander` estén disponibles para otros archivos.
*   **Importación:** En `main.ts`, se importa el objeto `bulbasor` para poder usarlo.

    // Archivo: main.ts
    import { bulbasor } from './bases/02-objects'

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div>
        <h1>hello VITE ${bulbasor.name}</h1>
      </div>
    `

**Conclusión:**

Este commit es fundamental porque introduce conceptos clave de TypeScript que promueven un código más limpio, seguro y fácil de mantener. El uso de **interfaces** y **tipado estricto** en objetos y arrays permite detectar errores en tiempo de desarrollo, no en producción, lo cual es una práctica esencial en proyectos de cualquier escala.

---
*Este apunte fue generado automáticamente.*
