import http from 'http';

import {GraphqlClient} from '../clients/graphql';
import {RestClient} from '../clients/rest';

export interface WithSessionParams {
  clientType: 'rest' | 'graphql';
  isOnline: boolean;
  req?: http.IncomingMessage;
  res?: http.ServerResponse;
  shop?: string;
}

interface WithSessionBaseResponse {
}

export interface RestWithSession extends WithSessionBaseResponse {
    client: RestClient;
}

export interface GraphqlWithSession extends WithSessionBaseResponse {
  client: GraphqlClient;
}

export type WithSessionResponse = RestWithSession | GraphqlWithSession;
