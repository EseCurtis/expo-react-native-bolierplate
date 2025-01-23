import { Store } from 'pullstate';
import { Linking } from 'react-native';

export function openLinkInBrowser(url: string) {
    Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

type WithSelectors<S> = S extends { getRawState: () => infer T }
    ? S & { use: { [K in keyof T]: () => T[K] } }
    : never;

export const createSelectors = <S extends Store<object>>(_store: S) => {
    let store = _store as WithSelectors<typeof _store>;
    store.use = {};
    for (let k of Object.keys(store.getRawState())) {
        (store.use as any)[k] = () => store.useState((s: any) => s[k as keyof typeof s]);
    }

    return store;
};

export const is = {
    Number: (_var: any) => typeof _var === 'number',
};
