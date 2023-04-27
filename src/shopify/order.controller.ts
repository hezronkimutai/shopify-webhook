import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import * as Shopify from 'shopify-api-node';
import * as sgMail from '@sendgrid/mail';
import { OrdersService } from './orders.service';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService,
  private readonly mailerService: MailerService)  {}

  @Post('webhook')
  async handleWebhook(@Req() request: Request) {
    const shopify = new Shopify({
      shopName: process.env.SHOP_NAME,
      apiKey: process.env.API_KEY,
      password: process.env.PASSWORD,
      apiVersion: '2021-04',
      autoLimit: { calls: 2, interval: 1000, bucketSize: 35 }
    });

    const topic = request.header('X-Shopify-Topic');
    const orderId = request.body.id;

    if (topic === 'orders/create') {
      const order = await shopify.order.get(orderId, { fields: ['number', 'line_items', 'fulfillment_status'] });
      await this.ordersService.createOrder(order);

      const productName = 'Product A';
      const orders = await this.ordersService.findOrdersByProduct(productName);
      if (orders.length > 0) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: 'john.doe@example.com',
          from: 'orders@example.com',
          subject: `New order for ${productName}!`,
          html: `Order number ${order.number} contains ${productName}.<br />`,
        };
        await sgMail.send(msg);
      }
    }

    if (topic === 'orders/fulfilled') {
      const order = await shopify.order.get(orderId, { fields: ['number', 'fulfillment_status'] });
      await this.ordersService.updateOrder(order);

      const productName = 'Product B';
      const orders = await this.ordersService.findOrdersByProduct(productName);
      if (orders.length > 0) {
        const updatedOrder = await shopify.order.update(orderId, { note: 'Custom note' });
        console.log(`Order ${updatedOrder.number} updated!`);
      }
    }
  }
}
