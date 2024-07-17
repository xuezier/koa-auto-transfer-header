import { IConfig } from "./interface/IConfig";
import * as http from 'http';
import * as http2 from 'http2';

export type IRequestInterceptor = RequestInit | http.ClientRequest | http2.ClientHttp2Stream | http.ClientRequest;

export const config: IConfig = {
    transferHeaders: [
        'request-id', 'trace-id', 'gd_request_origin',
        'x-forwarded-for',
        'accept-language',
    ],

    enable: true,
};

export const requestInterceptorArr: ((request: IRequestInterceptor) => void)[] = [];
