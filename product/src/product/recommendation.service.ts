// recommendation.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecommendationService {
    async getRecommendations() {
        try {
            const response = await axios.get(`http://recommendation/product-recommendation`);
            return {
                data: response.data,
                status: response.status
            };
        } catch (error) {
            console.error(`Error fetching recommendations: ${error.message}`);
        }

    }
}
