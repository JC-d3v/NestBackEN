## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

---

# S10: Mejorando la Inyección de Dependencias con Interfaces (Patrón Adaptador)

En esta sesión, se refactoriza el código para aplicar de una manera más robusta el principio de inyección de dependencias, haciendo uso de interfaces para desacoplar nuestras clases de implementaciones concretas. El objetivo es que nuestra clase `Pokemon` no dependa directamente de un paquete específico como `axios` o `fetch`, sino de una abstracción.

### 1. Creación de una Interfaz de Abstracción (`HttpAdapter`)

El cambio más importante es la introducción de la interfaz `HttpAdapter`. Esta interfaz define un “contrato” que cualquier clase que gestione peticiones HTTP debe cumplir. En este caso, estipula que debe existir un método `get`.

export interface HttpAdapter {
    get<T>( url: string ): Promise<T>;
}

**Importancia:**

*   **Desacoplamiento:** Al depender de una interfaz, la clase `Pokemon` ya no necesita “saber” cómo se realizan las peticiones HTTP. No le importa si se usa `axios`, `fetch` u otra librería.
*   **Contrato Clave:** Asegura que cualquier adaptador que creemos tenga los métodos necesarios para que el resto del código funcione correctamente.

### 2. Implementación de la Interfaz en los Adaptadores

Una vez definida la interfaz, las clases que actúan como adaptadores deben implementarla. Esto las obliga a adherirse al contrato.

// Adaptador para Fetch API
export class PokeApiFetchAdapter implements HttpAdapter {
    async get<T>( url: string ): Promise<T> {
        const resp = await fetch( url );
        const data: T = await resp.json();
        console.log( 'con fetch' );
        return data;
    }
}

// Adaptador para Axios
export class PokeApiAdapter implements HttpAdapter {
    private readonly axios = axios;

    async get<T>( url: string ): Promise<T> {
        const { data } = await this.axios.get<T>( url );
        console.log( 'con axios' );
        return data;
    }
}

**Nota:** El `diff` no muestra explícitamente `implements HttpAdapter` en `PokeApiAdapter`, pero es el siguiente paso lógico y es requerido para que el código funcione como se espera tras el cambio en la clase `Pokemon`.

### 3. Refactorización de la Clase `Pokemon`

La clase `Pokemon` ahora depende de la abstracción (`HttpAdapter`) en lugar de una implementación concreta (`PokeApiAdapter`).

**Antes:**

// ...
import { PokeApiAdapter } from '../api/pokeApi.adapter';

export class Pokemon {
    constructor(
        // ...
        private readonly http: PokeApiAdapter
    ) {}
    // ...
}

**Después:**

// ...
import { HttpAdapter } from '../api/pokeApi.adapter';

export class Pokemon {
    constructor(
        // ...
        private readonly http: HttpAdapter // <-- ¡Cambio clave!
    ) {}
    // ...
}

**Importancia:**

*   **Flexibilidad:** Ahora podemos “inyectar” cualquier adaptador que cumpla con la interfaz `HttpAdapter`. Esto hace que la clase `Pokemon` sea mucho más reutilizable y flexible.
*   **Principio de Inversión de Dependencias:** Los módulos de alto nivel (`Pokemon`) no deben depender de módulos de bajo nivel (`PokeApiAdapter`). Ambos deben depender de abstracciones (`HttpAdapter`).

### 4. Uso e Instanciación

Al crear una instancia de `Pokemon`, podemos decidir qué implementación concreta usar y pasársela al constructor. El resto de la clase `Pokemon` funcionará sin cambios.

const pokeApiAxios = new PokeApiAdapter();
const pokeApiFetch = new PokeApiFetchAdapter();

// Podemos usar cualquiera de las dos implementaciones
export const charmander = new Pokemon( 4, 'Charmander', pokeApiAxios );

charmander.getMoves();

**Conclusión:**

Este cambio es fundamental para escribir código limpio, mantenible y escalable. Al depender de abstracciones (interfaces) en lugar de implementaciones concretas, logramos un bajo acoplamiento entre los componentes de nuestra aplicación, facilitando futuras modificaciones y la realización de pruebas unitarias (ya que podemos “inyectar” un adaptador falso o *mock*).

---
*Este apunte fue generado automáticamente.*
