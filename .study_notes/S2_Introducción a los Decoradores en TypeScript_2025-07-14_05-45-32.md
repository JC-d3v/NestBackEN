## Resumen de apuntes
Loaded cached credentials.
Claro, aquí tienes los apuntes de estudio basados en el commit, con el formato solicitado.

---

# Apuntes de Estudio: Introducción a los Decoradores en TypeScript

### Basado en el commit: "S10 - UPDATE en TypeORM"

**Nota Aclaratoria:** Aunque el mensaje del commit menciona "TypeORM", los cambios introducidos se centran en una característica fundamental de TypeScript: los **Decoradores**. Este apunte explicará qué son, cómo funcionan y por qué son importantes.

## ¿Qué es un Decorador?

Un decorador es una característica experimental en TypeScript que permite añadir anotaciones y meta-programación a clases y a sus miembros (propiedades, métodos, etc.). En esencia, es una función especial que se puede "adjuntar" para modificar o extender el comportamiento de una clase sin alterar su código fuente original.

Los decoradores se ejecutan una sola vez, cuando se define la clase.

## 1. Habilitar la Característica Experimental

Para poder usar decoradores, el primer paso es habilitarlos en el archivo de configuración de TypeScript, `tsconfig.json`. Sin esta línea, el compilador arrojará un error.

**Archivo:** `tsconfig.json`
{
	"compilerOptions": {
		"experimentalDecorators": true,
		"target": "ES2020",
		"useDefineForClassFields": true,
		"module": "ESNext",
		// ...
	}
}
La clave aquí es `"experimentalDecorators": true`.

## 2. Creando un Decorador de Clase

Un decorador de clase es una función que recibe como único argumento el constructor de la clase a la que se aplica. Este tipo de decorador puede observar, modificar o incluso **reemplazar** la definición de la clase.

En este ejemplo, creamos un decorador (`MyDecorator`) que reemplaza por completo la clase `Pokemon` con una nueva clase llamada `NewPokemon`.

**Archivo:** `01-TypeScript-Intro/src/bases/05-decorators.ts`
class NewPokemon {
	constructor(
		public readonly id: number,
		public name: string
	) { }

	scream() {
		console.log(` Gritando`);
	}

	speak() {
		console.log(` Hablando`);
	}
}

// --- El Decorador ---
// Un decorador no es más que una función que retorna otra función.
const MyDecorator = () => {
	// El "target" es la clase a la que se aplica el decorador.
	return (target: Function) => {
		// En este caso, retornamos una clase completamente nueva.
		return NewPokemon;
	}
}

## 3. Aplicando el Decorador

Para aplicar un decorador a una clase, se utiliza la sintaxis `@NombreDelDecorador()` justo antes de la declaración de la clase.

**Archivo:** `01-TypeScript-Intro/src/bases/05-decorators.ts`
@MyDecorator()
export class Pokemon {

	constructor(
		public readonly id: number,
		public name: string
	) { }

	scream() {
		console.log(`${this.name.toUpperCase()}!!!`);
	}

	speak() {
		console.log(`${this.name}, ${this.name} !`);
	}
}

export const charmander = new Pokemon(4, 'Charmander');

charmander.scream();
charmander.speak();

## Análisis del Resultado

Aunque creamos una instancia de `Pokemon`, el decorador `@MyDecorator()` interceptó su definición y la reemplazó por la clase `NewPokemon`.

Por lo tanto, cuando se ejecutan los métodos `scream()` y `speak()`, los que realmente se invocan son los de la clase `NewPokemon`.

**Salida en consola:**
Gritando
Hablando

Esto demuestra el poder de los decoradores para alterar drásticamente el comportamiento de una clase. Los métodos originales de `Pokemon` (`CHARMANDER!!!` y `Charmander, Charmander !`) nunca se llegan a ejecutar.

## Conclusión Clave

Los decoradores son una herramienta de meta-programación muy potente en TypeScript. Permiten extender o modificar la funcionalidad de las clases de una manera limpia y declarativa. Frameworks como **NestJS** (que es el foco de este curso) y **Angular** los utilizan de forma extensiva para gestionar dependencias, definir rutas, validar datos y mucho más. Comprender su funcionamiento es fundamental para dominar estos entornos de desarrollo modernos.

---
*Este apunte fue generado automáticamente.*
