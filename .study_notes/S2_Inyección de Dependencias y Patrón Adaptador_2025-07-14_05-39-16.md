## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

---

# S2: Inyección de Dependencias y Patrón Adaptador

En esta sesión, refactorizamos nuestro código para aplicar dos principios de diseño de software fundamentales: la **Inyección de Dependencias** y el **Patrón Adaptador**. El objetivo es desacoplar la clase `Pokemon` de las implementaciones concretas de cómo se realizan las peticiones HTTP (ya sea con `fetch` o `axios`), logrando un código más flexible, mantenible y fácil de probar.

### Paso 1: Definir un Contrato con una Interfaz

El primer paso para desacoplar nuestras clases es crear una abstracción. En lugar de depender de una clase específica, dependeremos de una interfaz que define un “contrato”. Cualquier clase que quiera funcionar como nuestro adaptador de HTTP deberá cumplir con este contrato.

Creamos la interfaz `HttpAdapter`, que define cómo debe ser cualquier adaptador que queramos usar para las peticiones `GET`.

**`src/api/pokeApi.adapter.ts`**
import axios from "axios";

// --- Definición del Contrato ---
export interface HttpAdapter {
    get<T>( url: string ): Promise<T>;
}

export class PokeApiFetchAdapter implements HttpAdapter {
    async get<T>( url: string ): Promise<T> {
        const resp = await fetch( url );
        const data: T = await resp.json();
        console.log( 'con fetch' );
        return data;
    }
}

export class PokeApiAdapter implements HttpAdapter {
    private readonly axios = axios;

    async get<T>( url: string ): Promise<T> {
        const { data } = await this.axios.get<T>( url );
        console.log( 'con axios' );
        return data;
    }
}
**Importancia:** Al definir `HttpAdapter`, establecemos una regla clara. Cualquier clase que la implemente *debe* tener un método `get`. Esto nos permite intercambiar adaptadores sin que el resto de nuestro código se vea afectado.

### Paso 2: Modificar la Clase `Pokemon` para la Inyección

A continuación, modificamos la clase `Pokemon`. En lugar de forzarla a usar una implementación específica como `PokeApiAdapter`, la cambiamos para que dependa de la abstracción: la interfaz `HttpAdapter`.

La dependencia ahora se “inyecta” a través del constructor.

**`src/bases/04-injection.ts`**
import { HttpAdapter, PokeApiAdapter, PokeApiFetchAdapter } from '../api/pokeApi.adapter';
import { Move, PokeapiResponseInterface } from '../interfaces/pokeapi-response.interface';

export class Pokemon {

    constructor(
        public readonly id: number,
        public name: string,
        // La dependencia ya no es una clase concreta,
        // sino la abstracción (interfaz).
        private readonly http: HttpAdapter
    ) {}

    async getMoves(): Promise<Move[]> {
        const data = await this.http.get<PokeapiResponseInterface>(`https://pokeapi.co/api/v2/pokemon/4`);
        console.log( data.moves );
        return data.moves;
    }
    // ... resto de la clase
}
**Importancia:** La clase `Pokemon` ya no sabe si está usando `axios` o `fetch`. Solo sabe que tiene un colaborador (`http`) que cumple con el contrato `HttpAdapter` y puede hacer peticiones `get`. Esto es la **inversión de dependencias** en acción.

### Paso 3: Inyectar la Dependencia en la Instancia

Finalmente, al crear una instancia de `Pokemon`, elegimos qué implementación concreta queremos “inyectar”. Esto nos da total flexibilidad para cambiar el comportamiento sin modificar la clase `Pokemon`.

**`src/bases/04-injection.ts`**
// ... (definición de la clase Pokemon)

const pokeApiAxios = new PokeApiAdapter();
const pokeApiFetch = new PokeApiFetchAdapter();

// Inyectamos la implementación basada en Axios.
// Podríamos cambiar a pokeApiFetch y funcionaría igual.
export const charmander = new Pokemon( 4, 'Charmander', pokeApiAxios );

charmander.getMoves();

### Conclusión

Este refactor nos ha permitido:
1.  **Desacoplar el Código:** `Pokemon` ya no depende de `axios` o `fetch`, sino de una interfaz.
2.  **Aumentar la Flexibilidad:** Podemos cambiar de `axios` a `fetch` (o a cualquier otra librería futura) con solo modificar una línea en el momento de la instanciación.
3.  **Mejorar la Testeabilidad:** Al hacer pruebas, podemos inyectar una versión “falsa” o *mock* del `HttpAdapter` para simular respuestas de la API sin necesidad de hacer peticiones reales, haciendo nuestros tests más rápidos y fiables.

---
*Este apunte fue generado automáticamente.*
