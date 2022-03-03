import {MissingRequiredArgument} from '../../error';
import {ShopifyHeader, ApiVersion} from '../../base_types';
import {HttpClient} from '../http_client/http_client';
import {DataType, RequestReturn} from '../http_client/types';

import {GraphqlParams} from './types';

export interface AccessTokenHeader {
  header: string;
  value: string;
}

export class GraphqlClient {
  protected baseApiPath = '/admin/api';

  private readonly client: HttpClient;

  constructor(readonly apiVersion: ApiVersion, readonly domain: string, readonly accessToken: string) {
    this.client = new HttpClient(this.domain);
  }

  async query(params: GraphqlParams): Promise<RequestReturn> {
    if (params.data.length === 0) {
      throw new MissingRequiredArgument('Query missing.');
    }

    const accessTokenHeader = this.getAccessTokenHeader();
    params.extraHeaders = {
      [accessTokenHeader.header]: accessTokenHeader.value,
      ...params.extraHeaders,
    };

    const path = `${this.baseApiPath}/${this.apiVersion}/graphql.json`;

    let dataType: DataType.GraphQL | DataType.JSON;

    if (typeof params.data === 'object') {
      dataType = DataType.JSON;
    } else {
      dataType = DataType.GraphQL;
    }

    return this.client.post({path, type: dataType, ...params});
  }

  protected getAccessTokenHeader(): AccessTokenHeader {
    return {
      header: ShopifyHeader.AccessToken,
      value: this.accessToken,
    };
  }
}
