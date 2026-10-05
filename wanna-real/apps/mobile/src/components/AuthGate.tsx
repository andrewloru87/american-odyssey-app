import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ReactNode } from 'react';
import { H1, H2, Muted } from './Typography';
import { Card } from './Card';
import { Button } from './Button';
import { useWanna } from '../state/WannaStore';

export function AuthGate({ children }: { children: ReactNode }) {
  const { ready, backendError, currentUser, signInWithEmail, signUpWithEmail, signInWithApple } = useWanna();
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return <View style={s.center}><Text>Connecting Wanna…</Text></View>;
  if (currentUser) return <>{children}</>;

  const submit = async () => {
    setBusy(true); setMessage(null);
    try {
      if (mode === 'login') await signInWithEmail(email.trim(), password);
      else {
        const result = await signUpWithEmail(email.trim(), password);
        if (result === 'confirm_email') setMessage('Check your email to confirm your account, then open Wanna again.');
      }
    } catch (e:any) { setMessage(e?.message ?? 'Something went wrong.'); }
    finally { setBusy(false); }
  };

  const apple = async () => {
    setBusy(true); setMessage(null);
    try { await signInWithApple(); }
    catch (e:any) { setMessage(e?.message ?? 'Apple sign-in is not configured yet.'); setBusy(false); }
  };

  return <View style={s.page}>
    <View style={s.logo}><Text style={s.logoText}>w</Text></View>
    <Muted>WANNA</Muted>
    <H1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</H1>
    <Muted>{mode === 'login' ? 'Your plans, people and matches stay connected to your account.' : 'One account = one Wanna profile. No shared demo identities.'}</Muted>
    <Card>
      <H2>{mode === 'login' ? 'Sign in' : 'Register'}</H2>
      <TextInput style={s.input} autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} secureTextEntry placeholder="Password" value={password} onChangeText={setPassword} />
      <Button label={busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} onPress={busy ? undefined : submit} />
      <View style={s.divider}><View style={s.line}/><Text style={s.or}>or</Text><View style={s.line}/></View>
      <Pressable style={s.apple} onPress={busy ? undefined : apple}><Text style={s.appleText}>  Continue with Apple</Text></Pressable>
      {message && <Muted>{message}</Muted>}
      {backendError && <Muted>{backendError}</Muted>}
    </Card>
    <Pressable onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(null); }}>
      <Text style={s.switch}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</Text>
    </Pressable>
  </View>;
}

const s = StyleSheet.create({
  center:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#F7F7F5'},
  page:{flex:1,backgroundColor:'#F7F7F5',padding:24,paddingTop:70,gap:14},
  logo:{width:64,height:64,borderRadius:22,backgroundColor:'#171717',alignItems:'center',justifyContent:'center'},
  logoText:{fontSize:34,fontWeight:'900',color:'#fff'},
  input:{backgroundColor:'#F1F1ED',borderRadius:16,paddingHorizontal:15,paddingVertical:13,fontSize:16,color:'#171717'},
  divider:{flexDirection:'row',alignItems:'center',gap:10},
  line:{height:1,backgroundColor:'#E0E0DB',flex:1},
  or:{color:'#8A8A84',fontSize:12,fontWeight:'700'},
  apple:{backgroundColor:'#000',borderRadius:999,paddingVertical:13,alignItems:'center'},
  appleText:{color:'#fff',fontSize:15,fontWeight:'700'},
  switch:{textAlign:'center',color:'#171717',fontWeight:'700',padding:10},
});
