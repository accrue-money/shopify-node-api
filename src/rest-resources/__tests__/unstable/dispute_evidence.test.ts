import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {DisputeEvidence} from '../../unstable';

describe('DisputeEvidence resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.Unstable;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DisputeEvidence.all({
      session: test_session,
      dispute_id: 598735659,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/shopify_payments/disputes/598735659/dispute_evidences.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const dispute_evidence = new DisputeEvidence({session: test_session});
    dispute_evidence.dispute_id = 598735659;
    await dispute_evidence.save({
      dispute_evidence: {refund_refusal_explanation: "Product must have receipt of proof of purchase"},
    });

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/unstable/shopify_payments/disputes/598735659/dispute_evidences.json',
      query: 'dispute_evidence%5Brefund_refusal_explanation%5D=Product+must+have+receipt+of+proof+of+purchase',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
