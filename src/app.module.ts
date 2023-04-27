import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopifyModule } from './shopify/order.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Order } from './shopify/order.entity';
import { Product } from './shopify/product.entity';

@Module({
  imports: [ShopifyModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: 5432,
      username: process.env.USERNAME || 'postgres',
      password: process.env.PASSWORD || 'postgres',
      database: process.env.DATABASE,
      entities: [Order, Product],
      synchronize: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
