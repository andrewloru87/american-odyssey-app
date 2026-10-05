import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BetaGate } from '../src/components/BetaGate';
import { WannaProvider } from '../src/state/WannaStore';
export default function RootLayout() {
  return <WannaProvider><StatusBar style="dark" /><BetaGate><Stack screenOptions={{headerShown:false}} /></BetaGate></WannaProvider>;
}
