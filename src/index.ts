import './re-http-server';
import './re-https-server';

import './http-request';
import './https-request';

import { config } from './config';
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
