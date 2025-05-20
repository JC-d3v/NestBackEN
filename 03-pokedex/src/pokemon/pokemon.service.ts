import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

import { Pokemon } from "./entities/pokemon.entity";
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }


  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;

    } catch (error) {

      this.handleExceptions(error)
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // nro
    if (!isNaN(+term)) {  // !isNaN(ID) equivale a decir id es numero (doble negacion es afirmacion)
      pokemon = await this.pokemonModel.findOne({ nro: term });
    }

    // mongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with Id, Name or Nro  "${term}"  not found`)


    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }


    try {
      await pokemon.updateOne(updatePokemonDto);
      return {
        ...pokemon.toJSON(), ...updatePokemonDto
      }

    } catch (error) {

      this.handleExceptions(error)
    }

  }


  async remove(id: string) {

    const pokemon = await this.findOne(id);
    await pokemon.deleteOne();

  }



  private handleExceptions(error: any) {

    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in DB ${JSON.stringify(error.keyValue)} `)
    }
    console.log(error);
    throw new InternalServerErrorException('Can not create Pokemon - Check server logs');
  }


}



