import Router, { RouterContext } from '@koa/router';
import { IGetAllProductsDTO } from './dtos/get_all_products';
import { shopName } from './utils/shopify_config';

export class shopifyController {
  static async getAllProducts(ctx: RouterContext) {
    const apiUrl = `https://${shopName}.myshopify.com/admin/api/2023-07/products.json?status=active`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_PK!,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data: any = await response.json();
      const products = data.products;
      ctx.status = 201;
      ctx.body = { products: products };
    } catch (e: any) {
      ctx.status = 500;
      ctx.body = { message: e.message };
      console.error('Error fetching products:', e.message);
    }
  }
}
