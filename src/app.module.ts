import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Para el uso de las variables de entorno
    ConfigModule.forRoot(),
    // Para la conexion a la base de datos. Use una variable de entorno
    MongooseModule.forRoot( process.env.MONGO_URI ),
    // Modulo para mi Autentificacion
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
