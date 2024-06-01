import {Controller, Get, Inject} from '@nestjs/common';
import {RecommendationCircuitBreakerService} from "./recommendation-circuit-breaker.service";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";

@Controller('recommendation')
export class RecommendationController {
    constructor(private readonly productRecommendationCircuitBreakerService: RecommendationCircuitBreakerService,
                @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    @Get()
    async getProductRecommendation() {
        try {
            let requestCount = await this.cacheManager.get<number>('requestCount') || 0;
            requestCount++;
            await this.cacheManager.set('requestCount', requestCount);
            console.log(`Request count: ${requestCount}`);
            const recommendations = await this.productRecommendationCircuitBreakerService.fetchProductRecommendations();
            return recommendations;
        } catch (error) {
            return {message: 'Recommendations service is currently unavailable. Please try again later.'};
        }
    }
}
