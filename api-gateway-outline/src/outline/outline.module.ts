import { Module } from '@nestjs/common';
import { OutlineController } from './outline.controller';
import { OutlineService } from './outline.service';
import { AccountModel } from './model/account.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: AccountModel,
        schemaOptions: {
          collection: 'account',
        },
      },
    ]),
    ConfigModule
  ],
  controllers: [OutlineController],
  providers: [OutlineService]
})
export class OutlineModule { }
