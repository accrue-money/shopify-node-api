import {RestResourceRequestError} from '../../error';
import {ApiVersion} from '../../base_types';

import FakeResource from './fake_resource';
import FakeResourceWithCustomPrefix from './fake_resource_with_custom_prefix';

describe('Base REST resource', () => {
  const domain = 'test-shop.myshopify.io';
  const prefix = '/admin/api/unstable';
  const headers = {'X-Shopify-Access-Token': 'test-access-token'};
  const accessToken = 'test-access-token';
  const apiVersion = ApiVersion.Unstable;

  it('finds resource by id', async () => {
    const body = {fake_resource: {id: 1, attribute: 'attribute'}};
    fetchMock.mockResponseOnce(JSON.stringify(body));

    const got = await FakeResource.find({domain, accessToken, apiVersion, id: 1} as any);

    expect([got!.id, got!.attribute]).toEqual([1, 'attribute']);
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('finds resource with param', async () => {
    const body = {fake_resource: {id: 1, attribute: 'attribute'}};
    fetchMock.mockResponseOnce(JSON.stringify(body));

    const got = await FakeResource.find({
      domain,
      accessToken,
      apiVersion,
      id: 1,
      params: {param: 'value'},
    } as any);

    expect([got!.id, got!.attribute]).toEqual([1, 'attribute']);
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources/1.json?param=value`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('finds resource and children by id', async () => {
    const body = {
      fake_resource: {
        id: 1,
        attribute: 'attribute1',
        has_one_attribute: {id: 2, attribute: 'attribute2'},
        has_many_attribute: [{id: 3, attribute: 'attribute3'}],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(body));

    const got = await FakeResource.find({domain, accessToken, apiVersion, id: 1} as any);

    expect([got!.id, got!.attribute]).toEqual([1, 'attribute1']);

    expect(got!.has_one_attribute!.constructor).toEqual(FakeResource);
    expect([
      got!.has_one_attribute!.id,
      got!.has_one_attribute!.attribute,
    ]).toEqual([2, 'attribute2']);

    expect(got!.has_many_attribute![0].constructor).toEqual(FakeResource);
    expect([
      got!.has_many_attribute![0].id,
      got!.has_many_attribute![0].attribute,
    ]).toEqual([3, 'attribute3']);

    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('fails on finding nonexistent resource by id', async () => {
    const body = {errors: 'Not Found'};
    fetchMock.mockResponseOnce(JSON.stringify(body), {
      status: 404,
      statusText: 'Not Found',
    });

    await expect(
      FakeResource.find({domain, accessToken, apiVersion, id: 1} as any),
    ).rejects.toThrowError(RestResourceRequestError);

    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('finds all resources', async () => {
    const body = {
      fake_resources: [
        {id: 1, attribute: 'attribute1'},
        {id: 2, attribute: 'attribute2'},
      ],
    };
    fetchMock.mockResponseOnce(JSON.stringify(body));

    const got = await FakeResource.all({domain, accessToken, apiVersion});

    expect([got![0].id, got![0].attribute]).toEqual([1, 'attribute1']);
    expect([got![1].id, got![1].attribute]).toEqual([2, 'attribute2']);
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('saves', async () => {
    const expectedRequestBody = {fake_resource: {attribute: 'attribute'}};
    const responseBody = {fake_resource: {id: 1, attribute: 'attribute'}};
    fetchMock.mockResponseOnce(JSON.stringify(responseBody));

    const resource = new FakeResource({});
    resource.attribute = 'attribute';
    await resource.save(domain, accessToken, apiVersion);

    expect(resource.id).toBeUndefined();
    expect({
      method: 'POST',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('saves and updates', async () => {
    const expectedRequestBody = {fake_resource: {attribute: 'attribute'}};
    const responseBody = {fake_resource: {id: 1, attribute: 'attribute'}};
    fetchMock.mockResponseOnce(JSON.stringify(responseBody));

    const resource = new FakeResource({});
    resource.attribute = 'attribute';
      await resource.saveAndUpdate(domain, accessToken, apiVersion);

    expect(resource.id).toEqual(1);
    expect({
      method: 'POST',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('saves existing resource', async () => {
    const expectedRequestBody = {
      fake_resource: {id: 1, attribute: 'attribute'},
    };
    const responseBody = {fake_resource: {id: 1, attribute: 'attribute'}};
    fetchMock.mockResponseOnce(JSON.stringify(responseBody));

    const resource = new FakeResource({});
    resource.id = 1;
    resource.attribute = 'attribute';
    await resource.save(domain, accessToken, apiVersion);

    expect(resource.id).toEqual(1);
    expect({
      method: 'PUT',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('saves with children', async () => {
    const expectedRequestBody = {
      fake_resource: {
        id: 1,
        attribute: 'attribute',
        has_one_attribute: {attribute: 'attribute1'},
        has_many_attribute: [{attribute: 'attribute2'}],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const child1 = new FakeResource({});
    child1.attribute = 'attribute1';

    const child2 = new FakeResource({});
    child2.attribute = 'attribute2';

    const resource = new FakeResource({});
    resource.id = 1;
    resource.attribute = 'attribute';
    resource.has_one_attribute = child1;
    resource.has_many_attribute = [child2];

    await resource.save(domain, accessToken, apiVersion);

    expect({
      method: 'PUT',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('saves with unknown attribute', async () => {
    const expectedRequestBody = {fake_resource: {unknown: 'some-value'}};
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const resource = new FakeResource({});
    resource.unknown = 'some-value';
    await resource.save(domain, accessToken, apiVersion);

    expect({
      method: 'POST',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('saves forced null attributes', async () => {
    const expectedRequestBody = {
      fake_resource: {id: 1, has_one_attribute: null},
    };
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const resource = new FakeResource({});
    resource.id = 1;
    resource.has_one_attribute = null;
    await resource.save(domain, accessToken, apiVersion);

    expect({
      method: 'PUT',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('deletes existing resource', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const resource = new FakeResource({});
    resource.id = 1;

    await resource.delete(domain, accessToken, apiVersion);

    expect({
      method: 'DELETE',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('deletes with other resource', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const resource = new FakeResource({});
    resource.id = 1;
    resource.other_resource_id = 2;

    await resource.delete(domain, accessToken, apiVersion);

    expect({
      method: 'DELETE',
      domain,
      path: `${prefix}/other_resources/2/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('fails to delete nonexistent resource', async () => {
    const body = {errors: 'Not Found'};
    fetchMock.mockResponseOnce(JSON.stringify(body), {
      status: 404,
      statusText: 'Not Found',
    });

    const resource = new FakeResource({});
    resource.id = 1;

    await expect(resource.delete(domain, accessToken, apiVersion)).rejects.toThrowError(
      RestResourceRequestError,
    );

    expect({
      method: 'DELETE',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('makes custom request', async () => {
    const body = {fake_resource: {id: 1, attribute: 'attribute'}};
    fetchMock.mockResponseOnce(JSON.stringify(body));

    const got = await FakeResource.custom({
      domain,
      accessToken,
      apiVersion,
      id: 1,
      other_resource_id: 2,
    });

    expect(got).toEqual(body);
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/other_resources/2/fake_resources/1/custom.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('paginates requests', async () => {
    const previousUrl = `https://${domain}/admin/api/unstable/fake_resources.json?page_info=previousToken`;
    const nextUrl = `https://${domain}/admin/api/unstable/fake_resources.json?page_info=nextToken`;

    const body = {fake_resources: []};
    fetchMock.mockResponses(
      [JSON.stringify(body), {headers: {link: `<${nextUrl}>; rel="next"`}}],
      [
        JSON.stringify(body),
        {headers: {link: `<${previousUrl}>; rel="previous"`}},
      ],
      [JSON.stringify(body), {}],
    );

    await FakeResource.all({domain, accessToken, apiVersion});
    expect(FakeResource.NEXT_PAGE_INFO).not.toBeUndefined();
    expect(FakeResource.PREV_PAGE_INFO).toBeUndefined();

    await FakeResource.all({
      domain,
      accessToken,
      apiVersion,
      params: FakeResource.NEXT_PAGE_INFO?.query,
    });
    expect(FakeResource.NEXT_PAGE_INFO).toBeUndefined();
    expect(FakeResource.PREV_PAGE_INFO).not.toBeUndefined();

    await FakeResource.all({
      domain,
      accessToken,
      apiVersion,
      params: FakeResource.PREV_PAGE_INFO?.query,
    });
    expect(FakeResource.NEXT_PAGE_INFO).toBeUndefined();
    expect(FakeResource.PREV_PAGE_INFO).toBeUndefined();

    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
    }).toMatchMadeHttpRequest();
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources.json?page_info=nextToken`,
      headers,
    }).toMatchMadeHttpRequest();
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources.json?page_info=previousToken`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('allows custom prefixes', async () => {
    const body = {
      fake_resource_with_custom_prefix: {id: 1, attribute: 'attribute'},
    };
    fetchMock.mockResponseOnce(JSON.stringify(body));

    const got = await FakeResourceWithCustomPrefix.find({domain, accessToken, apiVersion, id: 1});

    expect([got!.id, got!.attribute]).toEqual([1, 'attribute']);
    expect({
      method: 'GET',
      domain,
      path: `/admin/custom_prefix/fake_resource_with_custom_prefix/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });
});
