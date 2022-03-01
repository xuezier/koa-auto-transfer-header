import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<any>();
export const storage = {
    enable(callback: () => any) {
        asyncLocalStorage.run({} as any, callback);
    },
    get(key: string | number | symbol) {
        return asyncLocalStorage.getStore()[key];
    },
    set(key: string| number | symbol, value: any) {
        asyncLocalStorage.getStore()[key] = value;
    }
};
