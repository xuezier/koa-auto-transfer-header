import './re-http-server';
import './re-https-server';
import './re-http2-server';
import './re-fetch';

import './http-request';
import './https-request';
import './http2-request';

import { config, requestInterceptorArr, IRequestInterceptor } from './config';
import assert = require('assert');

export function disableTransferHeaders() {
    config.enable = false;
}

export function setTransferHeaders(headers: string[]) {
    assert(!!headers.length, 'transfer headers can not empty');

    config.transferHeaders = headers;
}

export function addTransferHeader(header: string) {
    if(!config.transferHeaders.includes(header))
        config.transferHeaders.push(header);
}

export const requestInterceptor = {
    use: (callback: (request: IRequestInterceptor) => void) => {
        requestInterceptorArr.push(callback);
    }
};

export class HeaderTransferHandle {
    static disableTransferHeaders = disableTransferHeaders;

    static setTransferHeaders = setTransferHeaders;

    static addTransferHeader = addTransferHeader;

    static requestHeaderHandle?: any;

    static clientHeaderHandle?: any;
}

export * from './storage';
