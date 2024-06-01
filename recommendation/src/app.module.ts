import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationModule } from './recommendation/recommendation.module';

@Module({
  imports: [RecommendationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
