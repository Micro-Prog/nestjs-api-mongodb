import { Category } from "../db_schemas/book.schema"


export class CreateBookDto {
    readonly title: string
    readonly author: string
    readonly description: string
    readonly price: number
    readonly category: Category
}   