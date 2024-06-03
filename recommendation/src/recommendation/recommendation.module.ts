import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RecommendationCircuitBreakerService } from './recommendation-circuit-breaker.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 1000000,
    }),
  ],
  providers: [RecommendationService, RecommendationCircuitBreakerService],
  controllers: [RecommendationController],
  exports: [RecommendationService],
})
export class RecommendationModule {}
