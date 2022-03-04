import Base, { ResourcePath } from '../base';
import { ApiVersion } from '../../base_types';
interface FakeResourceWithCustomPrefixFindArgs {
    id: string | number;
    domain: string;
    accessToken: string;
    apiVersion: ApiVersion;
}
export default class FakeResourceWithCustomPrefix extends Base {
    protected static NAME: string;
    protected static PLURAL_NAME: string;
    protected static CUSTOM_PREFIX: string;
    protected static HAS_ONE: {};
    protected static HAS_MANY: {};
    protected static PATHS: ResourcePath[];
    static find: ({ id, domain, accessToken, apiVersion }: FakeResourceWithCustomPrefixFindArgs) => Promise<FakeResourceWithCustomPrefix | null>;
    id?: number | string | null;
    attribute?: string | null;
}
export {};
//# sourceMappingURL=fake_resource_with_custom_prefix.d.ts.map