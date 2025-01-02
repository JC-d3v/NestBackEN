import { PokeApiAdapter, PokeApiFetchAdapter, HttpAdapter } from '../api/pokeApi.adapter';
import { Move, PokeapiResponseInterface } from '../interfaces/pokeapi-response.interface';
import { name } from './01-types';

export class Pokemon {

  get imageUrl(): string {
    return `https://pokemon.com/${this.id}.jpg`;
  }

  constructor(
    public readonly id: number,
    public name: string,
    // TODO: inyectar dependencias
    private readonly http: HttpAdapter

  ) { }

  scream() {
    console.log(`${this.name.toUpperCase()}!!!`);
  }

  speak() {
    console.log(`${this.name}, ${this.name}`);
  }

  async getMoves(): Promise<Move[]> {
    // const { data } = await axios .get<PokeapiResponseInterface>('https://pokeapi.co/api/v2/pokemon/4');
    const data = await this.http.get<PokeapiResponseInterface>('https://pokeapi.co/api/v2/pokemon/4');
    console.log(data.moves);

    return data.moves;
  }

}

const pokeApiAxios = new PokeApiAdapter();
const pokeApiFetch = new PokeApiFetchAdapter();

export const charmander = new Pokemon(4, 'Charmander', pokeApiAxios);

charmander.getMoves();