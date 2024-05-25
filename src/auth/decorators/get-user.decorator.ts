import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";



//TODO : Decorador para obtener el usuario de la peticion o informacion del usuario
export const GetUser = createParamDecorator(
    (data:string, ctx: ExecutionContext) => {

        const request = ctx.switchToHttp().getRequest();

        const user = request.user;

        if( !user )
            throw new InternalServerErrorException('Usuario no encontrado (request)');

        return (!data) ? user : user[data];
    }
);