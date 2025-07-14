## Resumen de apuntes

Claro, aquí tienes un apunte de estudio detallado en formato Markdown, generado a partir del commit proporcionado.

---

# Apuntes de Estudio: — S1 Creación de un Proyecto con Vite y TypeScript

## Resumen del Commit

**Mensaje:** `Create README.md`

Aunque el mensaje del commit menciona "UPDATE en TypeORM", los cambios reflejan la **creación de un proyecto completamente nuevo** para introducir conceptos de TypeScript, utilizando **Vite** como herramienta de construcción (`build tool`). Este apunte se centrará en la estructura y configuración inicial de este nuevo proyecto, que es fundamental para el desarrollo front-end moderno.

## Cambios Clave y su Importancia

Este commit establece las bases de un entorno de desarrollo moderno, rápido y con tipado estático. Analicemos los componentes más importantes.

### 1. Estructura del Proyecto con Vite

Vite es una herramienta de construcción que mejora significativamente la experiencia de desarrollo front-end. Los archivos clave añadidos son:

- **`index.html`**: El punto de entrada de la aplicación. Es un HTML mínimo que carga el script principal de TypeScript.

  - **Importancia**: La magia ocurre en la línea `<script type="module" src="/src/main.ts"></script>`. Al ser un `type="module"`, permite usar la sintaxis de módulos de ES6 (`import`/`export`) directamente en el navegador, algo que Vite aprovecha para un desarrollo ultrarrápido.

- **`package.json`**: Define el proyecto, sus dependencias y los scripts para interactuar con él.

  - **`"type": "module"`**: Crucial. Indica a Node.js que los archivos `.js` y `.ts` del proyecto usarán la sintaxis de módulos de ES.
  - **`"scripts"`**: Proporciona comandos para iniciar el servidor de desarrollo (`dev`), compilar para producción (`build`) y previsualizar el resultado (`preview`).
  - **`"devDependencies"`**: `typescript` y `vite` son las únicas dependencias, mostrando un setup limpio y enfocado.

  {
  "name": "typescript-intro",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
  "dev": "vite --host",
  "build": "tsc && vite build",
  "preview": "vite preview"
  },
  "devDependencies": {
  "typescript": "~5.6.2",
  "vite": "^6.0.1"
  }
  }

- **`.gitignore`**: Un archivo esencial para mantener el repositorio limpio, ignorando archivos generados, dependencias y logs.

### 2. Configuración de TypeScript (`tsconfig.json`)

Este archivo es el cerebro del compilador de TypeScript. Define cómo se debe verificar y compilar el código.

- **`"target": "ES2020"`**: El código TypeScript se compilará a una versión moderna de JavaScript, asegurando compatibilidad con características recientes del lenguaje.
- **`"module": "ESNext"`**: Utiliza el sistema de módulos más moderno, compatible con Vite.
- **`"strict": true"`**: Activa todas las opciones de verificación de tipo estrictas.
  - **Importancia**: Es una de las mejores prácticas en TypeScript. Ayuda a capturar errores comunes en tiempo de compilación, antes de que lleguen a producción, resultando en un código más robusto y fiable.
- **`"noEmit": true"`**: Indica a TypeScript que solo realice la verificación de tipos, pero que no genere archivos JavaScript.
  - **Importancia**: En este setup, **Vite se encarga de la transpilación** (convertir TS a JS). `tsc` (el compilador de TypeScript) se usa únicamente como un "linter" de tipos, lo cual es mucho más rápido.

{
"compilerOptions": {
"target": "ES2020",
"useDefineForClassFields": true,
"module": "ESNext",
"lib": ["ES2020", "DOM", "DOM.Iterable"],
"skipLibCheck": true,

        /* Bundler mode */
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "isolatedModules": true,
        "moduleDetection": "force",
        "noEmit": true,

        /* Linting */
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedSideEffectImports": true
    },
    "include": ["src"]

}

### 3. El Corazón de la Aplicación (`src/main.ts`)

Este es el punto de entrada lógico de la aplicación. Aquí se inicializa todo.

- **Importaciones diversas**: Demuestra cómo Vite permite importar no solo otros archivos TypeScript (`./counter.ts`, `./bases/01-types`), sino también recursos estáticos como CSS (`./style.css`) e imágenes (`.svg`).
- **Manipulación del DOM**: Utiliza `document.querySelector` para encontrar elementos en el `index.html` y modificar su contenido o adjuntar eventos.

import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

// Aunque `01-types.ts` no está en el diff, su contenido sería algo así:
// export const name: string = 'Fernando';
// export const age: number = 35;
// export const isValid: boolean = true;
import { name, age, isValid } from './bases/01-types'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

  <div>
    <h1>hello ${name} ${age} ${isValid}</h1>  
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

## Conclusión

Este commit es una excelente lección sobre cómo iniciar un proyecto de front-end en la actualidad. Los puntos clave a recordar son:

1.  **Herramientas Modernas**: Vite ofrece un entorno de desarrollo extremadamente rápido y una configuración sencilla.
2.  **TypeScript como Base**: Usar TypeScript desde el inicio con la opción `"strict": true` es la mejor manera de construir aplicaciones mantenibles y con menos errores.
3.  **División de Responsabilidades**: `tsc` se usa para lo que es mejor—la verificación de tipos—mientras que Vite se encarga de la compilación y el empaquetado, optimizando el flujo de trabajo.

Este setup inicial es la base sobre la cual se construirán conceptos más complejos de TypeScript y desarrollo de aplicaciones.

---

_Este apunte fue generado automáticamente._
