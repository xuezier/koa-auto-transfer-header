import * as http2 from 'http2';
import { Socket } from 'net';
import { TLSSocket } from 'tls';
import { config } from './config';
import { storage } from './storage';

const connect = http2.connect;

Object.defineProperty(http2, 'connect', {
    value: function(authority: string | URL, options?, listener?: ((session: http2.ClientHttp2Session, socket: Socket | TLSSocket) => void)) {
        const session = connect(authority, options, listener);

        if(!config.enable)
            return session;

        const request = session.request;

        Object.defineProperty(session, 'request', {
            value: function(headers: http2.OutgoingHttpHeaders, options?: http2.ClientSessionRequestOptions) {
                config.transferHeaders.map(headerKey => {
                    const value = storage.get(headerKey);
                    if(value) {
                        headers[headerKey] = value;
                        headers[`grpc-metadata-${headerKey}`] = value;
                    }

                });

                const req = request.apply(session, [headers, options]);

                return req;
            }
        });
    }
});
