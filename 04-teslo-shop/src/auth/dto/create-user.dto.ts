import { IsEmail, isString, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  // @MinLength(6)
  @MaxLength(50)
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  // @Matches(
  //   /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'The password must have a Uppercase, lowercase letter and a number'
  // })
  password: string;

  @IsString()
  @MinLength(1)
  fullName: string;

}