"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var base_1 = tslib_1.__importDefault(require("../base"));
var FakeResourceWithCustomPrefix = /** @class */ (function (_super) {
    tslib_1.__extends(FakeResourceWithCustomPrefix, _super);
    function FakeResourceWithCustomPrefix() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FakeResourceWithCustomPrefix.NAME = 'fake_resource_with_custom_prefix';
    FakeResourceWithCustomPrefix.PLURAL_NAME = 'fake_resource_with_custom_prefixes';
    FakeResourceWithCustomPrefix.CUSTOM_PREFIX = '/admin/custom_prefix';
    FakeResourceWithCustomPrefix.HAS_ONE = {};
    FakeResourceWithCustomPrefix.HAS_MANY = {};
    FakeResourceWithCustomPrefix.PATHS = [
        {
            http_method: 'get',
            operation: 'get',
            ids: ['id'],
            path: 'fake_resource_with_custom_prefix/<id>.json',
        },
    ];
    FakeResourceWithCustomPrefix.find = function (_a) {
        var id = _a.id, domain = _a.domain, accessToken = _a.accessToken, apiVersion = _a.apiVersion;
        return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, FakeResourceWithCustomPrefix.baseFind({
                            domain: domain,
                            accessToken: accessToken,
                            apiVersion: apiVersion,
                            urlIds: { id: id },
                        })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, result ? result[0] : null];
                }
            });
        });
    };
    return FakeResourceWithCustomPrefix;
}(base_1.default));
exports.default = FakeResourceWithCustomPrefix;
