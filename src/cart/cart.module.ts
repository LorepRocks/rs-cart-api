import { Module } from '@nestjs/common';
import { Client } from 'pg';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { DB }  from '../dbConstants';


const client = new Client({
  user: DB.DB_USER,
  host: DB.DB_HOST,
  database: DB.DB_NAME,
  password: DB.DB_PASSWORD,
  port: DB.DB_PORT
});

client.connect();

@Module({
  imports: [ OrderModule ],
  providers: [ 
    CartService,  
    {
      provide: 'PG',
      useValue: client,
    }, 
  ],
  controllers: [ CartController ],
  exports: ['PG']
})
export class CartModule {}
