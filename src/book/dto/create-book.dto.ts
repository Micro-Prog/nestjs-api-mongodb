import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString, isNotEmpty } from "class-validator"
import { Category } from "../db_schemas/book.schema"
import { User } from "../../auth/schema/user.schema"


export class CreateBookDto {

    @IsNotEmpty()
    @IsString()
    readonly title: string
    
    @IsNotEmpty()
    @IsString()
    readonly author: string

    @IsNotEmpty()
    @IsString()
    readonly description: string
    
    @IsNotEmpty()
    @IsNumber()
    readonly price: number
    
    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please enter a correct category.' })
    readonly category: Category
    
    @IsEmpty({ message: 'You cannot pass any user id.' })
    readonly user: User;

}