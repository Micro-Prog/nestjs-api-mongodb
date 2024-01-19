import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './db_schemas/book.schema';
import { ObjectId } from 'mongoose';


@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async findAll(): Promise<Book[]> {
        const books = await this.bookModel.find();
        return books;
    }

    async findBookById(id: string): Promise<Book> {
        
        // convert the string id to objectid
        const newID = new mongoose.Types.ObjectId(id);

        const book = await this.bookModel.findById(newID);

        // if not found
        if(!book) {
            throw new NotFoundException('there is no book with this id.')
        }

        return book;
    }

    async create(book: Book): Promise<Book> {
        const res = await this.bookModel.create(book);
        return res;
    }

    async updateBookById(id: string, book: Book): Promise<Book> {

        // convert the id to objectid
        const newID = new mongoose.Types.ObjectId(id);

        return await this.bookModel.findByIdAndUpdate(newID, book, {
            new: true,
            runValidators: true,
        })
    }

    async deleteBookById(id: string): Promise<Book> {

        // convert the id to objectid
        const newID = new mongoose.Types.ObjectId(id);

        return await this.bookModel.findByIdAndDelete(newID)
    }
}
