import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthGate } from '../src/components/AuthGate';
import { WannaProvider } from '../src/state/WannaStore';
export default function RootLayout() {
  return <WannaProvider><StatusBar style="dark" /><AuthGate><Stack screenOptions={{headerShown:false}} /></AuthGate></WannaProvider>;
}
