## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

# Lección 10: Integración de Axios para Peticiones Asíncronas en Clases de TypeScript

En esta lección, damos un paso fundamental al conectar nuestras clases de TypeScript con el mundo exterior. Aprenderemos a obtener datos desde una API externa utilizando `axios`, la librería por excelencia para realizar peticiones HTTP. Este proceso nos introducirá a conceptos clave de asincronía como `async/await`.

---

### 1. Preparación del Entorno: Dependencias y Configuración

Antes de poder realizar peticiones, necesitamos añadir `axios` a nuestro proyecto y ajustar la configuración de TypeScript para asegurar una correcta compatibilidad.

#### **Añadiendo Dependencias en `package.json`**

Se añade `axios` como una dependencia de producción y `@types/axios` como una de desarrollo.

*   **`axios`**: Es la librería que nos permite realizar las peticiones HTTP.
*   **`@types/axios`**: Provee los archivos de definición de tipos para que TypeScript entienda la estructura y métodos de `axios`, permitiendo un autocompletado y análisis de código más robusto.

	"devDependencies": {
		"@types/axios": "^0.9.36",
		"typescript": "~5.6.2",
		"vite": "^6.0.1"
	},
	"dependencies": {
		"axios": "^1.7.9"
	}

#### **Ajuste del Compilador en `tsconfig.json`**

Para poder usar la sintaxis de importación estándar (`import axios from 'axios'`), habilitamos dos banderas en el compilador de TypeScript:

*   **`"esModuleInterop": true`**: Permite la interoperabilidad entre los módulos CommonJS (usados por muchas librerías de Node.js como `axios`) y los módulos ES6 que usamos en TypeScript.
*   **`"allowSyntheticDefaultImports": true`**: Permite crear importaciones por defecto sintéticas para módulos que no tienen una.

	/* Bundler mode */
	"allowSyntheticDefaultImports": true,
	"esModuleInterop": true,
	"moduleResolution": "bundler",

---

### 2. Implementación de la Petición Asíncrona

El cambio principal ocurre en nuestra clase `Pokemon`, donde creamos un nuevo método para obtener datos de la [PokéAPI](https://pokeapi.co/).

#### **Modificación de la Clase `Pokemon` (`03-clases.ts`)**

Se introduce el método `getMoves`, que es asíncrono y se encarga de la comunicación con la API.

import axios from 'axios';

export class Pokemon {

	// ... (propiedades y constructor sin cambios)

	// ... (getters y otros métodos sin cambios)

	scream() {
		console.log(`${this.name.toUpperCase()}!!!`);
	}

	speak() {
		console.log(`${this.name},  ${this.name}`);
	}

	async getMoves() {
		// const moves = 10;
		const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/4')
		console.log(data.moves);
		return data.moves
	}

}
export const charmander = new Pokemon(5, 'Charmander')

// Se comenta el código síncrono anterior
// charmander.scream();
// charmander.speak();

// Se invoca el nuevo método asíncrono
console.log(charmander.getMoves());


#### **Análisis del Código Clave:**

1.  **`import axios from 'axios';`**
    *   Importamos la librería que acabamos de instalar.

2.  **`async getMoves() { ... }`**
    *   La palabra clave `async` antes de la definición del método es fundamental. Indica que este método realizará operaciones asíncronas y que, implícitamente, devolverá una `Promise`.

3.  **`await axios.get(...)`**
    *   `await` pausa la ejecución *dentro* del método `getMoves` hasta que la `Promise` devuelta por `axios.get` se resuelva (es decir, hasta que la API nos responda).
    *   `axios.get(...)` envía una petición GET a la URL especificada.

4.  **`const { data } = ...`**
    *   La respuesta de `axios` es un objeto que contiene varias propiedades (como `status`, `headers`, etc.). Los datos que nos interesan casi siempre están en la propiedad `data`. Usamos la desestructuración de objetos para extraerla directamente en una constante.

5.  **`return data.moves`**
    *   El método devuelve la lista de movimientos del Pokémon. Como el método es `async`, lo que realmente se devuelve es una `Promise` que se resolverá con el valor de `data.moves`.

### Conclusión e Importancia

Este commit es un excelente ejemplo de cómo enriquecer una aplicación al consumir datos de servicios externos.

*   **Encapsulación**: La lógica para obtener los datos está contenida dentro de un método de la clase (`getMoves`). El código que utiliza un objeto `Pokemon` no necesita saber los detalles de la petición HTTP, solo necesita llamar al método.
*   **Asincronía Moderna**: El uso de `async/await` simplifica enormemente el manejo de código asíncrono, haciéndolo más legible y fácil de mantener en comparación con las devoluciones de llamada (`callbacks`) o el encadenamiento de `.then()`.
*   **Tipado y Seguridad**: Al combinar `axios` con `@types/axios`, mantenemos la seguridad de tipos que TypeScript nos ofrece, incluso al interactuar con datos externos.

---
*Este apunte fue generado automáticamente.*
