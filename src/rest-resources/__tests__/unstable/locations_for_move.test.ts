import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {LocationsForMove} from '../../unstable';

describe('LocationsForMove resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.Unstable;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await LocationsForMove.all({
      session: test_session,
      fulfillment_order_id: 1046000833,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/fulfillment_orders/1046000833/locations_for_move.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
