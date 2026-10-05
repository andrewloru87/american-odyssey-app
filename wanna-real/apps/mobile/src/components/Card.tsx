import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
export function Card({children,onPress}:{children:ReactNode;onPress?:()=>void}){const body=<View style={styles.card}>{children}</View>;return onPress?<Pressable onPress={onPress}>{body}</Pressable>:body}
const styles=StyleSheet.create({card:{backgroundColor:'#fff',borderRadius:24,padding:18,gap:10,borderWidth:StyleSheet.hairlineWidth,borderColor:'#E8E8E3'}});
