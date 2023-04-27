import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  orderNumber: string;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @Column()
  fulfillmentStatus: string;
}
