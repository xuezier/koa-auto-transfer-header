import { config } from "./config";
import { storage } from "./storage";
import { RequestHeadersHook } from './request-headers-hook';

const globalFetch = global.fetch;

Object.defineProperty(global, 'fetch', {
    value: async function (input: RequestInfo | URL, init?: RequestInit) {
        if(config.enable) {
            if(!init)
                init = { headers: {} };
            const headers = init.headers || {};

            RequestHeadersHook.handle({
                url: input instanceof Request ?
                    input.url :
                    input instanceof URL ?
                        input.href :
                        input,
            }).map(([key, value]) => { headers[key] = value; });

            for(const headerKey of config.transferHeaders) {
                const value = storage.get(headerKey);
                if(value)
                    headers[headerKey] = value;
            }

            init.headers = headers;
        }

        return globalFetch(input as any, init);
    },
    enumerable: true,
    configurable: true,
    writable: true,
});
