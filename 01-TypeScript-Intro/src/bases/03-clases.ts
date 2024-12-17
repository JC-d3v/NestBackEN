

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


}
export const charmander = new Pokemon(5, 'Charmander')


console.log(charmander.imageUrl);


charmander.scream;
charmander.speak;