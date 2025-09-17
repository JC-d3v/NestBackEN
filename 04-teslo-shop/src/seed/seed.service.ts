import { Product } from './../products/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ) { }


  async runSeed() {

    await this.insertNewProducts()

    return "SEED EXECUTED"

  }


  private async insertNewProducts() {
    await this.productsService.deleteAllProducts()

    const products = initialData.products;

    // for (const product of products) {
    //   await this.productsService.create(product)
    // }

    return true;
  }
}
