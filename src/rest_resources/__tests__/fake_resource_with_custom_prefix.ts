import Base, {ResourcePath} from '../base';
import {ApiVersion} from '../../base_types';

interface FakeResourceWithCustomPrefixFindArgs {
  id: string | number;
  domain: string;
  accessToken: string;
  apiVersion: ApiVersion;
}

export default class FakeResourceWithCustomPrefix extends Base {
  protected static NAME = 'fake_resource_with_custom_prefix';
  protected static PLURAL_NAME = 'fake_resource_with_custom_prefixes';
  protected static CUSTOM_PREFIX = '/admin/custom_prefix';

  protected static HAS_ONE = {};
  protected static HAS_MANY = {};

  protected static PATHS: ResourcePath[] = [
    {
      http_method: 'get',
      operation: 'get',
      ids: ['id'],
      path: 'fake_resource_with_custom_prefix/<id>.json',
    },
  ];

  public static find = async ({
    id,
    domain,
    accessToken,
    apiVersion
  }: FakeResourceWithCustomPrefixFindArgs): Promise<FakeResourceWithCustomPrefix | null> => {
    const result = await FakeResourceWithCustomPrefix.baseFind({
      domain,
      accessToken,
      apiVersion,
      urlIds: {id},
    });
    return result ? (result[0] as FakeResourceWithCustomPrefix) : null;
  };

  id?: number | string | null;
  attribute?: string | null;
}
