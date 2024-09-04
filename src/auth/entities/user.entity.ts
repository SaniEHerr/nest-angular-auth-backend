import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

  // El ID lo crea automaticamente mongo, pero aca lo creamos para facilitar nuestro codigo, diciendo que algunos User, van a tener esta propiedad de _id
  _id?: string;

  @Prop( { unique: true, required: true } )
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ minlength: 6, required: true })
  password?: string;

  @Prop({ default: true })
  // Me indica si el User esta activo o no. Pero yo no necesito grabar esta propiedad cuando sea crea el usuario. Mejor, lo que podemos hacer es que cuando se crea un User, por defecto va a estar su valor en true. O sea, no va a ser falta que sea requeried, por lo que no se envia ningun valor para esta propiedad, su valor por defecto va a ser true.
  isActive: boolean;

  @Prop({ type: [String], default: ['User'] })
  // Como estoy diciendo que es un Array de String, tambien tengo que avisarle a Mongo como quiero que se almacene ese objeto, por eso pongo "type: [String]". Ademas le podemos mandar un valor defecto.
  // Establecer roles tipo user, admin, superadmin.
  roles: string[];

}

export const UserSchema = SchemaFactory.createForClass( User )