import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
    getProducts(): string {
        return 'Hello product Service';
    }
}
