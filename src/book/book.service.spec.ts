import { Test, TestingModule } from "@nestjs/testing"
import { BookService } from "./book.service"
import { MongooseModule, getModelToken } from "@nestjs/mongoose"
import { Book, Category } from "./db_schemas/book.schema";
import { Model } from "mongoose";
import { BookController } from "./book.controller";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "../auth/auth.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { BookModule } from "./book.module";
import { inspect } from "util";
import { AuthService } from '../auth/auth.service'
import { AuthController } from "../auth/auth.controller";
import * as mongoose from 'mongoose';
import { AppModule } from "../app.module";
import { BadRequestException, INestApplication, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { User } from "../auth/schema/user.schema";
import supertest from "supertest";
import { send } from "process";


describe('BookService', () => {

    let bookService: BookService;
    let authService: AuthService;
    let jwtService: JwtService;
    let model: Model<Book>;
    let modelAuth: Model<User>;

    const mockBookService = {
        create: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    const mockAuthService = {
        create: jest.fn(),
        findOne: jest.fn(),
    }

    const mockBook = 
    {
        "_id": "65ae1e51191e252aa1501032",
        "title": "title one",
        "description": "description one",
        "author": "author one",
        "price": 120,
        "category": "Adventure",
        "user": "65ae1e45191e252aa150102f",
    }

    const mockBookForCreate = 
    {
        "title": "title one",
        "description": "description one",
        "author": "author one",
        "price": 120,
        "category": "Adventure",
    }

    const mockUser = 
    {
        "name": "sajjad",
        "email": "sss@gmail.com",
        "password": "123455"
    }


    let token = '';

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule, AuthModule, BookModule],
            providers: [
                BookService,
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookService,
                },
                AuthService,
                JwtService, 
                {
                    provide: getModelToken(User.name),
                    useValue: mockAuthService,
                },
            ],
            controllers: [BookController]
        }).compile();

        bookService = module.get<BookService>(BookService);
        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        model = module.get<Model<Book>>(getModelToken(Book.name));
        modelAuth = module.get<Model<User>>(getModelToken(User.name));

    });



    /// ***** start the testing process ***** ///

    // *** findAll tests *** // 
    describe('findAll', () => {

        // *** check if it returns an array of books *** //
        it('should return an array of books', async () => {

            // define a fake object
            const query = { page: "1", keyword: "test" }

            // jest spyon the find method
            jest.spyOn(model, 'find').mockImplementation(
                () => 
                ({
                    limit: () => ({
                        skip: jest.fn().mockResolvedValue([mockBook]),
                    }),
                } as any),
            );

            // define the result
            const result = await bookService.findAll(query);
            
            // to have been called with
            expect(model.find).toHaveBeenCalledWith({
                title: {
                    $regex: 'test',
                    $options: 'i',
                }
            });

            // expect the result
            expect(result).toEqual([mockBook]);



        });
    
    
    });

    // *** findById tests *** //
    describe('findById', () => { 

        // *** find by id mock *** //
        it('should find and return a book by ID', async () => {

            // jest spy on the findById method
            jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

            // define the result
            const result = await bookService.findById(mockBook._id);

            // expect the returned
            expect(model.findById).toHaveBeenCalledWith(mockBook._id);
            expect(result).toEqual(mockBook);

        });

        // *** invalid passed id mock for BadRequestException *** //
        it('should throw BadRequestException if invalid ID is protected', async () => {
            // define an invalid mongodb object id
            const id = 'invalid-id';

            // mock the invalid function
            const isValidObjectIDMock = jest
                .spyOn(mongoose, 'isValidObjectId')
                .mockReturnValue(false);
            
                // expect BadRequestException
                await expect(bookService.findById(id)).rejects.toThrow(BadRequestException);

                // implement the incorrect id
                expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
                isValidObjectIDMock.mockRestore();
            });

            // *** mock for NotFoundException ***//
            it('should throw NotFoundException if the book is not found', async () => {
                
                jest.spyOn(model, 'findById').mockResolvedValue(null);

                await expect(bookService.findById(mockBook._id)).rejects.toThrow(
                    NotFoundException,
                );

                expect(model.findById).toHaveBeenCalledWith(mockBook._id);

            });
     });

    //  *** create book tests *** //
    describe('create', () => {

        // create a book test
        it('should create a book', async () => {
            
            // define a new book to be created
            const newBook = {
                title: 'New Book',
                description: 'Book Description',
                author: 'Author',
                price: 123,
                category: Category.ADVENTURE,
            }

            // spy on the create method
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockBook as any));

            // check the result
            const result = await bookService.create(
                newBook as CreateBookDto,
                mockUser as User,
            );

            expect(result).toEqual(mockBook)
            
        });


    });

    // *** update book tests *** //
    describe('updateById', () => {  

        // *** update by id test *** //
        it('should update a book', async () => {

            // define updated books
            const updatedBook = { ...mockBook, title: 'Updated name' };
            const book = { title: 'Updated name' };
            
            // spy on the method
            jest
            .spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook);

            // expect the results
            const result = await bookService.updateById(mockBook._id, book as any);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book, {
                new: true,
                runValidators: true,
            });

             expect(result.title).toEqual(book.title);
            
        })
            
            
            

     });



})