## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes el apunte de estudio en formato Markdown basado en el commit proporcionado.

---

# Apuntes de Estudio: Refactorización de Clases en TypeScript

Este apunte se basa en una refactorización de la clase `Pokemon`, mostrando cómo evolucionar de una definición de clase básica a una más concisa y funcional, utilizando características clave de TypeScript.

## 1. Simplificación del Constructor

Una de las mejoras más significativas es el uso de la **asignación automática de propiedades** en el constructor. Esto elimina la necesidad de declarar explícitamente las propiedades y asignarlas dentro del constructor, resultando en un código mucho más limpio.

### Antes: Definición Larga

Se tenía una clase verbosa donde cada propiedad se declaraba y luego se asignaba en el constructor.

export class PokemonLargo {
	public readonly id: number;
	public name: string;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
		console.log('construnctor llamado');
	}
}

### Después: Definición Corta y Eficiente

La nueva clase `Pokemon` utiliza modificadores de acceso (`public`, `readonly`) directamente en los parámetros del constructor. TypeScript se encarga de crear las propiedades y asignarles los valores automáticamente.

export class Pokemon {
	constructor(
		public readonly id: number,
		public name: string,
	) { }
}

> **Nota:** El modificador `readonly` asegura que la propiedad `id` solo pueda ser asignada en el momento de la inicialización (en el constructor) y no pueda ser modificada posteriormente.

## 2. Getters: Propiedades Computadas

Se introdujo un `getter` para la propiedad `imageUrl`. Un getter permite calcular un valor dinámicamente cada vez que se accede a la propiedad, como si fuera una propiedad normal, pero sin necesidad de llamar a un método.

	get imageUrl(): string {
		return `http://pokemon.com/${this.id}.jpg`
	}

**Uso:** Se accede directamente a la propiedad, sin usar paréntesis `()`.

const charmander = new Pokemon(5, 'Charmander');

// Se accede como una propiedad, no como un método.
console.log(charmander.imageUrl); // --> "http://pokemon.com/5.jpg"

## 3. Métodos de Clase

Se añadieron métodos a la clase para encapsular comportamientos específicos del objeto. Esto es fundamental en la Programación Orientada a Objetos.

	scream() {
		console.log(`${this.name.toUpperCase()} !!!`);
	}

	speak() {
		console.log(`${this.name},  ${this.name}`);
	}

**Invocación:** Para ejecutar los métodos, se utilizan paréntesis `()`.

charmander.scream(); // --> "CHARMANDER !!!"
charmander.speak();  // --> "Charmander, Charmander"

## 4. Limpieza y Consolidación del Código

*   **Eliminación de Clases Redundantes:** Se eliminó `PokemonLargo` y `Pokemoncorto` fue renombrada a `Pokemon`, consolidando todo en una única clase bien definida.
*   **Actualización de Importaciones:** El archivo `main.ts` fue actualizado para importar y usar únicamente la nueva clase `Pokemon`, eliminando referencias a instancias obsoletas como `chamilion`.

// Archivo: main.ts
// Se elimina la importación y el uso de 'chamilion'
import { charmander } from './bases/03-clases'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>hello VITE</h1>  
    ${charmander.name}
  </div>
`

### Resumen de la Refactorización

| Característica | Antes (Código Antiguo) | Después (Código Refactorizado) | Beneficio |
| :--- | :--- | :--- | :--- |
| **Definición** | Dos clases (`PokemonLargo`, `Pokemoncorto`) | Una única clase `Pokemon` | Consolidación y claridad. |
| **Constructor** | Declaración y asignación manual. | Asignación automática de propiedades. | Código más conciso y legible. |
| **Propiedades** | `id` era mutable. | `id` es `readonly`. | Inmutabilidad y seguridad de datos. |
| **Funcionalidad** | Solo propiedades de datos. | Incluye métodos (`scream`, `speak`) y un getter (`imageUrl`). | Clase más rica y funcional. |

Esta refactorización es un excelente ejemplo de cómo aprovechar las características de TypeScript para escribir un código más robusto, mantenible y expresivo.

---
*Este apunte fue generado automáticamente.*
