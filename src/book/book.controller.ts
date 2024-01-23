import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './db_schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { ObjectId } from 'mongoose';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard, PassportModule } from '@nestjs/passport';


@Controller('books')
export class BookController {
    constructor(private bookService: BookService) {}


    @Get()
    async getAllBooks(
        @Query() query: ExpressQuery,
    ): Promise<Book[]> {
        return this.bookService.findAll(query);
    }

    @Get(':id')
    async getBookById(
        @Param('id') id: string,
    ): Promise<Book> {
        return this.bookService.findById(id);
    }

    @Post('create')
    @UseGuards(AuthGuard())    
    async createBook(
        @Body() book: CreateBookDto,
        @Req() req,
    ): Promise<Book> {
        return this.bookService.create(book, req.user);
    }

    @Put(':id')
    async updateBook(
        @Param('id') id: string,
        @Body() book: UpdateBookDto,
    ): Promise<Book> {
        return this.bookService.updateById(id, book);
    }

    @Delete(':id')
    async deleteBookById(
        @Param('id') id: string,
    ): Promise<Book> {
        return this.bookService.deleteBookById(id);
    }

}
