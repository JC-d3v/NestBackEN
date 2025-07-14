## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

# S10: Refactorización con Patrón Adaptador e Inyección de Dependencias

En esta sesión, exploramos cómo refactorizar nuestro código para hacerlo más flexible y desacoplado. Los cambios se centran en la implementación del **Patrón Adaptador** y el uso explícito de la **Inyección de Dependencias**, dos conceptos clave en el desarrollo de software robusto.

El objetivo es poder intercambiar la librería o método para realizar peticiones HTTP (en este caso, entre `axios` y `fetch`) sin tener que modificar la lógica de negocio de nuestra clase `Pokemon`.

---

### 1. Creación de un Nuevo Adaptador con `fetch`

Primero, introducimos una nueva clase, `PokeApiFetchAdapter`, que utiliza la API nativa `fetch` del navegador para realizar peticiones `GET`. Esto nos da una alternativa a `axios`.

**Archivo**: `01-TypeScript-Intro/src/api/pokeApi.adapter.ts`

import axios from "axios";

// highlight-start
export class PokeApiFetchAdapter {
	async get<T>(url: string): Promise<T> {
		const resp = await fetch(url);
		const data: T = await resp.json();

		return data;
	}
}
// highlight-end

export class PokeApiAdapter {
	// ...código existente
}

**Importancia**:
*   **Alternativa Nativa**: `fetch` es una API moderna integrada en los navegadores y en entornos como Node.js, eliminando la necesidad de dependencias externas para tareas simples.
*   **Flexibilidad**: Tener múltiples adaptadores nos permite elegir la implementación que mejor se adapte a nuestras necesidades o al entorno de ejecución.

### 2. Tipado Genérico en los Adaptadores

Para hacer nuestros adaptadores más reutilizables y seguros, hemos introducido **genéricos (`<T>`)**. Ahora, el método `get` puede devolver una promesa de cualquier tipo que especifiquemos al llamarlo.

**Archivo**: `01-TypeScript-Intro/src/api/pokeApi.adapter.ts`

export class PokeApiAdapter {
	private readonly axios = axios;

	// highlight-start
	async get<T>(url: string): Promise<T> {
		const { data } = await this.axios.get<T>(url);
		return data;
	}
	// highlight-end
}

**Importancia**:
*   **Type Safety**: Al usar genéricos, garantizamos que el tipo de dato devuelto por la petición HTTP es el que esperamos. Por ejemplo, podemos asegurar que la respuesta se ajuste a nuestra `PokeapiResponseInterface`.
*   **Reusabilidad**: El mismo método `get` puede ser utilizado para obtener diferentes tipos de datos de distintas URLs, manteniendo siempre un tipado fuerte.

### 3. Inyección de Dependencias en Acción

El cambio más significativo ocurre en la clase `Pokemon`. Gracias a que la clase recibe una dependencia (el adaptador HTTP) en su constructor, podemos "inyectarle" cualquiera de los dos adaptadores (`PokeApiAdapter` o `PokeApiFetchAdapter`) sin cambiar una sola línea de su código interno.

**Archivo**: `01-TypeScript-Intro/src/bases/04-injection.ts`

// 1. Importamos ambos adaptadores
// highlight-next-line
import { PokeApiAdapter, PokeApiFetchAdapter } from '../api/pokeApi.adapter';
import { Move, PokeapiResponseInterface } from '../interfaces/pokeapi-response.interface';

export class Pokemon {
	// ...

	async getMoves(): Promise<Move[]> {
		// 2. La llamada ahora es genérica, mejorando la seguridad de tipos
		// highlight-next-line
		const data = await this.http.get<PokeapiResponseInterface>('https://pokeapi.co/api/v2/pokemon/4');
		console.log(data.moves);

		return data.moves;
	}
}

// 3. Creamos instancias de ambos adaptadores
const pokeApi = new PokeApiAdapter();
// highlight-next-line
const pokeApiFetch = new PokeApiFetchAdapter();

// 4. Inyectamos la nueva dependencia (fetch) en lugar de la anterior (axios)
// highlight-next-line
export const charmander = new Pokemon(4, 'Charmander', pokeApiFetch);

charmander.getMoves();

**Importancia**:
*   **Desacoplamiento**: La clase `Pokemon` ya no "sabe" cómo se hacen las peticiones HTTP; solo sabe que tiene un colaborador (`this.http`) que puede hacerlas. Esto es el núcleo del Principio de Inversión de Dependencias.
*   **Facilidad de Pruebas (Testing)**: Al probar la clase `Pokemon`, podemos inyectarle un "adaptador falso" (un mock) que devuelva datos controlados, permitiéndonos probar la lógica de `getMoves` de forma aislada y sin realizar peticiones reales a internet.
*   **Mantenibilidad**: Si en el futuro decidimos migrar de `fetch` a otra librería, solo necesitaríamos crear un nuevo adaptador. El resto del código de la aplicación que depende de esta lógica permanecería intacto.

---
*Este apunte fue generado automáticamente.*
