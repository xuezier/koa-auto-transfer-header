import { AsyncLocalStorage } from "async_hooks";

type StoreType = Map<string, string | string[]>;
const asyncLocalStorage = new AsyncLocalStorage<StoreType>();

export const storage = {
    enable(callback: () => any) {
        asyncLocalStorage.run(new Map<string, string | string[]>(), callback);
    },
    get(key: string) {
        return asyncLocalStorage.getStore()?.get(key);
    },
    set(key: string, value: string | string[]) {
        asyncLocalStorage.getStore()?.set(key, value);
    }
};
