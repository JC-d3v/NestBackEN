// import { pokemons } from './bases/02-objects'
// import { charmander } from './bases/03-clases'
// import { charmander } from './bases/04-injection'
import { charmander } from './bases/05-decorators'


import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// import { name, age, isValid } from './bases/01-types'

charmander

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
  <h1>hello VITE </h1>  
  ${charmander.name}

  </div>
`

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
