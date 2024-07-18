import { IncomingMessage } from 'http';
import * as https from 'https';

import { config } from './config';
import { storage } from './storage';
import { RequestHeadersHook } from './request-headers-hook';

const httpsRequest = https.request;

Object.defineProperty(https, 'request', {
    value: (options: string | https.RequestOptions | URL, callback: ((res: IncomingMessage) => void) | undefined)=> {
        const client = httpsRequest(options, callback);

        if(config.enable) {
            RequestHeadersHook.handle().map(([key, value]) => { client.setHeader(key, value);});

            config.transferHeaders.map(headerKey => {
                const value = storage.get(headerKey);
                if(value)
                    client.setHeader(headerKey, value);
            });
        }

        return client;
    },
    enumerable: true,
    configurable: true,
    writable: true,
});
