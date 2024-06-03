import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RecommendationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async fetchRecommendations() {
    const requestCount =
      (await this.cacheManager.get<number>('requestCount')) || 0;
    const mod = requestCount % 20;
    if (mod >= 5 && mod <= 11) {
      // Simulate random service issues
      throw new Error('Service not available');
    } else {
      // Simulate get recommendations from an external service
      return [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
    }
  }

  async defaultRecommendations() {
    return [
      { id: 1, name: 'Default Product 1' },
      { id: 2, name: 'Default Product 2' },
    ];
  }
}
