import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { Category } from "../db_schemas/book.schema"
import { User } from "../../auth/schema/user.schema"


export class UpdateBookDto {

    @IsOptional()
    @IsString()
    readonly title: string

    @IsOptional()
    @IsString()
    readonly description: string

    @IsOptional()
    @IsString()
    readonly author: string

    @IsOptional()
    @IsNumber()
    readonly price: number

    @IsOptional()
    @IsEnum(Category, { message: 'Please enter a correct category.' })
    readonly category: Category

    @IsEmpty({ message: 'You cannot pass any user id.' })
    readonly user: User;

    
}