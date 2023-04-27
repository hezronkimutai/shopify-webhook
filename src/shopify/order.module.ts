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
    

  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'mydatabase',
    entities: [Order,Product],
    synchronize: true,
  }),TypeOrmModule.forFeature([Order,Product])],
  exports: [OrdersService, TypeOrmModule.forFeature([Order,Product])],

  providers: [OrdersService],
  controllers: [OrdersController],
  // exports: [OrdersService]
})
export class ShopifyModule {
  // @InjectRepository(Order)

  // private readonly orderRepository: Repository<Order>
}

  // imports: [ItemsModule]
