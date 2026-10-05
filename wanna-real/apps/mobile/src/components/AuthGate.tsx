import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ReactNode } from 'react';
import { H1, H2, Muted } from './Typography';
import { Card } from './Card';
import { Button } from './Button';
import { useWanna } from '../state/WannaStore';

export function AuthGate({ children }: { children: ReactNode }) {
  const { ready, backendError, currentUser, signInWithEmail, signUpWithEmail } = useWanna();
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return <View style={s.center}><Muted>Connecting Wanna…</Muted></View>;
  if (currentUser) return <>{children}</>;

  const submit = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (mode === 'login') await signInWithEmail(email.trim(), password);
      else {
        const result = await signUpWithEmail(email.trim(), password, name.trim());
        if (result === 'confirm_email') setMessage('Check your email to confirm the account, then open Wanna again.');
      }
    } catch (e: any) {
      setMessage(e?.message ?? 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return <View style={s.page}><View style={s.inner}>
    <View style={s.logo}><Text style={s.logoText}>w</Text></View>
    <Muted>WANNA</Muted>
    <H1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</H1>
    <Muted>{mode === 'login' ? 'Sign in and pick up your plans where you left them.' : 'Create your own Wanna profile with email and password.'}</Muted>
    <Card>
      <H2>{mode === 'login' ? 'Sign in' : 'Register'}</H2>
      {mode === 'register' && <TextInput style={s.input} placeholder="Your name" value={name} onChangeText={setName} autoCapitalize="words" />}
      <TextInput style={s.input} autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} secureTextEntry placeholder="Password" value={password} onChangeText={setPassword} />
      <Button label={busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} onPress={busy ? undefined : submit} />
      {message && <Muted>{message}</Muted>}
      {backendError && <Muted>{backendError}</Muted>}
    </Card>
    <Pressable onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(null); }}>
      <Text style={s.switch}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</Text>
    </Pressable>
  </View></View>;
}

const s = StyleSheet.create({
  center:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#F7F7F5'},
  page:{flex:1,backgroundColor:'#F7F7F5',alignItems:'center'},
  inner:{width:'100%',maxWidth:430,padding:20,paddingTop:70,gap:14},
  logo:{width:64,height:64,borderRadius:22,backgroundColor:'#171717',alignItems:'center',justifyContent:'center'},
  logoText:{fontSize:34,fontWeight:'900',color:'#fff'},
  input:{backgroundColor:'#F2F2EE',borderRadius:19,paddingHorizontal:15,paddingVertical:14,fontSize:16,color:'#171717'},
  switch:{textAlign:'center',color:'#171717',fontWeight:'700',padding:10},
});
