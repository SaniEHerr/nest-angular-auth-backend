import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    // Como estoy en otro modulo, yo necesito acceso a las variables de entorno, que tecnicamente ya estan configuradas pero en el momento que esto se crea todavia no estan puestsas, entonces llamo nuevamente al ConfigModule, de esta forma nuestras variables de entorno van a estar listas.
    ConfigModule.forRoot(),
    // Con esto importo todos los modelos que quiero exponer al modulo. En este caso lo hago para poder exponer mi modelo de User
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    // Esto va a firmar nuestros tokens
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '3h' },
    }),

  ]
})
export class AuthModule {}
