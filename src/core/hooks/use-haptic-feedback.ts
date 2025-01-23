import * as Haptics from 'expo-haptics';
import { useLocalSettings } from '../local-settings';



export function useHapticFeedback() {
  const { hasHaptic } = useLocalSettings();

  const haptic = () => {
    'worklet';
    if (hasHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  const successHaptic = () => {
    if (hasHaptic) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  const errorHaptic = () => {
    if (hasHaptic) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return {
    haptic,
    successHaptic,
    errorHaptic,
  };
}
