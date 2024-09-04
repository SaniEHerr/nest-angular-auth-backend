import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {

  @IsEmail({}, { message: 'Ingrese una dirección de correo electrónico válida' })
  email: string;

  @IsString()
  name: string;

  @MinLength(6)
  password: string;

}
