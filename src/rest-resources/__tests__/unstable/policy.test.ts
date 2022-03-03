import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Policy} from '../../unstable';

describe('Policy resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.Unstable;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Policy.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/policies.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
