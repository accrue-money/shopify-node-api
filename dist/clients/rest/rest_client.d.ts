import { ApiVersion } from '../../base_types';
import { HttpClient } from '../http_client/http_client';
import { RequestParams } from '../http_client/types';
import { RestRequestReturn } from './types';
declare class RestClient extends HttpClient {
    readonly apiVersion: ApiVersion;
    readonly accessToken: string;
    private static LINK_HEADER_REGEXP;
    private static DEFAULT_LIMIT;
    constructor(apiVersion: ApiVersion, domain: string, accessToken: string);
    protected request(params: RequestParams): Promise<RestRequestReturn>;
    protected getRequestPath(path: string): string;
    private buildRequestParams;
}
export { RestClient };
//# sourceMappingURL=rest_client.d.ts.map