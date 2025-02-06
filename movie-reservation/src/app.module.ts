import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';  
import { HttpModule } from '@nestjs/axios';     
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,  
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.PG_PASSWORD || '123RACHID-laila',
      database: 'movie_reservation',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule, 
    UsersModule, 
    MoviesModule, ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}




