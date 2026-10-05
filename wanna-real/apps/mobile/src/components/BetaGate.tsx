import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { H1, H2, Muted } from './Typography';
import { useWanna } from '../state/WannaStore';

export function BetaGate({ children }: { children: ReactNode }) {
  const { ready, backendError, currentUser, people, claimProfile } = useWanna();

  if (!ready) {
    return <View style={s.center}><ActivityIndicator size="large" color="#171717" /><Muted>Connecting Wanna…</Muted></View>;
  }

  if (backendError) {
    return <View style={s.page}><Card><Muted>BACKEND</Muted><H2>Wanna cannot connect yet</H2><Muted>{backendError}</Muted></Card></View>;
  }

  if (!currentUser) {
    return <View style={s.page}>
      <Muted>WANNA CLOSED BETA</Muted>
      <H1>Who are you?</H1>
      <Muted>This device will use your beta identity. Plans are shared live between participants.</Muted>
      <View style={s.people}>
        {people.map((person) => <Pressable key={person.id} onPress={() => claimProfile(person.handle.replace('@', ''))} style={s.person}>
          <View style={s.avatar}><Text style={s.avatarText}>{person.name.slice(0, 1)}</Text></View>
          <Text style={s.name}>{person.name}</Text>
          <Text style={s.handle}>{person.handle}</Text>
        </Pressable>)}
      </View>
    </View>;
  }

  return <>{children}</>;
}

const s = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#F7F7F5', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  page: { flex: 1, backgroundColor: '#F7F7F5', padding: 24, paddingTop: 80, gap: 16 },
  people: { gap: 12, marginTop: 8 },
  person: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E8E3', borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFE8E5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 21, fontWeight: '850', color: '#171717' },
  name: { flex: 1, fontSize: 19, fontWeight: '800', color: '#171717' },
  handle: { color: '#777770', fontWeight: '600' },
});
