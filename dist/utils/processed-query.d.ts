export default class ProcessedQuery {
    static stringify(keyValuePairs?: {
        [key: string]: any;
    }): string;
    processedQuery: {
        [key: string]: string | number | (string | number)[];
    };
    constructor();
    putAll(keyValuePairs: {
        [key: string]: any;
    }): ProcessedQuery;
    put(key: string, value: any): void;
    putArray(key: string, value: (string | number)[]): void;
    putObject(key: string, value: object): void;
    putSimple(key: string, value: string | number): void;
    stringify(): string;
}
//# sourceMappingURL=processed-query.d.ts.map