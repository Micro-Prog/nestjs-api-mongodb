import { IsEnum, IsNotEmpty, IsNumber, IsString, isNotEmpty } from "class-validator"
import { Category } from "../db_schemas/book.schema"


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
    
}