import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './db_schemas/book.schema';
import { ObjectId } from 'mongoose';
import { Query } from 'express-serve-static-core';


@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async findAll(query: Query): Promise<Book[]> {
        
        // the number of results for each page
        const resultsPerPage = 2;

        // the current page number
        const currentPage = Number(query.page) || 1;

        // the number of results to skip
        const skip = resultsPerPage * (currentPage - 1);

        // extract the keyword from the query
        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i',
            }
        } : {}

        const books = await this.bookModel
            .find({ ...keyword })
            .limit(resultsPerPage)
            .skip(skip);
        return books;
    }

    async findBookById(id: string): Promise<Book> {
        
        // chech if the passed id is a correct mongodb objectid
        const isValidID = mongoose.isValidObjectId(id);

        // throw an exception if the id is not correct
        if(!isValidID) {
            throw new BadRequestException("Please enter a correct id.")
        }

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
