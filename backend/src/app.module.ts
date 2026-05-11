import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionsModule } from './interactions/interactions.module';
import { EmailModule } from './email/email.module';
import { Interaction } from './interactions/interaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'phishing',
      password: process.env.DB_PASS || 'phishing',
      database: process.env.DB_NAME || 'phishing_sim',
      entities: [Interaction],
      synchronize: true,
    }),
    InteractionsModule,
    EmailModule,
  ],
})
export class AppModule {}
