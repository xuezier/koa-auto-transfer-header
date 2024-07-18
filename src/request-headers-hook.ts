type ICallback = (require: IRequire) => {[key: string]: string};

type IRequire = {
    url: string;
}

export class RequestHeadersHook {
    private static hooks: Set<ICallback> = new Set();

    static register (callback: ICallback) {
        this.hooks.add(callback);
    }

    static unregister (callback: ICallback) {
        this.hooks.delete(callback);
    }

    static handle(require: IRequire) {
        const headers: {[key: string]: string} = Array.from(this.hooks).reduce((acc, hook) => {
            const header = hook(require);
            return { ...acc, ...header };
        }, {});
        return Object.entries(headers);
    }
}
