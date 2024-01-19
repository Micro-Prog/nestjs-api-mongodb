import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './db_schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { ObjectId } from 'mongoose';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService) {}


    @Get()
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.findAll();
    }

    @Get(':id')
    async getBookById(
        @Param('id') id: string,
    ): Promise<Book> {
        return this.bookService.findBookById(id);
    }

    @Post('create')
    async createBook(
        @Body() book: CreateBookDto,
    ): Promise<Book> {
        return this.bookService.create(book);
    }

    @Put(':id')
    async updateBook(
        @Param('id') id: string,
        @Body() book: UpdateBookDto,
    ): Promise<Book> {
        return this.bookService.updateBookById(id, book);
    }

    @Delete(':id')
    async deleteBookById(
        @Param('id') id: string,
    ): Promise<Book> {
        return this.bookService.deleteBookById(id);
    }

}
