import { RequestListener } from 'http';
import * as https from 'https';
import { config } from './config';
import { storage } from './storage';

const httpsCreateServer = https.createServer;
Object.defineProperty(https, 'createServer', {
    value: (callback: RequestListener) => {
        return httpsCreateServer((req, res) => {
            if(config.enable)
                storage.enable(function() {
                    if(storage.store)
                        return callback(req, res);
                    else
                        config.transferHeaders.map(headerKey => {
                            const value = req.headers[headerKey];
                            if(value)
                                storage.set(headerKey, value);
                        });

                    callback(req, res);
                });
            else
                callback(req,res);
        });
    }
});
