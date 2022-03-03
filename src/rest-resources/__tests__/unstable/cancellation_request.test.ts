import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {CancellationRequest} from '../../unstable';

describe('CancellationRequest resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.Unstable;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const cancellation_request = new CancellationRequest({session: test_session});
    cancellation_request.fulfillment_order_id = 1046000837;
    cancellation_request.message = "The customer changed his mind.";
    await cancellation_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/unstable/fulfillment_orders/1046000837/cancellation_request.json',
      query: '',
      headers,
      data: { "cancellation_request": {message: "The customer changed his mind."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const cancellation_request = new CancellationRequest({session: test_session});
    cancellation_request.fulfillment_order_id = 1046000838;
    await cancellation_request.accept({
      body: {cancellation_request: {message: "We had not started any processing yet."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/unstable/fulfillment_orders/1046000838/cancellation_request/accept.json',
      query: '',
      headers,
      data: { "cancellation_request": {message: "We had not started any processing yet."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const cancellation_request = new CancellationRequest({session: test_session});
    cancellation_request.fulfillment_order_id = 1046000839;
    await cancellation_request.reject({
      body: {cancellation_request: {message: "We have already send the shipment out."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/unstable/fulfillment_orders/1046000839/cancellation_request/reject.json',
      query: '',
      headers,
      data: { "cancellation_request": {message: "We have already send the shipment out."} }
    }).toMatchMadeHttpRequest();
  });

});
