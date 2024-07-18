import { config } from "./config";
import { storage } from "./storage";
import { RequestHeadersHook } from './request-headers-hook';

const globalFetch = global.fetch;

Object.defineProperty(global, 'fetch', {
    value: async function (input: RequestInfo, init?: RequestInit) {
        if(config.enable) {
            if(!init)
                init = { headers: {} };
            const headers = init.headers || {};

            for(const headerKey of config.transferHeaders) {
                const value = storage.get(headerKey);
                if(value)
                    headers[headerKey] = value;
            }

            RequestHeadersHook.handle().map(([key, value]) => { headers[key] = value; });

            init.headers = headers;
        }

        return globalFetch(input, init);
    },
    enumerable: true,
    configurable: true,
    writable: true,
});
