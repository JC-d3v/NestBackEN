// import { pokemons } from './bases/02-objects'
import { chamilion, charmander } from './bases/03-clases'
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
  ${chamilion.name}

  </div>
`

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
