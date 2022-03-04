import * as ShopifyErrors from './error';
export declare const Shopify: {
    Clients: {
        Rest: typeof import("./clients/rest/rest_client").RestClient;
        Graphql: typeof import("./clients/graphql").GraphqlClient;
        Storefront: typeof import("./clients/graphql/storefront_client").StorefrontClient;
    };
    Utils: {
        nonce: typeof import("./utils/nonce").default;
        safeCompare: typeof import("./utils/safe-compare").default;
        validateShop: typeof import("./utils/shop-validator").default;
        versionCompatible: typeof import("./utils/version-compatible").default;
    };
    Errors: typeof ShopifyErrors;
};
export default Shopify;
export * from './types';
//# sourceMappingURL=index.d.ts.map