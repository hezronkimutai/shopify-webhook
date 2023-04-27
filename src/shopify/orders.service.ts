import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(order: any) {
    const newOrder = new Order();
    newOrder.orderId = order.id;
    newOrder.orderNumber = order.number;
    newOrder.products = order.line_items.map((item) => item.product_id);
    newOrder.fulfillmentStatus = order.fulfillment_status;
    await this.orderRepository.save(newOrder);
  }

  async updateOrder(order: any) {
    const updatedOrder = await this.orderRepository.findOne(order);
    if(updatedOrder) {
      updatedOrder.fulfillmentStatus = order.fulfillment_status;
    await this.orderRepository.save(updatedOrder);
    }
  }

  async findOrdersByProduct(productName: string): Promise<Order[]> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.products', 'product')
      .where('product.name = :productName', { productName })
      .getMany();
  }
}
