import { config } from "./config";
import { storage } from "./storage";
import { RequestHeadersHook } from './request-headers-hook';

const globalFetch = global.fetch;

Object.defineProperty(global, 'fetch', {
    value: async function (input: RequestInfo | URL, init?: RequestInit) {
        if (config.enable) {
            const url =
                input instanceof Request ? input.url :
                    input instanceof URL ? input.href :
                        input;

            const modifiedHeaders = new Headers(init?.headers || input instanceof Request ? (input as Request).headers : {});

            RequestHeadersHook.handle({ url })
                .forEach(([key, value]) => modifiedHeaders.append(key, value ));

            for (const headerKey of config.transferHeaders) {
                const value = storage.get(headerKey);
                if (typeof value === 'string') {
                    modifiedHeaders.append(headerKey, value);
                } else if (Array.isArray(value)) {
                    // 多个值时用 append（更语义化）
                    for (const val of value) {
                        modifiedHeaders.append(headerKey, val);
                    }
                }
            }

            return globalFetch(input as any, { ...init, headers: modifiedHeaders });
        }

        return globalFetch(input as any, init);
    },
    enumerable: true,
    configurable: true,
    writable: true,
});
