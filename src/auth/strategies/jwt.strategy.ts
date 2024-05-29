import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Usuarios } from "../../entities/Usuarios";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository(Usuarios)
        private userRepository: Repository<Usuarios>,

        configService : ConfigService
    ){

        super(
            {
                secretOrKey: configService.get('JWT_SECRET'),
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            }
        )
    }


    async validate(payload: JwtPayload) : Promise<Usuarios>{

        const { email } = payload;

        // const user = await this.userRepository.findOne( 
        //     { 
        //         where: { email },
        //         relations: ['idTipo'],
        //     } 
            
        // );


        const user = await this.userRepository.createQueryBuilder('usuario')
            .leftJoinAndSelect('usuario.idTipo', 'tipo')
            .select([
                'usuario.id',
                'usuario.nombres',
                'usuario.apellidos',
                'usuario.email',
                'usuario.estado',
                'tipo.descripcion',
                'tipo.estado'
            ])
            .where('usuario.email = :email', { email })
            .getOne();

        if(!user) 
            throw new UnauthorizedException('Token no valido');

        if(user.estado === 0)
            throw new UnauthorizedException('Usuario inactivo');

        return user ;
    }


}