import { Injectable, Inject } from '@nestjs/common';
import { Client } from 'pg';

import { v4 } from 'uuid';

import { Cart } from '../models';


@Injectable()
export class CartService {
  constructor (
    @Inject('PG') private clientPg: Client,
  ) {}
  private userCarts: Record<string, Cart> = {};
  private cartId = 'e74a8ba4-2df1-47a2-902c-6028def741d1';

  async findByUserId(userId: string): Promise<Cart> {
  try {
      const result = await this.clientPg
      .query(`select product_id, count from cart_items where cart_id = '${this.cartId}';`);

      return {
        id: this.cartId,
        items: result.rows
      };
    }catch(err) {
      console.log('findByUserId err -->', err)
      this.clientPg.end(); 
    }
  }

  createByUserId(userId: string) {
    const id = v4(v4());
    const userCart = {
      id,
      items: [],
    };

    this.userCarts[ userId ] = userCart;

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const values = items
      .map(item => {
        return `('${this.cartId}', ${item.count})`;
      })
      .join(', ');

    console.log(values)

    this.clientPg.query(`insert into cart_items (cart_id, count) values ${values}`)

    return this.findOrCreateByUserId(userId);;
  }

  async removeByUserId(): Promise<void> {
    try{
      this.clientPg.query(`delete from cart_items where cart_id = '${this.cartId}'`);
    }catch(err){
      console.log(`There was an error trying to remove cart items ${err}`);
      this.clientPg.end()
    }
  }

}
