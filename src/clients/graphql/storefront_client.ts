import {ShopifyHeader} from '../../base_types';

import {GraphqlClient, AccessTokenHeader} from './graphql_client';

export class StorefrontClient extends GraphqlClient {
  protected baseApiPath = '/api';

  //needs refactor
  protected getAccessTokenHeader(): AccessTokenHeader {
    return {
      header: ShopifyHeader.StorefrontAccessToken,
      value: this.accessToken,
    };
  }
}
