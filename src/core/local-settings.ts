import { Store } from 'pullstate';
import { getItem, setItem } from './storage';

interface State {
    hasHaptic: boolean;
}

const LocalSettingsStore = new Store<State>({
    hasHaptic: true,
});

export const setHasHaptic = (hasHaptic: boolean) => {
    LocalSettingsStore.update(s => {
        s.hasHaptic = hasHaptic;
    });
    setItem('hasHaptic', JSON.stringify(hasHaptic));
};

export const hydrateLocalSettings = async () => {
    try {
        const hasHaptic = (await getItem('hasHaptic')) as string | null;
        if (hasHaptic !== null) {
            LocalSettingsStore.update(s => {
                s.hasHaptic = JSON.parse(hasHaptic);
            });
        } else {
            setItem('hasHaptic', JSON.stringify(true));
        }
    } catch (e) {
        // catch error here
        // Maybe sign_out user!
    }
};

export const useLocalSettings = () => LocalSettingsStore.useState();
