import { Module, forwardRef } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from './db_schemas/book.schema';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    PassportModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])
  ],
  controllers: [BookController],
  providers: [BookService]
})

export class BookModule {}
