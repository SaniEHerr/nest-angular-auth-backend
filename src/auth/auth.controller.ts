import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto'
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    return this.authService.create(createUserDto);
  }

  // la Fn login va a tener como parametro a loginDto que tiene como tipo a LoginDto. Luego hacemos el llamada a nuestro servicio y hacemos referencia a su fn login, que espera como argumento a nuestro loginDto. Esto se hace para poder verificar lo que esta esperando y recibiendo. Haciendo un console.log en la fn login de nuestro servicio, vemos como nos llega la info correcta
  @Post('/login')
  login( @Body() loginDto: LoginDto ) {
    return this.authService.login( loginDto );
  }

  @Post('/register')
  register( @Body() registerDto: RegisterUserDto ) {
    return this.authService.register( registerDto );
  }

  // Este guard es para que solo usuarios authentificados puedan hacer esta peticion de todos los Users
  @UseGuards( AuthGuard )
  @Get()
  findAll( @Request() req: Request ) {
    // console.log(req);
    // const user = req['user'];

    // return user;
    return this.authService.findAll();
  }

  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request ): LoginResponse {
    const user = req['user'] as User;

    return {
      user,
      token: this.authService.getJwToken({ id: user._id })
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
