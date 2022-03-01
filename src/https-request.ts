import { IncomingMessage } from 'http';
import * as https from 'https';

import { config } from './config';
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

        return client;
    },
});
