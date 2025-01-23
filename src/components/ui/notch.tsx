import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function BottomNotch() {
  const { bottom } = useSafeAreaInsets();
  return <View style={{ height: bottom }} />;
}

export function TopNotch() {
  const { top } = useSafeAreaInsets();
  return <View style={{ height: top }} />;
}
