import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {InventoryLevel} from '../../unstable';

describe('InventoryLevel resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.Unstable;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await InventoryLevel.all({
      session: test_session,
      inventory_item_ids: "808950810,39072856",
      location_ids: "655441491,487838322",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/inventory_levels.json',
      query: 'inventory_item_ids=808950810%2C39072856&location_ids=655441491%2C487838322',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await InventoryLevel.all({
      session: test_session,
      inventory_item_ids: "808950810",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/inventory_levels.json',
      query: 'inventory_item_ids=808950810',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await InventoryLevel.all({
      session: test_session,
      location_ids: "655441491",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/inventory_levels.json',
      query: 'location_ids=655441491',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const inventory_level = new InventoryLevel({session: test_session});

    await inventory_level.adjust({
      body: {location_id: 655441491, inventory_item_id: 808950810, available_adjustment: 5},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/unstable/inventory_levels/adjust.json',
      query: '',
      headers,
      data: {location_id: 655441491, inventory_item_id: 808950810, available_adjustment: 5}
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await InventoryLevel.delete({
      session: test_session,
      inventory_item_id: "808950810",
      location_id: "655441491",
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/unstable/inventory_levels.json',
      query: 'inventory_item_id=808950810&location_id=655441491',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const inventory_level = new InventoryLevel({session: test_session});

    await inventory_level.connect({
      body: {location_id: 844681632, inventory_item_id: 457924702},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/unstable/inventory_levels/connect.json',
      query: '',
      headers,
      data: {location_id: 844681632, inventory_item_id: 457924702}
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const inventory_level = new InventoryLevel({session: test_session});

    await inventory_level.set({
      body: {location_id: 655441491, inventory_item_id: 808950810, available: 42},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/unstable/inventory_levels/set.json',
      query: '',
      headers,
      data: {location_id: 655441491, inventory_item_id: 808950810, available: 42}
    }).toMatchMadeHttpRequest();
  });

});
