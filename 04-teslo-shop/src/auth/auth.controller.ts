import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto, LoginUserDto } from './dto/index';
import { User } from './entities/user.entity';
import { UserRolesGuard } from './guards/user-roles.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }



  @Post('login')
  linkUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log(request);
    // console.log({ user });
    return {
      ok: true,
      message: 'Hola Mundo private',
      user,
      userEmail,
      rawHeaders,
      headers,
    }
  }


  // @SetMetadata('roles', ['ADMIN', 'super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(
    AuthGuard(),
    UserRolesGuard)
  privateRoute2(
    @GetUser() user: User
  ) {

    return {
      Ok: true,
      user
    }
  }


}
