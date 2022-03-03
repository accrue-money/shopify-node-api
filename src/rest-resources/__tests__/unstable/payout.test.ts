import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Payout} from '../../unstable';

describe('Payout resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.Unstable;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Payout.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/shopify_payments/payouts.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Payout.all({
      session: test_session,
      date_max: "2012-11-12",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/shopify_payments/payouts.json',
      query: 'date_max=2012-11-12',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Payout.find({
      session: test_session,
      id: 623721858,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/shopify_payments/payouts/623721858.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
