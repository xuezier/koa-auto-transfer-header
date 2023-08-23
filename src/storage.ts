import { AsyncLocalStorage } from "async_hooks";
import { IncomingHttpHeaders } from 'http';

type StoreType = Map<string | Symbol, IncomingHttpHeaders>;
const asyncLocalStorage = new AsyncLocalStorage<StoreType>();

export const STORAGE_KEY = Symbol('Storage#Header');

export const storage = {
    get store() {
        return asyncLocalStorage.getStore();
    },
    enable(callback: () => any) {
        asyncLocalStorage.run(new Map<string | Symbol, IncomingHttpHeaders>(), callback);
    },
    get(key: string) {
        return asyncLocalStorage.getStore()?.get(STORAGE_KEY)?.[key];
    },
    set(value: IncomingHttpHeaders) {
        asyncLocalStorage.getStore()?.set(STORAGE_KEY, value);
    }
};
