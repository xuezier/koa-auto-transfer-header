import { IConfig } from "./interface/IConfig";

export const config: IConfig = {
    transferHeaders: [
        'request-id', 'trace-id', 'gd_request_origin',
        'x-forwarded-for',
        'accept-language',
    ],

    enable: true,
};
