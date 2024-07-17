import { IncomingMessage } from 'http';
import * as https from 'https';

import { config, requestInterceptorArr } from './config';
import { storage } from './storage';

const httpsRequest = https.request;

Object.defineProperty(https, 'request', {
    value: (options: string | https.RequestOptions | URL, callback: ((res: IncomingMessage) => void) | undefined)=> {
        const client = httpsRequest(options, callback);

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
