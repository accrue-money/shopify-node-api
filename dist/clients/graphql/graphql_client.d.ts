import { ApiVersion } from '../../base_types';
import { RequestReturn } from '../http_client/types';
import { GraphqlParams } from './types';
export interface AccessTokenHeader {
    header: string;
    value: string;
}
export declare class GraphqlClient {
    readonly apiVersion: ApiVersion;
    readonly domain: string;
    readonly accessToken: string;
    protected baseApiPath: string;
    private readonly client;
    constructor(apiVersion: ApiVersion, domain: string, accessToken: string);
    query(params: GraphqlParams): Promise<RequestReturn>;
    protected getAccessTokenHeader(): AccessTokenHeader;
}
//# sourceMappingURL=graphql_client.d.ts.map