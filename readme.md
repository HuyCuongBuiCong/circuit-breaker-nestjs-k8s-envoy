# Circuit Breaker Pattern
![circuit-breaker.png](img%2Fcircuit-breaker.png)

This repository contains a sample implementation of a product recommendation service that leverages a circuit breaker pattern to manage and mitigate service failures. The project is built using NestJS, with the `opossum` library for the circuit breaker.

Full article on the circuit breaker pattern [here](https://kelvinbz.medium.com/managing-overwhelmed-microservices-in-e-commerce-with-circuit-breakers-in-nestjs-5c44495f1376).
## Project Structure

The project consists of main services:
- envoy proxy
- product service
- recommendation service : This service simulates product recommendations with random failures to demonstrate the circuit breaker's functionality.

To explain the circuit breaker pattern, we will focus on the recommendation service only, which simulates product recommendations with random failures.

If you want to see the full project structure, you can clone the repository and explore the code and run in your local kubernetes cluster.

## Installation

Go to recommendation service folder and run the following commands:

1 **Install dependencies:**

   ```bash
   npm install
   ```
2 **Run the application:**

   ```bash
   npm run start
   ```

## Services

```mermaid
classDiagram
    class RecommendationService {
        +fetchRecommendations()
        +defaultRecommendations()
    }

 
    class RecommendationCircuitBreakerService {
        -circuitBreaker: CircuitBreaker
        +constructor(RecommendationService: RecommendationService, cacheManager: Cache)
        +fetchRecommendations(): Promise<any>
        -logCircuitStatus(status: string): void
    }

    class CircuitBreaker {
        +fire(): Promise<any>
        +fallback(fallbackFunction: Function): void
        +on(event: string, callback: Function): void
        +stats: object
    }

    RecommendationCircuitBreakerService --> RecommendationService: uses
 
    RecommendationCircuitBreakerService --> CircuitBreaker: contains
```

### RecommendationService

This service simulates product recommendations with random failures to demonstrate the circuit breaker's functionality.

```typescript
// recommendation.service.ts
import {Inject, Injectable} from '@nestjs/common';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";

@Injectable()
export class RecommendationService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    async fetchRecommendations() {
        const requestCount = await this.cacheManager.get<number>('requestCount') || 0;
        const mod = requestCount % 20;
        if (mod >= 5 && mod <= 11) {
            // Simulate random service issues
            throw new Error('Service not available');
        } else {
            // Simulate get recommendations from an external service
            return [{id: 1, name: 'Product 1'}, {id: 2, name: 'Product 2'}];
        }
    }

    async defaultRecommendations() {
        const requestCount = await this.cacheManager.get<number>('requestCount') || 0;
        return [{id: 1, name: 'Default Product 1'}, {id: 2, name: 'Default Product 2'}];
    }
}


```

### RecommendationCircuitBreakerService

This service wraps `ProductRecommendationService` with a circuit breaker to manage failures and fallback mechanisms.

```typescript
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

```

## Running Tests

To test the circuit breaker, you can use the following script to simulate 20 requests, each 1 second apart:

```javascript
// test-circuit-breaker.js
const axios = require('axios');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const makeRequest = async () => {
    for (let i = 1; i <= 20; i++) {
        console.log(`Making request ${i}`);
        const response = await axios.get('http://localhost:3000/recommendation');
        await sleep(1000);
        console.log(response.data);
    }
}

makeRequest();
```

Run test

```
npm run test
```

### Test Results
Log from the test-circuit-breaker.js

```bash
Making request 1
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 2
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 3
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 4
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 5
[
  { id: 1, name: 'Default Product 1' },
  { id: 2, name: 'Default Product 2' }
]
Making request 6
[
  { id: 1, name: 'Default Product 1' },
  { id: 2, name: 'Default Product 2' }
]
Making request 7
[
  { id: 1, name: 'Default Product 1' },
  { id: 2, name: 'Default Product 2' }
]
Making request 8
[
  { id: 1, name: 'Default Product 1' },
  { id: 2, name: 'Default Product 2' }
]
Making request 9
[
  { id: 1, name: 'Default Product 1' },
  { id: 2, name: 'Default Product 2' }
]
Making request 10
[
  { id: 1, name: 'Default Product 1' },
  { id: 2, name: 'Default Product 2' }
]
Making request 11
[
  { id: 1, name: 'Default Product 1' },
  { id: 2, name: 'Default Product 2' }
]
Making request 12
[
  { id: 1, name: 'Default Product 1' },
  { id: 2, name: 'Default Product 2' }
]
Making request 13
[
  { id: 1, name: 'Default Product 1' },
  { id: 2, name: 'Default Product 2' }
]
Making request 14
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 15
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 16
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 17
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 18
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 19
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
Making request 20
[ { id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' } ]
```

Log rerutlt from ```ProductRecommendationCircuitBreakerService```


### Observations

- **Closed State:** The circuit breaker allows requests through until failures exceed the error threshold.
- **Open State:** After reaching the error threshold, the circuit breaker opens and uses fallback responses.
- **Half-Open State:** After a reset timeout, the circuit breaker tests the service with a few requests.
- **Closed State:** If the service responds successfully during the half-open state, the circuit breaker closes and resumes normal operation.

## Conclusion

The circuit breaker implementation enhances the robustness and reliability of the product recommendation service. It provides a resilient system capable of handling intermittent failures gracefully, ensuring continuous service availability and a better user experience.

For more details, refer to the article on the circuit breaker pattern [here](https://kelvinbz.medium.com/managing-overwhelmed-microservices-in-e-commerce-with-circuit-breakers-in-nestjs-5c44495f1376).

