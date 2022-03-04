"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shopify = void 0;
var tslib_1 = require("tslib");
var ShopifyErrors = tslib_1.__importStar(require("./error"));
var clients_1 = tslib_1.__importDefault(require("./clients"));
var utils_1 = tslib_1.__importDefault(require("./utils"));
exports.Shopify = {
    Clients: clients_1.default,
    Utils: utils_1.default,
    Errors: ShopifyErrors,
};
exports.default = exports.Shopify;
tslib_1.__exportStar(require("./types"), exports);
