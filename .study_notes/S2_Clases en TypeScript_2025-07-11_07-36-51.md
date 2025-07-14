## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes un apunte de estudio en formato Markdown basado en los cambios del commit.

---

# Apuntes de Estudio: Clases en TypeScript

## Introducción

En esta sesión, exploramos la creación y manipulación de clases en TypeScript. El objetivo es entender las diferentes sintaxis para definir una clase y cómo controlar la mutabilidad de sus propiedades, conceptos fundamentales para construir aplicaciones robustas y mantenibles.

## Puntos Clave del Commit

### 1. Sintaxis Larga para Definir Clases

TypeScript permite una sintaxis explícita y detallada para la definición de clases, similar a otros lenguajes de programación orientados a objetos como Java o C#.

*   **Declaración**: Primero se declaran las propiedades de la clase (e.g., `id`, `name`).
*   **Inicialización**: Luego, en el constructor, se asignan los valores a estas propiedades.

**Ejemplo (`01-TypeScript-Intro/src/bases/03-clases.ts`):**

export class PokemonLargo {
    public readonly id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        console.log('constructor llamado');
    }
}

### 2. Sintaxis Corta para Definir Clases

TypeScript ofrece una sintaxis más concisa y eficiente que reduce el código repetitivo. Al declarar las propiedades con un modificador de acceso (`public`, `private`, `protected`) directamente en los parámetros del constructor, TypeScript las crea e inicializa automáticamente.

**Ejemplo (`01-TypeScript-Intro/src/bases/03-clases.ts`):**

export class Pokemoncorto {
    constructor(
        public id: number,
        public name: string
    ) {}
}

Esta sintaxis es funcionalmente idéntica a la versión "larga", pero mucho más limpia y rápida de escribir.

### 3. Propiedades de Solo Lectura (`readonly`)

El modificador `readonly` es una característica de TypeScript que asegura que una propiedad solo pueda ser asignada durante su declaración o en el constructor de la clase. Una vez asignada, su valor no puede ser modificado.

En el ejemplo, la propiedad `id` de `PokemonLargo` es de solo lectura.

**Ejemplo de uso e inmutabilidad:**

export const charmander = new PokemonLargo(5, 'Charmander');

// Esta línea generaría un error de compilación porque `id` es readonly.
charmander.id = 10; 

// Esta línea es válida porque `name` no es readonly.
charmander.name = 'Mew'; 

Esta práctica es crucial para crear objetos inmutables, lo que previene efectos secundarios inesperados y facilita el razonamiento sobre el estado de la aplicación.

### 4. Integración y Uso

Finalmente, los cambios en `main.ts` demuestran cómo importar y utilizar estas nuevas clases para instanciar objetos y acceder a sus propiedades, mostrando el resultado en la interfaz de la aplicación.

**Ejemplo (`01-TypeScript-Intro/src/main.ts`):**

import { chamilion, charmander } from './bases/03-clases'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>hello VITE</h1>  
    ${charmander.name}
    ${chamilion.name}
  </div>
`

## Conclusión

Este commit ilustra dos formas de definir clases en TypeScript y el uso de `readonly` para garantizar la inmutabilidad de las propiedades. La sintaxis corta es preferida por su brevedad y claridad, mientras que `readonly` es una herramienta poderosa para escribir código más seguro y predecible.

---
*Este apunte fue generado automáticamente.*
