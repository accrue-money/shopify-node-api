import Base, {ParamSet, ResourcePath} from '../base';

interface FakeResourceFindArgs {
  params?: ParamSet;
  id: number;
  other_resource_id?: number | null;
  domain: string;
  accessToken: string;
}

interface FakeResourceAllArgs {
  params?: ParamSet;
  domain: string;
  accessToken: string;
}

interface FakeResourceCustomArgs {
  id: number;
  other_resource_id: number;
  domain: string;
  accessToken: string;
}

export default class FakeResource extends Base {
  protected static NAME = 'fake_resource';
  protected static PLURAL_NAME = 'fake_resources';

  protected static HAS_ONE = {
    has_one_attribute: FakeResource,
  };

  protected static HAS_MANY = {
    has_many_attribute: FakeResource,
  };

  protected static PATHS: ResourcePath[] = [
    {
      http_method: 'get',
      operation: 'get',
      ids: ['id'],
      path: 'fake_resources/<id>.json',
    },
    {
      http_method: 'get',
      operation: 'get',
      ids: [],
      path: 'fake_resources.json',
    },
    {
      http_method: 'post',
      operation: 'post',
      ids: [],
      path: 'fake_resources.json',
    },
    {
      http_method: 'put',
      operation: 'put',
      ids: ['id'],
      path: 'fake_resources/<id>.json',
    },
    {
      http_method: 'delete',
      operation: 'delete',
      ids: ['id'],
      path: 'fake_resources/<id>.json',
    },
    {
      http_method: 'get',
      operation: 'get',
      ids: ['id', 'other_resource_id'],
      path: 'other_resources/<other_resource_id>/fake_resources/<id>.json',
    },
    {
      http_method: 'get',
      operation: 'custom',
      ids: ['id', 'other_resource_id'],
      path: 'other_resources/<other_resource_id>/fake_resources/<id>/custom.json',
    },
    {
      http_method: 'delete',
      operation: 'delete',
      ids: ['id', 'other_resource_id'],
      path: 'other_resources/<other_resource_id>/fake_resources/<id>.json',
    },
  ];

  public static find = async ({
    domain,
    accessToken,
    params,
    id,
    other_resource_id = null,
    ...otherArgs
  }: FakeResourceFindArgs): Promise<FakeResource | null> => {
    const result = await FakeResource.baseFind({
      domain,
      accessToken,
      urlIds: {id, other_resource_id},
      params: {...params, ...otherArgs},
    });
    return result ? (result[0] as FakeResource) : null;
  };

  public static all = async ({
    domain,
    accessToken,
    params,
  }: FakeResourceAllArgs): Promise<FakeResource[]> => {
    return FakeResource.baseFind({
      domain,
      accessToken,
      params,
      urlIds: {},
    });
  };

  public static custom = async ({
    id,
    other_resource_id,
    domain,
    accessToken,
  }: FakeResourceCustomArgs): Promise<Body> => {
    const response = await FakeResource.request({
      domain,
      accessToken,
      http_method: 'get',
      operation: 'custom',
      urlIds: {id, other_resource_id},
    });

    return response.body as Body;
  };

  id?: number | string | null;
  attribute?: string | null;
  has_one_attribute?: FakeResource | null;
  has_many_attribute?: FakeResource[] | null;
  other_resource_id?: number | null;
}
