import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopifyModule } from './shopify/order.module';
// import { Order2Module } from './order2/order2.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Order } from './shopify/order.entity';
import { Product } from './shopify/product.entity';

@Module({
  imports: [ShopifyModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'mydatabase',
      entities: [Order,Product],
      synchronize: true,
    }), TypeOrmModule.forFeature([Order, Product]),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
