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
      envFilePath: '.env',
    }),
    HttpModule,

    // 📌 Connexion via URI PostgreSQL avec SSL activé
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // 📌 Utilisation de l'URI
      autoLoadEntities: true,
      synchronize: true, // 🚨 Désactiver après le premier déploiement
      ssl: {
        rejectUnauthorized: false, // 📌 🔥 Activation du SSL pour Render
      },
    }),

    AuthModule,
    UsersModule,
    MoviesModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}









