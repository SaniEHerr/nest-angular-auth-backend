import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from "bcryptjs"

import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto'

import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor (
    @InjectModel( User.name ) 
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create( createUserDto: CreateUserDto ): Promise<User> {
    // console.log(createUserDto);

    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });

      await newUser.save();

      const { password:_, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      // console.log(error.code);
      if ( error.code = 11000 ) {
        throw new BadRequestException([`${ createUserDto.email } already exists!`])
      }

      throw new InternalServerErrorException('Something terrible happen!!!')
    }

    // 1-Encriptar la password
    // 2- Guardar el usuario
    // 3- Generar el JWT
    // 4- Manejar los errores 
  }

  async register( registerDto: RegisterUserDto ): Promise<LoginResponse> {

    // Como nuestro "registerDto" luce como un "createUserDto", la Fn create acepta al "registerDto". Si no fuese el caso tendriamos que hacer destructuring de las propiedades que hay en "registerDto" para que se parezca a "createUserDto"
    // ({ email: registerDto.email, name: registerDto.name, password: registerDto.password })
    const user = await this.create( registerDto );
    // console.log(user);

    // Ya tenemos la creacion de nuestro user, retornemos

    return {
      user: user,
      token: this.getJwToken({ id: user._id })
    }

  }

  async login( loginDto: LoginDto ): Promise<LoginResponse> {
    // La idea del login es que me regrese un user y un token de acceso
    /**
      * User
      * Token
    **/

    // console.log({ loginDto });

    // Verificacion del usuario
    const { email, password } = loginDto;

    // Verifico si el correo existe
    const user = await this.userModel.findOne( { email: email } )

    // Si el correo no existe, mando un error
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - email')
    }

    // Chequear si la password es correcta. Compara la password que me envia el user con la password que tengo en la base de datos
    if ( !bcryptjs.compareSync( password, user.password ) ) {
      // Si no hacen match, envio este error
      throw new UnauthorizedException('Not valid credentials - password')
    }

    // Una vez tengo el user, osea el email, y la password hace match, tengo que dar la respuesta

    
    const { password:_, ...restInfoUser } = user.toJSON();

    return {
      user: restInfoUser,
      token: this.getJwToken({ id: user.id })
    } 

    // return {
    //   ...restInfoUser,
    //   token: this.getJwToken({ id: user.id }),
    // }
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string ) {
    const user = await this.userModel.findById( id );
    const { password, ...restInfoUser } = user.toJSON();

    return restInfoUser;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  // Generacion de mi Jwt. Tenemos un payload, hacemos nuestro const token donde llamamos al servicio y usamos nuestro servicio, pasandole como parametro el payload que vamos a recibir, para finalmente devolver el token. El parametro payload lo recibe de user en la Fn login, donde se envia como payload el id del user.
  getJwToken ( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    
    return token;
  }
}

