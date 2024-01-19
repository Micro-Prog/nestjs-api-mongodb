import { Category } from "../db_schemas/book.schema"


export class UpdateBookDto {
    readonly title: string
    readonly description: string
    readonly author: string
    readonly price: number
    readonly category: Category
}