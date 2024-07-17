import * as http from 'http';

import { config, requestInterceptorArr } from './config';
import { storage } from './storage';

const httpRequest = http.request;

Object.defineProperty(http, 'request', {
    value: (options: string | http.RequestOptions | URL, callback: ((res: http.IncomingMessage) => void) | undefined)=> {
        const client = httpRequest(options, callback);

        if(config.enable)
            config.transferHeaders.map(headerKey => {
                const value = storage.get(headerKey);
                if(value)
                    client.setHeader(headerKey, value);
            });

        for(const interceptor of requestInterceptorArr) {
            if(typeof interceptor === 'function')
                interceptor(client);
        }
        return client;
    },
    enumerable: true,
    configurable: true,
    writable: true,
});
