// Si yo necesito recibir la info desde el front end hacia el back end, tengo que crear un dto para poder mapearlo, validarlo y esperar la info que yo espero. Si no viene la info que mi back end espera, no voy a permitir hacer nada. Basicamente por eso me tengo que crear un dto, para verificacion y validacion.

import { IsEmail, MinLength } from "class-validator";

export class LoginDto {

  @IsEmail() 
  email: string;

  @MinLength(6)
  password: string;

}