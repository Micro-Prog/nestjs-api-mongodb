import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class SignUpUserDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter a correct email.' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password should be at least 6 chars.' })
    readonly password: string;
}