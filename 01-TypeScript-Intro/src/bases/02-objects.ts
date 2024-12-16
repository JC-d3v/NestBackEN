export const pokemonIds = [1, 20, 30, 34, 66];

// pokemonIds.push('qwerty');

interface Pokemon {
  id: number;
  name: string;
  age: number;
}

export const bulbasor: Pokemon = {
  id: 1,
  name: 'Bulbasor',
  age: 2
}

export const charmander: Pokemon = {
  id: 3,
  name: 'Charmander',
  age: 3
}


export const pokemons: Pokemon[] = [];

pokemons.push(charmander, bulbasor)

console.log(pokemons);