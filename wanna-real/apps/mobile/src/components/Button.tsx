import { Pressable, StyleSheet, Text } from 'react-native';
export function Button({ label, onPress, kind='primary' }: { label:string; onPress?:()=>void; kind?:'primary'|'soft'|'ghost' }) {
  return <Pressable onPress={onPress} style={[s.base, kind==='primary'?s.primary:kind==='soft'?s.soft:s.ghost]}><Text style={[s.text, kind!=='primary'&&s.dark]}>{label}</Text></Pressable>
}
const s=StyleSheet.create({base:{paddingVertical:13,paddingHorizontal:18,borderRadius:999,alignItems:'center'},primary:{backgroundColor:'#171717'},soft:{backgroundColor:'#FFE8E5'},ghost:{backgroundColor:'#F0F0EC'},text:{color:'#fff',fontSize:15,fontWeight:'700'},dark:{color:'#171717'}})
