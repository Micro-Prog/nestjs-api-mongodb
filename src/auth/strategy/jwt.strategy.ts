import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { 
    ExtractJwt,
    Strategy,
} from 'passport-jwt';
import { Model } from "mongoose";
import { User } from "../schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";


@Injectable()
export class JwtStrategy extends PassportStrategy (
    Strategy,
    'jwt'
) {
    constructor (
            config: ConfigService, 
            @InjectModel(User.name)
            private userModel: Model<User>,
        ) {
        super({
            jwtFromRequest:
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.getOrThrow('JWT_SECRET') || 'undefined'
        });
    }

        // the validate function
    async validate(payload) {
        const { id } = payload;

        // find the user by id
        const user = await this.userModel.findById(id);

        // if not exists
        if(!user) {
            throw new UnauthorizedException('Login first to access this route.');
        }


        return user;
    }
}








// import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { PassportStrategy } from "@nestjs/passport";
// import { Model } from "mongoose";
// import { User } from "../schema/user.schema";
// import { ConfigModule, ConfigService } from "@nestjs/config";
// import { 
//     ExtractJwt,
//     Strategy,
// } from 'passport-jwt';


// @Injectable()
// export class JwtStrategy extends PassportStrategy (
//     Strategy,
//     'jwt'
//     ) {
//         constructor (
//             private config: ConfigService, 
//             @InjectModel(User.name)
//             private userModel: Model<User>,
//             ) {
//             super({
//                 jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//                 secretOrKey: config.get('JWT_SECRET')
//             });
//         }
//     // constructor(
//     //     @Inject(ConfigService) private readonly configService: ConfigService, // <- injected config service here
//     //     @InjectModel(User.name)
//     //     private userModel: Model<User>,
//     // ) {
//     //     super({
//     //         // jwtFromRequest:
//     //         // ExtractJwt.fromAuthHeaderAsBearerToken(),            
//     //         // secretOrKey: configService.get('JWT_SECRET')
//     //         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     //         ignoreExpiration: false,
//     //         secretOrKey: configService.getOrThrow('JWT_SECRET')
//     //     })
//     // }

//     // the validate function
//     async validate(payload) {
//         const { id } = payload;

//         // find the user by id
//         const user = await this.userModel.findById(id);

//         // if not exists
//         if(!user) {
//             throw new UnauthorizedException('Login first to access this route.');
//         }


//         return user;
//     }
// }