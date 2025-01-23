import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab <Link href="/settings">[Settings]</Link></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
