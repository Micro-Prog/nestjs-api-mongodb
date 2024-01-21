import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from './auth_dto/signup.dto';
import { LoginUserDto } from './auth_dto/login.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    
    async signUp(signUpDto: SignUpUserDto): Promise<{ token: string }> {

        // define the name, email, and password
        const { name, email, password } = signUpDto;

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create the user
        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // sign the token
        const token = this.jwtService.sign({ id: user._id });

        return { token };

    }

    async login(loginDto: LoginUserDto): Promise<{ token: string }> {

        // get the email and password
        const { email, password } = loginDto;

        // search the user
        const user = await this.userModel.findOne({ email });

        // if not user
        if(!user) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        // compare the password if the user exists
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // if password not correct
        if(!isPasswordCorrect) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        // if password correct define the token
        const token = this.jwtService.sign({ id: user._id });

        return { token };
        


    }
}
