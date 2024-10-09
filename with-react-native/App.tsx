import React, {useEffect} from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import PolyfillCrypto from 'react-native-webview-crypto';
import Config from 'react-native-config';
import {CapsuleMobile, Environment} from '@usecapsule/react-native-wallet';

console.log('Config', Config);
console.log('Config.CAPSULE_API_KEY', Config.CAPSULE_API_KEY);

const capsuleMobile = new CapsuleMobile(
  Environment.BETA,
  Config.CAPSULE_API_KEY,
);

function App(): React.JSX.Element {
  useEffect(() => {
    capsuleMobile.init();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <PolyfillCrypto />
      <Text style={styles.text}>Hello Capsule!</Text>
      <Text style={styles.text}>Environment: {Environment.BETA}</Text>
      <Text style={styles.text}>API Key: {Config.CAPSULE_API_KEY}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default App;
