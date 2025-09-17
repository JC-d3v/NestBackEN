import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

  ) { }


  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user)

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
      // TODO: Retorna el JWT de accesso

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



  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
      }
    })

    if (!user)
      throw new UnauthorizedException('Credencials are not valid (email) ')

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credencials are not valid (password) ')

    // console.log({ user });

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
    // TODO: retorna el JWT

  }


  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  async checkAuthStatus(user: User) {

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

}
