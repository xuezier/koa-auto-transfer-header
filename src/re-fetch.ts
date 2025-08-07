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

            const originalHeaders = input instanceof Request
                ? input.headers
                : init?.headers;

            const headers = new Headers(originalHeaders);

            RequestHeadersHook.handle({ url })
                .forEach(([key, value]) => headers.set(key, value ));

            for (const headerKey of config.transferHeaders) {
                const value = storage.get(headerKey);
                if (typeof value === 'string') {
                    headers.set(headerKey, value);
                } else if (Array.isArray(value)) {
                    // 多个值时用 append（更语义化）
                    for (const val of value) {
                        headers.append(headerKey, val);
                    }
                }
            }

            if (input instanceof Request) {
                // 创建一个新的 Request，复制 body、method、etc
                input = new Request(input, { headers });
                init = undefined; // 避免双重设置
            } else {
                init = {
                    ...init,
                    headers,
                };
            }
        }

        return globalFetch(input as any, init);
    },
    enumerable: true,
    configurable: true,
    writable: true,
});
