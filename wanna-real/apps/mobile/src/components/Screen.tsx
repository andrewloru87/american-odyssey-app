import type { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, type ViewStyle } from 'react-native';
export function Screen({children,contentStyle}:{children:ReactNode;contentStyle?:ViewStyle}){return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={[styles.content,contentStyle]}>{children}</ScrollView></SafeAreaView>}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F7F5'},content:{padding:20,paddingBottom:120,gap:16}});
