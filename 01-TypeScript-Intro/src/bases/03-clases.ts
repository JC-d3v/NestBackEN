

export class PokemonLargo {
  public readonly id: number;
  public name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    console.log('construnctor llamado');
  }

}
export const charmander = new PokemonLargo(5, 'Charmander')


export class Pokemoncorto {
  constructor(
    public id: number,
    public name: string
  ) {

  }
}

charmander.id = 10;
charmander.name = 'Mew'

export const chamilion = new Pokemoncorto(2, 'Chamilion');