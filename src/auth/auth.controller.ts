import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './auth_dto/signup.dto';
import { LoginUserDto } from './auth_dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
     ) {}


     @Post('/signup')
     signup(@Body() signUpDto: SignUpUserDto): Promise<{ token: string }> {
        return this.authService.signUp(signUpDto);
     }

     @Get('/signin')
     signin(@Body() loginDto: LoginUserDto): Promise<{ token: string }> {
        return this.authService.login(loginDto);
     }

}
