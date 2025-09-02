import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }


  async create(createUserDto: CreateUserDto) {


    try {

      const user = this.userRepository.create(createUserDto);

      await this.userRepository.save(user)

      return user;
    } catch (error) {
      // console.log({ error });
      this.handleDbExceptions(error)
    }

  }


  private handleDbExceptions(error: any): never {

    if (error.errno === 1062)
      throw new BadRequestException(error.sqlMessage);

    this.logger.error(error)
    // console.log({ error });
    throw new InternalServerErrorException('Unexcpeced error check server logs!!!');


  }


}
