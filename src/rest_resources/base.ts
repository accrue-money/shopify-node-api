import {
  HttpResponseError,
  RestResourceError,
  RestResourceRequestError,
} from '../error';
import {ApiVersion} from '../base_types';
import {RestClient} from '../clients/rest';
import {RestRequestReturn} from '../clients/rest/types';
import {DataType, GetRequestParams} from '../clients/http_client/types';

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

interface GetPathArgs {
  http_method: string;
  operation: string;
  urlIds: IdSet;
  entity?: Base | null;
}

class Base {
  // For instance attributes
  [key: string]: any;

  public static NEXT_PAGE_INFO: GetRequestParams | undefined;
  public static PREV_PAGE_INFO: GetRequestParams | undefined;

  protected static NAME = '';
  protected static PLURAL_NAME = '';
  protected static PRIMARY_KEY = 'id';
  protected static CUSTOM_PREFIX: string | null = null;

  protected static HAS_ONE: {[attribute: string]: typeof Base} = {};
  protected static HAS_MANY: {[attribute: string]: typeof Base} = {};

  protected static PATHS: ResourcePath[] = [];

  protected static async baseFind({
    urlIds,
    params,
    domain,
    accessToken,
    apiVersion
  }: BaseFindArgs): Promise<Base[]> {
    const response = await this.request({
      domain,
      accessToken,
      http_method: 'get',
      operation: 'get',
      urlIds,
      params,
      apiVersion
    });

    this.NEXT_PAGE_INFO = response.pageInfo?.nextPage ?? undefined;
    this.PREV_PAGE_INFO = response.pageInfo?.prevPage ?? undefined;

    return this.createInstancesFromResponse(response.body as Body);
  }

  protected static async request({
    http_method,
    domain,
    accessToken,
    operation,
    urlIds,
    params,
    body,
    entity,
    apiVersion
  }: RequestArgs): Promise<RestRequestReturn> {
      const client = new RestClient(apiVersion, domain, accessToken);

    const path = this.getPath({http_method, operation, urlIds, entity});

    const cleanParams: {[key: string]: string | number} = {};
    if (params) {
      for (const key in params) {
        if (params[key] !== null) {
          cleanParams[key] = params[key];
        }
      }
    }

    try {
      switch (http_method) {
        case 'get':
          return await client.get({path, query: cleanParams});
        case 'post':
          return await client.post({
            path,
            query: cleanParams,
            data: body!,
            type: DataType.JSON,
          });
        case 'put':
          return await client.put({
            path,
            query: cleanParams,
            data: body!,
            type: DataType.JSON,
          });
        case 'delete':
          return await client.delete({path, query: cleanParams});
        default:
          throw new Error(`Unrecognized HTTP method "${http_method}"`);
      }
    } catch (error) {
      if (error instanceof HttpResponseError) {
        throw new RestResourceRequestError(
          error.message,
          error.code,
          error.statusText,
        );
      } else {
        throw error;
      }
    }
  }

  protected static getJsonBodyName(): string {
    return this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }

  private static getPath({
    http_method,
    operation,
    urlIds,
    entity,
  }: GetPathArgs): string {
    let match: string | null = null;
    let specificity = -1;

    this.PATHS.forEach((path: ResourcePath) => {
      if (
        http_method !== path.http_method ||
        operation !== path.operation ||
        path.ids.length <= specificity
      ) {
        return;
      }

      let pathUrlIds: IdSet = {...urlIds};
      path.ids.forEach((id) => {
        if (!pathUrlIds[id] && entity && entity[id]) {
          pathUrlIds[id] = entity[id];
        }
      });

      pathUrlIds = Object.entries(pathUrlIds).reduce(
        (acc: IdSet, [key, value]: [string, string | number | null]) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );

      // If we weren't given all of the path's required ids, we can't use it
      const diff = path.ids.reduce(
        (acc: string[], id: string) => (pathUrlIds[id] ? acc : acc.concat(id)),
        [],
      );
      if (diff.length > 0) {
        return;
      }

      specificity = path.ids.length;
      match = path.path.replace(
        /(<([^>]+)>)/g,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        (_m1, _m2, id) => `${pathUrlIds[id]}`,
      );
    });

    if (!match) {
      throw new RestResourceError('Could not find a path for request');
    }

    if (this.CUSTOM_PREFIX) {
      return `${this.CUSTOM_PREFIX}/${match}`;
    } else {
      return match;
    }
  }

  private static createInstancesFromResponse(
    data: Body,
  ): Base[] {
    if (data[this.PLURAL_NAME]) {
      return data[this.PLURAL_NAME].reduce(
        (acc: Base[], entry: Body) =>
          acc.concat(this.createInstance(entry)),
        [],
      );
    }

    if (data[this.NAME]) {
      return [this.createInstance(data[this.NAME])];
    }

    return [];
  }

  private static createInstance(
    data: Body,
    prevInstance?: Base,
  ): Base {
    const instance: Base = prevInstance
      ? prevInstance
      : new (this as any)({});

    if (data) {
      instance.setData(data);
    }

    return instance;
  }


  constructor({fromData}: BaseConstructorArgs) {

    if (fromData) {
      this.setData(fromData);
    }
  }

    public async save(domain:string, accessToken: string, apiVersion: ApiVersion, {update = false} = {}): Promise<void> {
    const {PRIMARY_KEY, NAME} = this.resource();
    const method = this[PRIMARY_KEY] ? 'put' : 'post';

    const data = this.serialize();

    const response = await this.resource().request({
      domain,
      accessToken,
      apiVersion,
      http_method: method,
      operation: method,
      urlIds: {},
      body: {[this.resource().getJsonBodyName()]: data},
      entity: this,
    });

    const body: Body | undefined = (response.body as Body)[NAME];

    if (update && body) {
      this.setData(body);
    }
  }

  public async saveAndUpdate(domain: string, accessToken: string, apiVersion: ApiVersion): Promise<void> {
      await this.save(domain, accessToken, apiVersion, {update: true});
  }

    public async delete(domain: string, accessToken: string, apiVersion: ApiVersion): Promise<void> {
    await this.resource().request({
      domain,
      accessToken,
      apiVersion,
      http_method: 'delete',
      operation: 'delete',
      urlIds: {},
      entity: this,
    });
  }

  public serialize(): Body {
    const {HAS_MANY, HAS_ONE} = this.resource();

    return Object.entries(this).reduce((acc: Body, [attribute, value]) => {

      if (attribute in HAS_MANY && value) {
        acc[attribute] = value.reduce(
          (attrAcc: Body, entry: Base) =>
            attrAcc.concat(entry.serialize ? entry.serialize() : entry),
          [],
        );
      } else if (attribute in HAS_ONE && value && value.serialize) {
        acc[attribute] = (value as Base).serialize();
      } else {
        acc[attribute] = value;
      }

      return acc;
    }, {});
  }

  protected setData(data: Body): void {
    const {HAS_MANY, HAS_ONE} = this.resource();

    Object.entries(data).forEach(([attribute, val]) => {
      if (attribute in HAS_MANY) {
        const HasManyResource: typeof Base = HAS_MANY[attribute];
        this[attribute] = [];
        val.forEach((entry: Body) => {
          this[attribute].push(
            new HasManyResource({fromData: entry}),
          );
        });
      } else if (attribute in HAS_ONE) {
        const HasOneResource: typeof Base = HAS_ONE[attribute];
        this[attribute] = new HasOneResource({
          fromData: val,
        });
      } else {
        this[attribute] = val;
      }
    });
  }

  private resource(): typeof Base {
    return this.constructor as unknown as typeof Base;
  }
}

export default Base;
