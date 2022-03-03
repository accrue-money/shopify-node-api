import querystring from 'querystring';

import {ShopifyHeader, ApiVersion} from '../../base_types';
import {HttpClient} from '../http_client/http_client';
import {RequestParams, GetRequestParams} from '../http_client/types';

import {RestRequestReturn, PageInfo} from './types';

class RestClient extends HttpClient {
  private static LINK_HEADER_REGEXP = /<([^<]+)>; rel="([^"]+)"/;
  private static DEFAULT_LIMIT = '50';

  public constructor(readonly apiVersion: ApiVersion, domain: string, readonly accessToken: string) {
    super(domain);
  }

  protected async request(params: RequestParams): Promise<RestRequestReturn> {
    params.extraHeaders = {
      [ShopifyHeader.AccessToken]: this.accessToken,
      ...params.extraHeaders,
    };

    const ret = (await super.request(params)) as RestRequestReturn;

    const link = ret.headers.get('link');
    if (link !== undefined) {
      const pageInfo: PageInfo = {
        limit: params.query?.limit
          ? params.query?.limit.toString()
          : RestClient.DEFAULT_LIMIT,
      };

      if (link) {
        const links = link.split(', ');

        for (const link of links) {
          const parsedLink = link.match(RestClient.LINK_HEADER_REGEXP);
          if (!parsedLink) {
            continue;
          }

          const linkRel = parsedLink[2];
          const linkUrl = new URL(parsedLink[1]);
          const linkFields = linkUrl.searchParams.get('fields');
          const linkPageToken = linkUrl.searchParams.get('page_info');

          if (!pageInfo.fields && linkFields) {
            pageInfo.fields = linkFields.split(',');
          }

          if (linkPageToken) {
            switch (linkRel) {
              case 'previous':
                pageInfo.previousPageUrl = parsedLink[1];
                pageInfo.prevPage = this.buildRequestParams(parsedLink[1]);
                break;
              case 'next':
                pageInfo.nextPageUrl = parsedLink[1];
                pageInfo.nextPage = this.buildRequestParams(parsedLink[1]);
                break;
            }
          }
        }
      }

      ret.pageInfo = pageInfo;
    }

    return ret;
  }

  protected getRequestPath(path: string): string {
    const cleanPath = super.getRequestPath(path);
    if (cleanPath.startsWith('/admin')) {
      return `${cleanPath.replace(/\.json$/, '')}.json`;
    } else {
      return `/admin/api/${this.apiVersion}${cleanPath.replace(
        /\.json$/,
        '',
      )}.json`;
    }
  }

  private buildRequestParams(newPageUrl: string): GetRequestParams {
    const pattern = `^/admin/api/[^/]+/(.*).json$`;

    const url = new URL(newPageUrl);
    const path = url.pathname.replace(new RegExp(pattern), '$1');
    const query = querystring.decode(url.search.replace(/^\?(.*)/, '$1')) as {
      [key: string]: string | number;
    };
    return {
      path,
      query,
    };
  }
}

export {RestClient};
