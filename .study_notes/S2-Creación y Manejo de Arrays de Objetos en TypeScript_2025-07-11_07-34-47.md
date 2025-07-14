## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# Apunte de Estudio: Creación y Manejo de Arrays de Objetos en TypeScript

En esta lección, exploramos cómo agrupar múltiples objetos que comparten una misma estructura (interfaz) dentro de un array. Este es un patrón fundamental para manejar colecciones de datos, como una lista de usuarios, productos o, en nuestro caso, Pokémons.

### 1. Transición de Objetos Individuales a un Array

Inicialmente, teníamos objetos `Pokemon` definidos de forma individual. Para gestionarlos como una colección, el cambio principal fue crear un array vacío y luego añadirle estos objetos.

**`src/bases/02-objects.ts`**

// Interfaz que define la estructura de un Pokémon
export interface Pokemon {
    id:   number;
    name: string;
    age:  number;
}

// Objetos individuales existentes
export const bulbasor: Pokemon = {
    id: 1,
    name: 'Bulbasor',
    age: 2
}

export const charmander: Pokemon = {
    id: 4,
    name: 'Charmander',
    age: 3
}

// --- INICIO DE CAMBIOS ---

// 1. Se declara y exporta un array vacío que contendrá objetos 'Pokemon'.
export const pokemons: Pokemon[] = [];

// 2. Se utiliza el método `push()` para añadir los objetos al array.
//    `push` puede aceptar múltiples elementos a la vez.
pokemons.push( charmander, bulbasor )

// 3. El `console.log` ahora muestra el contenido completo del array.
console.log(pokemons);

// --- FIN DE CAMBIOS ---

**Importancia del Cambio:**

*   **Agrupación Lógica:** En lugar de exportar e importar cada objeto por separado, ahora podemos manejar toda la colección a través de una única variable (`pokemons`).
*   **Escalabilidad:** Es mucho más sencillo añadir, eliminar o iterar sobre una lista de Pokémons cuando están en un array. Imagina tener que manejar 151 Pokémons como variables individuales.
*   **Tipado Fuerte:** Al declarar `pokemons: Pokemon[]`, TypeScript se asegura de que solo objetos que cumplan con la interfaz `Pokemon` puedan ser insertados en el array, previniendo errores.

### 2. Actualización de las Importaciones

Como ahora nuestra colección de datos está en la variable `pokemons`, el archivo principal (`main.ts`) debe ser actualizado para importar esta nueva variable en lugar de los objetos individuales.

**`src/main.ts`**

// Se importa el array `pokemons` en lugar del objeto `bulbasor`
import { pokemons } from './bases/02-objects'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    {/* 
      El H1 se limpió temporalmente. 
      Más adelante, podríamos iterar sobre el array 'pokemons' 
      para mostrar los nombres de todos.
    */}
    <h1>hello VITE</h1>  
  </div>
`

**Importancia del Cambio:**

*   **Consistencia:** El código ahora refleja la nueva estructura de datos. Al importar el array, tenemos acceso a *todos* los Pokémons, lo que permite desarrollar funcionalidades más complejas como mostrarlos en una lista, buscarlos o filtrarlos.
*   **Mantenibilidad:** Si se añade un nuevo Pokémon al array en `02-objects.ts`, no se necesita ningún cambio en las importaciones de `main.ts` para poder acceder a él a través de la colección.

---
*Este apunte fue generado automáticamente.*
