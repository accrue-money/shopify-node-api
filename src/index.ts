import * as ShopifyErrors from './error';
import ShopifyClients from './clients';
import ShopifyUtils from './utils';

export const Shopify = {
  Clients: ShopifyClients,
  Utils: ShopifyUtils,
  Errors: ShopifyErrors,
};

export default Shopify;
export * from './types';
