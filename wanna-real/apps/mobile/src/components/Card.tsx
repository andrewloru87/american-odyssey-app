import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
export function Card({ children, onPress }: { children: ReactNode; onPress?: () => void }) {
  const body=<View style={styles.card}>{children}</View>;
  return onPress?<Pressable onPress={onPress}>{body}</Pressable>:body;
}
const styles=StyleSheet.create({card:{backgroundColor:'#FFFFFF',borderRadius:26,padding:18,gap:10,borderWidth:1,borderColor:'#E6E6E1',shadowColor:'#000',shadowOpacity:.025,shadowRadius:18,shadowOffset:{width:0,height:3},elevation:1}});
