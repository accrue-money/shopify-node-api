import { ApiVersion } from '../base_types';
import { RestRequestReturn } from '../clients/rest/types';
import { GetRequestParams } from '../clients/http_client/types';
export interface IdSet {
    [id: string]: string | number | null;
}
export interface ParamSet {
    [key: string]: any;
}
export interface Body {
    [key: string]: any;
}
export interface ResourcePath {
    http_method: string;
    operation: string;
    ids: string[];
    path: string;
}
export interface BaseFindArgs {
    params?: ParamSet;
    urlIds: IdSet;
    domain: string;
    accessToken: string;
    apiVersion: ApiVersion;
}
export interface RequestArgs extends BaseFindArgs {
    http_method: string;
    operation: string;
    body?: Body | null;
    entity?: Base | null;
    apiVersion: ApiVersion;
}
export interface BaseConstructorArgs {
    fromData?: Body | null;
}
declare class Base {
    [key: string]: any;
    static NEXT_PAGE_INFO: GetRequestParams | undefined;
    static PREV_PAGE_INFO: GetRequestParams | undefined;
    protected static NAME: string;
    protected static PLURAL_NAME: string;
    protected static PRIMARY_KEY: string;
    protected static CUSTOM_PREFIX: string | null;
    protected static HAS_ONE: {
        [attribute: string]: typeof Base;
    };
    protected static HAS_MANY: {
        [attribute: string]: typeof Base;
    };
    protected static PATHS: ResourcePath[];
    protected static baseFind({ urlIds, params, domain, accessToken, apiVersion }: BaseFindArgs): Promise<Base[]>;
    protected static request({ http_method, domain, accessToken, operation, urlIds, params, body, entity, apiVersion }: RequestArgs): Promise<RestRequestReturn>;
    protected static getJsonBodyName(): string;
    private static getPath;
    private static createInstancesFromResponse;
    private static createInstance;
    constructor({ fromData }: BaseConstructorArgs);
    save(domain: string, accessToken: string, apiVersion: ApiVersion, { update }?: {
        update?: boolean | undefined;
    }): Promise<void>;
    saveAndUpdate(domain: string, accessToken: string, apiVersion: ApiVersion): Promise<void>;
    delete(domain: string, accessToken: string, apiVersion: ApiVersion): Promise<void>;
    serialize(): Body;
    protected setData(data: Body): void;
    private resource;
}
export default Base;
//# sourceMappingURL=base.d.ts.map