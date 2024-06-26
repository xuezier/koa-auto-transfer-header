import { RequestListener } from 'http';
import * as https from 'https';
import * as http from 'http';
import { config } from './config';
import { storage } from './storage';

const httpsCreateServer = https.createServer;

const httpsCallback = function(callback: http.RequestListener)  {
    return (req: http.IncomingMessage, res: http.ServerResponse) => {
        if(config.enable)
            if(storage.store) {
                storage.set(req.headers);
                return callback(req, res);
            }
            else
                storage.enable(function() {
                    storage.set(req.headers);

                    callback(req, res);
                });
        else
            callback(req,res);
    };
};

Object.defineProperty(https, 'createServer', {
    value: (options: https.ServerOptions, callback: RequestListener) => {
        if(typeof options === 'function') {
            callback = options;

            return httpsCreateServer(httpsCallback(<any>callback));
        }

        return httpsCreateServer(options, httpsCallback(<any>callback));
    },
    enumerable: true,
    configurable: true,
    writable: true,
});
