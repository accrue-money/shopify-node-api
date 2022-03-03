import {enableFetchMocks} from 'jest-fetch-mock';

enableFetchMocks();

let currentCall = 0;
beforeEach(() => {
  // We want to reset the Context object on every run so that tests start with a consistent state
  fetchMock.mockReset();

  currentCall = 0;
});

interface AssertHttpRequestParams {
  method: string;
  domain: string;
  path: string;
  query?: string;
  headers?: {[key: string]: unknown};
  data?: string | {[key: string]: unknown} | null;
  tries?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    /* eslint-disable @typescript-eslint/naming-convention */
    interface Matchers<R> {
      toBeWithinSecondsOf(compareDate: number, seconds: number): R;
      toMatchMadeHttpRequest(): R;
    }
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}

expect.extend({
  /**
   * Checks if two dates in the form of numbers are within seconds of each other
   *
   * @param received First date
   * @param compareDate Second date
   * @param seconds The number of seconds the first and second date should be within
   */
  toBeWithinSecondsOf(received: number, compareDate: number, seconds: number) {
    if (
      received &&
      compareDate &&
      Math.abs(received - compareDate) <= seconds * 1000
    ) {
      return {
        message: () =>
          `expected ${received} not to be within ${seconds} seconds of ${compareDate}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within ${seconds} seconds of ${compareDate}`,
        pass: false,
      };
    }
  },
  toMatchMadeHttpRequest({
    method,
    domain,
    path,
    query = '',
    headers = {},
    data = null,
    tries = 1,
  }: AssertHttpRequestParams) {
    const bodyObject = data && typeof data !== 'string';
    const maxCall = currentCall + tries;
    for (let i = currentCall; i < maxCall; i++) {
      currentCall++;

      const mockCall = fetchMock.mock.calls[i];
      expect(mockCall).not.toBeUndefined();

      if (bodyObject && mockCall[1]) {
        mockCall[1].body = JSON.parse(mockCall[1].body as string);
      }

      expect(mockCall[0]).toEqual(
        `https://${domain}${path}${
          query ? `?${query.replace(/\+/g, '%20')}` : ''
        }`,
      );
      expect(mockCall[1]).toMatchObject({method, headers, body: data});
    }

    return {
      message: () => `expected to have seen the right HTTP requests`,
      pass: true,
    };
  },
});
