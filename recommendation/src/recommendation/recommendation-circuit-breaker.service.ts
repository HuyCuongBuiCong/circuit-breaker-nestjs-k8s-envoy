import { Injectable } from '@nestjs/common';
import * as opossum from 'opossum';
import { RecommendationService } from './recommendation.service';

@Injectable()
export class RecommendationCircuitBreakerService {
    private circuitBreaker: opossum.CircuitBreaker;

    constructor(
        private readonly recommendationService: RecommendationService
    ) {
        this.circuitBreaker = new opossum(
            this.recommendationService.fetchRecommendations.bind(this.recommendationService),
            {
                timeout: 3000,
                errorThresholdPercentage: 50,
                resetTimeout: 5000,
            }
        );

        this.circuitBreaker.fallback(() => this.recommendationService.defaultRecommendations());
        this.circuitBreaker.on('open', () => this.logCircuitStatus('open'));
        this.circuitBreaker.on('halfOpen', () => this.logCircuitStatus('half open'));
        this.circuitBreaker.on('close', () => this.logCircuitStatus('closed'));
    }

    async fetchProductRecommendations() {
        try {
            return await this.circuitBreaker.fire();
        } catch (error) {
            console.error('Error fetching product recommendations:', error);
            return { status: 'Unavailable due to service issues' };
        }
    }

    private logCircuitStatus(status: string) {
        console.log(`Circuit breaker is ${status}`);
        console.log(`Circuit breaker stats: ${JSON.stringify(this.circuitBreaker.stats)}`);
    }
}
