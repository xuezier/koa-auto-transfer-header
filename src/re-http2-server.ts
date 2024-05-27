import * as http2 from 'http2';
import { config } from './config';
import { storage } from './storage';

const createServer = http2.createServer;

const http2Callback = function(callback: (request: http2.Http2ServerRequest, response: http2.Http2ServerResponse) => void) {
    return (req: http2.Http2ServerRequest, res: http2.Http2ServerResponse) => {
        if(config.enable)
            if(storage.store) {
                storage.set(req.headers);
                callback(req, res);
            }
            else
                storage.enable(function() {
                    storage.set(req.headers);
                    callback(req, res);
                });
        else
            callback(req, res);

    };
};

Object.defineProperty(http2, 'createServer', {
    value: function(options: http2.ServerOptions, callback?: (request: http2.Http2ServerRequest, response: http2.Http2ServerResponse) => void) {
        if(typeof options === 'function') {
            callback = options;

            return createServer(http2Callback(<any>callback));
        }

        return createServer(options, http2Callback(<any>callback));

    },
    enumerable: true,
    configurable: true,
    writable: true,
});
