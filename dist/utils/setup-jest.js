"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jest_fetch_mock_1 = require("jest-fetch-mock");
jest_fetch_mock_1.enableFetchMocks();
var currentCall = 0;
beforeEach(function () {
    // We want to reset the Context object on every run so that tests start with a consistent state
    fetchMock.mockReset();
    currentCall = 0;
});
expect.extend({
    /**
     * Checks if two dates in the form of numbers are within seconds of each other
     *
     * @param received First date
     * @param compareDate Second date
     * @param seconds The number of seconds the first and second date should be within
     */
    toBeWithinSecondsOf: function (received, compareDate, seconds) {
        if (received &&
            compareDate &&
            Math.abs(received - compareDate) <= seconds * 1000) {
            return {
                message: function () {
                    return "expected " + received + " not to be within " + seconds + " seconds of " + compareDate;
                },
                pass: true,
            };
        }
        else {
            return {
                message: function () {
                    return "expected " + received + " to be within " + seconds + " seconds of " + compareDate;
                },
                pass: false,
            };
        }
    },
    toMatchMadeHttpRequest: function (_a) {
        var method = _a.method, domain = _a.domain, path = _a.path, _b = _a.query, query = _b === void 0 ? '' : _b, _c = _a.headers, headers = _c === void 0 ? {} : _c, _d = _a.data, data = _d === void 0 ? null : _d, _e = _a.tries, tries = _e === void 0 ? 1 : _e;
        var bodyObject = data && typeof data !== 'string';
        var maxCall = currentCall + tries;
        for (var i = currentCall; i < maxCall; i++) {
            currentCall++;
            var mockCall = fetchMock.mock.calls[i];
            expect(mockCall).not.toBeUndefined();
            if (bodyObject && mockCall[1]) {
                mockCall[1].body = JSON.parse(mockCall[1].body);
            }
            expect(mockCall[0]).toEqual("https://" + domain + path + (query ? "?" + query.replace(/\+/g, '%20') : ''));
            expect(mockCall[1]).toMatchObject({ method: method, headers: headers, body: data });
        }
        return {
            message: function () { return "expected to have seen the right HTTP requests"; },
            pass: true,
        };
    },
});
