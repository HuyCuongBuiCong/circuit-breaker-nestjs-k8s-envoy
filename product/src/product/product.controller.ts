import {Controller, Get} from '@nestjs/common';
import {ProductService} from "./product.service";
import {RecommendationService} from "./recommendation.service";

@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService,
        private recommendationService: RecommendationService,
    ) {}

    @Get('recommendation')
    getProductRecommendation() {
        return this.recommendationService.getRecommendations();
    }
    @Get()
    getOrder() {
        return this.productService.getProducts();
    }


}
