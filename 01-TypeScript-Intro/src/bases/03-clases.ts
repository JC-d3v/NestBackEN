import axios from 'axios';

export class Pokemon {

  get imageUrl(): string {
    return `http://pokemon.com/${this.id}.jpg`
  }


  constructor(
    public readonly id: number,
    public name: string,
    // public imageURL: string,
  ) { }

  scream() {
    console.log(`${this.name.toUpperCase()} !!!`);
  }
  speak() {
    console.log(`${this.name},  ${this.name}`);
  }

  async getMoves() {
    // const moves = 10;
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/4')
    console.log(data.moves);
    return data.moves
  }

}
export const charmander = new Pokemon(5, 'Charmander')


// console.log(charmander.imageUrl);


// charmander.scream();
// charmander.speak();

console.log(charmander.getMoves());