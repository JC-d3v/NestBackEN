## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en los cambios del commit.

---

# Apuntes de Estudio: Inyección de Dependencias y Patrón Adaptador

En esta sesión, se introduce un concepto fundamental en el desarrollo de software robusto y escalable: la **Inyección de Dependencias (Dependency Injection)**. Para lograrlo, nos apoyamos en otro patrón de diseño conocido como el **Patrón Adaptador (Adapter Pattern)**.

El objetivo principal es desacoplar la clase `Pokemon` de una dependencia externa específica, en este caso, la librería `axios`.

### 1. El Problema: Alto Acoplamiento

Antes de los cambios, si la clase `Pokemon` necesitaba hacer una petición HTTP, habría llamado a `axios` directamente desde sus métodos. Esto crea un **acoplamiento fuerte**, lo que significa que:

*   La clase `Pokemon` depende directamente de `axios`.
*   Si quisiéramos cambiar `axios` por otra librería (como `fetch`), tendríamos que modificar la clase `Pokemon`.
*   Hacer pruebas unitarias es más difícil, ya que no podemos “simular” (mockear) fácilmente la respuesta de `axios` sin trucos complejos.

### 2. La Solución: Patrón Adaptador

Para resolver esto, primero creamos un “adaptador”. Esta es una clase que envuelve la librería externa (`axios`) y expone métodos propios y genéricos.

**`01-TypeScript-Intro/src/api/pokeApi.adapter.ts`**

import axios from "axios";

export class PokeApiAdapter {

	private readonly axios = axios;

	async get(url: string) {
		const { data } = await this.axios.get(url);
		return data;
	}

	async post(url: string, data: any) {
		// ...
	}

	async patch(url: string, data: any) {
		// ...
	}

	async delete(url: string) {
		// ...
	}
}

**Importancia del Adaptador:**

*   **Abstracción:** La clase `PokeApiAdapter` abstrae el uso de `axios`. Ahora, el resto de nuestra aplicación no necesita saber que estamos usando `axios`; solo interactúa con nuestro adaptador.
*   **Punto Único de Cambio:** Si en el futuro decidimos migrar de `axios` a `fetch`, solo tendríamos que cambiar el código *dentro* de `PokeApiAdapter`, y el resto de la aplicación seguiría funcionando sin cambios.

### 3. Aplicando la Inyección de Dependencias

Con el adaptador listo, modificamos la clase `Pokemon` para que reciba una instancia del adaptador a través de su constructor. Esto es la **inyección de dependencias**: en lugar de que la clase cree sus propias dependencias, se las “inyectamos” desde fuera.

**`01-TypeScript-Intro/src/bases/04-injection.ts`**

import { PokeApiAdapter } from '../api/pokeApi.adapter';
import { Move, PokeapiResponseInterface } from '../interfaces/pokeapi-response.interface';

export class Pokemon {

	get imageUrl(): string {
		return `https://pokemon.com/${ this.id }.jpg`;
	}

	constructor(
		public readonly id: number,
		public name: string,
		// Aquí se inyecta la dependencia
		private readonly http: PokeApiAdapter
	) { }

	scream() {
		console.log(`${ this.name.toUpperCase() }!!!`);
	}

	speak() {
		console.log(`${ this.name }, ${ this.name }`);
	}

	async getMoves(): Promise<Move[]> {
		// La clase ya no sabe que existe axios, solo usa el adaptador `http`
		const data = await this.http.get('https://pokeapi.co/api/v2/pokemon/4');
		console.log(data.moves);

		return data.moves;
	}
}

// 1. Creamos una instancia de nuestro adaptador
const pokeApi = new PokeApiAdapter();

// 2. Inyectamos la instancia en el constructor de Pokemon
export const charmander = new Pokemon(4, 'Charmander', pokeApi);

charmander.getMoves();

### Conclusiones Clave

*   **Desacoplamiento:** La clase `Pokemon` ya no está atada a `axios`. Ahora depende de una abstracción (`PokeApiAdapter`), lo que la hace más flexible.
*   **Testabilidad:** Para las pruebas, podemos crear un “adaptador falso” (mock) que simule respuestas de la API sin hacer peticiones reales. Luego, simplemente lo inyectamos en la clase `Pokemon` durante las pruebas.
*   **Código Limpio y Escalable:** Este enfoque sigue principios de diseño de software como el de **Inversión de Dependencias (Dependency Inversion)**, lo que resulta en un código más mantenible y fácil de extender a largo plazo.

---
*Este apunte fue generado automáticamente.*
