import * as http from 'http';

import { config } from './config';
import { storage } from './storage';

const httpCreateServer = http.createServer;

const httpCallback = function(callback: http.RequestListener)  {
    return (req: http.IncomingMessage, res: http.ServerResponse) => {
        if(config.enable)
            if(storage.store)
                return callback(req, res);
            else
                storage.enable(function() {
                    storage.set(req.headers);

                    callback(req, res);
                });
        else
            callback(req,res);
    };
};

Object.defineProperty(http, 'createServer', {
    value: (options: http.ServerOptions, callback?: http.RequestListener) => {

        if(typeof options === 'function') {
            callback = options;

            return httpCreateServer(httpCallback(<any>callback));
        }

        return httpCreateServer(options, httpCallback(<any>callback));
    }
});
