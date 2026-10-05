import { StyleSheet, Text, type TextProps } from 'react-native';
export const H1=(p:TextProps)=><Text {...p} style={[s.h1,p.style]}/>;
export const H2=(p:TextProps)=><Text {...p} style={[s.h2,p.style]}/>;
export const Body=(p:TextProps)=><Text {...p} style={[s.body,p.style]}/>;
export const Muted=(p:TextProps)=><Text {...p} style={[s.muted,p.style]}/>;
const s=StyleSheet.create({h1:{fontSize:32,fontWeight:'800',letterSpacing:-1.3,lineHeight:34,color:'#171717'},h2:{fontSize:20,fontWeight:'800',letterSpacing:-.35,color:'#171717'},body:{fontSize:15,lineHeight:21,color:'#171717'},muted:{fontSize:14,lineHeight:20,color:'#71726D'}});
