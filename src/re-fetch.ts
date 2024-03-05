import { config } from "./config";
import { storage } from "./storage";

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

            init.headers = headers;
        }

        return globalFetch(input, init);
    }
});
