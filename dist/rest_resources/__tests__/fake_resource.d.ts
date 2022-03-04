import Base, { ParamSet, ResourcePath } from '../base';
import { ApiVersion } from '../../base_types';
interface FakeResourceFindArgs {
    params?: ParamSet;
    id: number;
    other_resource_id?: number | null;
    domain: string;
    accessToken: string;
    apiVersion: ApiVersion;
}
interface FakeResourceAllArgs {
    params?: ParamSet;
    domain: string;
    accessToken: string;
    apiVersion: ApiVersion;
}
interface FakeResourceCustomArgs {
    id: number;
    other_resource_id: number;
    domain: string;
    accessToken: string;
    apiVersion: ApiVersion;
}
export default class FakeResource extends Base {
    protected static NAME: string;
    protected static PLURAL_NAME: string;
    protected static HAS_ONE: {
        has_one_attribute: typeof FakeResource;
    };
    protected static HAS_MANY: {
        has_many_attribute: typeof FakeResource;
    };
    protected static PATHS: ResourcePath[];
    static find: ({ domain, accessToken, apiVersion, params, id, other_resource_id, ...otherArgs }: FakeResourceFindArgs) => Promise<FakeResource | null>;
    static all: ({ domain, accessToken, apiVersion, params, }: FakeResourceAllArgs) => Promise<FakeResource[]>;
    static custom: ({ id, other_resource_id, domain, accessToken, apiVersion }: FakeResourceCustomArgs) => Promise<Body>;
    id?: number | string | null;
    attribute?: string | null;
    has_one_attribute?: FakeResource | null;
    has_many_attribute?: FakeResource[] | null;
    other_resource_id?: number | null;
}
export {};
//# sourceMappingURL=fake_resource.d.ts.map