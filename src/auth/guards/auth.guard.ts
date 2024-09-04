import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {} 

  async canActivate( context: ExecutionContext ): Promise<boolean> {
    
    // Info de la request
    const request = context.switchToHttp().getRequest(); 
    // console.log({ request });
    const token = this.extractTokenFromHeader(request);
    // console.log({ token });

    if (!token) {
      throw new UnauthorizedException('There is no Bearer Token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SEED }
      );

      const user = await this.authService.findUserById( payload.id )

      if ( !user ) throw new UnauthorizedException('User does not exist');
      if ( !user.isActive ) throw new UnauthorizedException('User is not active');
  
      // console.log({ payload });

      // Si todo sale bien, coloco al user encontrado en la request, lo que me va devolver todo el objeto del user
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
