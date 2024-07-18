export class RequestHeadersHook {
    private static hooks: any[] = [];

    static register (name: string, callback: () => {[key: string]: string}) {
        this.hooks.push({name, callback});
    }

    static unregister (name: string) {
        this.hooks = this.hooks.filter(hook => hook.name !== name);
    }

    static handle() {
        const headers = this.hooks.reduce((acc, hook) => {
            const header = hook.callback();
            return Object.assign(acc, header);
        }, {});
        return Object.keys(headers).map(key => [key, headers[key]]);
    }
}
