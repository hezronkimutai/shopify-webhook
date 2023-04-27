import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import * as Shopify from 'shopify-api-node';
// import * as sgMail from '@sendgrid/mail';
import { OrdersService } from './orders.service';
// import { MailerService } from '@nestjs-modules/mailer';
import { mailer } from './order.mailer';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    // private readonly mailerService: MailerService
  ) { }

  @Post('webhook')
  async handleWebhook(@Req() request: Request) {
    const { SHOPIFY_SHOP_NAME,
      SHOPIFY_API_KEY,
      SHOPIFY_PASSWORD,
      SHOPIFY_API_VERSION } = process.env

    const shopify = new Shopify({
      shopName: SHOPIFY_SHOP_NAME,
      apiKey: SHOPIFY_API_KEY,
      password: SHOPIFY_PASSWORD,
      apiVersion: SHOPIFY_API_VERSION,
      autoLimit: { calls: 2, interval: 1000, bucketSize: 35 }
    });
    // console.log(request.body);

    // console.log(request.header);
    const topic = request.header('X-Shopify-Topic');
    const orderId = request.body.id;
    console.log({ topic, orderId });
    if (topic === 'orders/create') {
      const order = await shopify.order.get(orderId, { fields: ['number', 'line_items', 'fulfillment_status'] });
      console.log("====================>", { order });

      await this.ordersService.createOrder(order);
      console.log("====================>", { order });

      const productName = 'ProductA';

      const orders = await this.ordersService.findOrdersByProduct(productName);
      console.log("====================>", { order });

      if (orders.length > 0) {
        await mailer();
      }
    }

    if (topic === 'orders/fulfilled') {
      const order = await shopify.order.get(orderId, { fields: ['number', 'fulfillment_status'] });
      await this.ordersService.updateOrder(order);
      console.log({ order });
      const productName = 'ProductA';
      const orders = await this.ordersService.findOrdersByProduct(productName);
      if (orders.length > 0) {
        const updatedOrder = await shopify.order.update(orderId, { note: 'Custom note' });
        console.log(`Order ${updatedOrder.number} updated!`);
      }
    }
    await mailer();

    return "Sent";
  }
}
