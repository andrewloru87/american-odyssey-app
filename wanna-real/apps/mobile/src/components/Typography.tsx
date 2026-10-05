import { StyleSheet, Text, type TextProps } from 'react-native';
export const H1=(p:TextProps)=><Text {...p} style={[s.h1,p.style]}/>;
export const H2=(p:TextProps)=><Text {...p} style={[s.h2,p.style]}/>;
export const Body=(p:TextProps)=><Text {...p} style={[s.body,p.style]}/>;
export const Muted=(p:TextProps)=><Text {...p} style={[s.muted,p.style]}/>;
const s=StyleSheet.create({h1:{fontSize:32,fontWeight:'800',letterSpacing:-1,color:'#171717'},h2:{fontSize:21,fontWeight:'750',color:'#171717'},body:{fontSize:16,lineHeight:22,color:'#171717'},muted:{fontSize:14,lineHeight:20,color:'#74756F'}});
