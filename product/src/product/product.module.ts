import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {RecommendationService} from "./recommendation.service";

@Module({
  providers: [ProductService, RecommendationService],
  controllers: [ProductController]
})
export class ProductModule {}
