import { Module } from '@nestjs/common';

import { OrdersController } from './order.controller';
// import { OrderRepository } from './order.repository';
import { OrdersService } from "./orders.service"
import { Order } from './order.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
// import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order,Product])],
  exports: [OrdersService],

  providers: [OrdersService],
  controllers: [OrdersController],
})
export class ShopifyModule {
}

