import * as http from 'http';

import { config } from './config';
import { storage } from './storage';

const httpCreateServer = http.createServer;
Object.defineProperty(http, 'createServer', {
    value: (callback: http.RequestListener) => {
        return httpCreateServer((req, res) => {
            if(config.enable)
                if(storage.store)
                    return callback(req, res);
                else
                    storage.enable(function() {
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
