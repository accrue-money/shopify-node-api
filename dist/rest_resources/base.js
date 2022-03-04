"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var error_1 = require("../error");
var rest_1 = require("../clients/rest");
var types_1 = require("../clients/http_client/types");
var Base = /** @class */ (function () {
    function Base(_a) {
        var fromData = _a.fromData;
        if (fromData) {
            this.setData(fromData);
        }
    }
    Base.baseFind = function (_a) {
        var _b, _c, _d, _e;
        var urlIds = _a.urlIds, params = _a.params, domain = _a.domain, accessToken = _a.accessToken, apiVersion = _a.apiVersion;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.request({
                            domain: domain,
                            accessToken: accessToken,
                            http_method: 'get',
                            operation: 'get',
                            urlIds: urlIds,
                            params: params,
                            apiVersion: apiVersion
                        })];
                    case 1:
                        response = _f.sent();
                        this.NEXT_PAGE_INFO = (_c = (_b = response.pageInfo) === null || _b === void 0 ? void 0 : _b.nextPage) !== null && _c !== void 0 ? _c : undefined;
                        this.PREV_PAGE_INFO = (_e = (_d = response.pageInfo) === null || _d === void 0 ? void 0 : _d.prevPage) !== null && _e !== void 0 ? _e : undefined;
                        return [2 /*return*/, this.createInstancesFromResponse(response.body)];
                }
            });
        });
    };
    Base.request = function (_a) {
        var http_method = _a.http_method, domain = _a.domain, accessToken = _a.accessToken, operation = _a.operation, urlIds = _a.urlIds, params = _a.params, body = _a.body, entity = _a.entity, apiVersion = _a.apiVersion;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var client, path, cleanParams, key, _b, error_2;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        client = new rest_1.RestClient(apiVersion, domain, accessToken);
                        path = this.getPath({ http_method: http_method, operation: operation, urlIds: urlIds, entity: entity });
                        cleanParams = {};
                        if (params) {
                            for (key in params) {
                                if (params[key] !== null) {
                                    cleanParams[key] = params[key];
                                }
                            }
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 12, , 13]);
                        _b = http_method;
                        switch (_b) {
                            case 'get': return [3 /*break*/, 2];
                            case 'post': return [3 /*break*/, 4];
                            case 'put': return [3 /*break*/, 6];
                            case 'delete': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, client.get({ path: path, query: cleanParams })];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4: return [4 /*yield*/, client.post({
                            path: path,
                            query: cleanParams,
                            data: body,
                            type: types_1.DataType.JSON,
                        })];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6: return [4 /*yield*/, client.put({
                            path: path,
                            query: cleanParams,
                            data: body,
                            type: types_1.DataType.JSON,
                        })];
                    case 7: return [2 /*return*/, _c.sent()];
                    case 8: return [4 /*yield*/, client.delete({ path: path, query: cleanParams })];
                    case 9: return [2 /*return*/, _c.sent()];
                    case 10: throw new Error("Unrecognized HTTP method \"" + http_method + "\"");
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_2 = _c.sent();
                        if (error_2 instanceof error_1.HttpResponseError) {
                            throw new error_1.RestResourceRequestError(error_2.message, error_2.code, error_2.statusText);
                        }
                        else {
                            throw error_2;
                        }
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Base.getJsonBodyName = function () {
        return this.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    };
    Base.getPath = function (_a) {
        var http_method = _a.http_method, operation = _a.operation, urlIds = _a.urlIds, entity = _a.entity;
        var match = null;
        var specificity = -1;
        this.PATHS.forEach(function (path) {
            if (http_method !== path.http_method ||
                operation !== path.operation ||
                path.ids.length <= specificity) {
                return;
            }
            var pathUrlIds = tslib_1.__assign({}, urlIds);
            path.ids.forEach(function (id) {
                if (!pathUrlIds[id] && entity && entity[id]) {
                    pathUrlIds[id] = entity[id];
                }
            });
            pathUrlIds = Object.entries(pathUrlIds).reduce(function (acc, _a) {
                var _b = tslib_1.__read(_a, 2), key = _b[0], value = _b[1];
                if (value) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            // If we weren't given all of the path's required ids, we can't use it
            var diff = path.ids.reduce(function (acc, id) { return (pathUrlIds[id] ? acc : acc.concat(id)); }, []);
            if (diff.length > 0) {
                return;
            }
            specificity = path.ids.length;
            match = path.path.replace(/(<([^>]+)>)/g, 
            // eslint-disable-next-line @typescript-eslint/naming-convention
            function (_m1, _m2, id) { return "" + pathUrlIds[id]; });
        });
        if (!match) {
            throw new error_1.RestResourceError('Could not find a path for request');
        }
        if (this.CUSTOM_PREFIX) {
            return this.CUSTOM_PREFIX + "/" + match;
        }
        else {
            return match;
        }
    };
    Base.createInstancesFromResponse = function (data) {
        var _this = this;
        if (data[this.PLURAL_NAME]) {
            return data[this.PLURAL_NAME].reduce(function (acc, entry) {
                return acc.concat(_this.createInstance(entry));
            }, []);
        }
        if (data[this.NAME]) {
            return [this.createInstance(data[this.NAME])];
        }
        return [];
    };
    Base.createInstance = function (data, prevInstance) {
        var instance = prevInstance
            ? prevInstance
            : new this({});
        if (data) {
            instance.setData(data);
        }
        return instance;
    };
    Base.prototype.save = function (domain, accessToken, apiVersion, _a) {
        var _b = (_a === void 0 ? {} : _a).update, update = _b === void 0 ? false : _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _c, PRIMARY_KEY, NAME, method, data, response, body;
            var _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _c = this.resource(), PRIMARY_KEY = _c.PRIMARY_KEY, NAME = _c.NAME;
                        method = this[PRIMARY_KEY] ? 'put' : 'post';
                        data = this.serialize();
                        return [4 /*yield*/, this.resource().request({
                                domain: domain,
                                accessToken: accessToken,
                                apiVersion: apiVersion,
                                http_method: method,
                                operation: method,
                                urlIds: {},
                                body: (_d = {}, _d[this.resource().getJsonBodyName()] = data, _d),
                                entity: this,
                            })];
                    case 1:
                        response = _e.sent();
                        body = response.body[NAME];
                        if (update && body) {
                            this.setData(body);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Base.prototype.saveAndUpdate = function (domain, accessToken, apiVersion) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.save(domain, accessToken, apiVersion, { update: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Base.prototype.delete = function (domain, accessToken, apiVersion) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resource().request({
                            domain: domain,
                            accessToken: accessToken,
                            apiVersion: apiVersion,
                            http_method: 'delete',
                            operation: 'delete',
                            urlIds: {},
                            entity: this,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Base.prototype.serialize = function () {
        var _a = this.resource(), HAS_MANY = _a.HAS_MANY, HAS_ONE = _a.HAS_ONE;
        return Object.entries(this).reduce(function (acc, _a) {
            var _b = tslib_1.__read(_a, 2), attribute = _b[0], value = _b[1];
            if (attribute in HAS_MANY && value) {
                acc[attribute] = value.reduce(function (attrAcc, entry) {
                    return attrAcc.concat(entry.serialize ? entry.serialize() : entry);
                }, []);
            }
            else if (attribute in HAS_ONE && value && value.serialize) {
                acc[attribute] = value.serialize();
            }
            else {
                acc[attribute] = value;
            }
            return acc;
        }, {});
    };
    Base.prototype.setData = function (data) {
        var _this = this;
        var _a = this.resource(), HAS_MANY = _a.HAS_MANY, HAS_ONE = _a.HAS_ONE;
        Object.entries(data).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), attribute = _b[0], val = _b[1];
            if (attribute in HAS_MANY) {
                var HasManyResource_1 = HAS_MANY[attribute];
                _this[attribute] = [];
                val.forEach(function (entry) {
                    _this[attribute].push(new HasManyResource_1({ fromData: entry }));
                });
            }
            else if (attribute in HAS_ONE) {
                var HasOneResource = HAS_ONE[attribute];
                _this[attribute] = new HasOneResource({
                    fromData: val,
                });
            }
            else {
                _this[attribute] = val;
            }
        });
    };
    Base.prototype.resource = function () {
        return this.constructor;
    };
    Base.NAME = '';
    Base.PLURAL_NAME = '';
    Base.PRIMARY_KEY = 'id';
    Base.CUSTOM_PREFIX = null;
    Base.HAS_ONE = {};
    Base.HAS_MANY = {};
    Base.PATHS = [];
    return Base;
}());
exports.default = Base;
