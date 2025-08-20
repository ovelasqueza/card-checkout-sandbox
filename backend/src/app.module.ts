import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../ormconfig';
import { UsersModule } from './users/users.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...ormconfig.options,
      }),
    }),
    UsersModule,
    PresentationModule,
  ],
})
export class AppModule { }
