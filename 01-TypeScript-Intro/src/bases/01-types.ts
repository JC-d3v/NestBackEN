export let name: string = 'Jorge';

export const age: number = 333

export const isValid: boolean = true;


name = 'TEST';


export const templateString = `Esto es un string
multilinea
que puede tener 
" dobles
' Simples
y permite inyeccion de valores ${name}
expresiones ${1 + 1}
numeros ${age}
booleanos ${isValid}
`

console.log(templateString);
