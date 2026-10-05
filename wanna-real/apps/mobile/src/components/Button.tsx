import { Pressable, StyleSheet, Text } from 'react-native';
export function Button({ label, onPress, kind='primary' }: { label:string; onPress?:()=>void; kind?:'primary'|'soft'|'ghost' }) {
  return <Pressable onPress={onPress} style={({pressed})=>[s.base,kind==='primary'?s.primary:kind==='soft'?s.soft:s.ghost,pressed&&s.pressed]}><Text style={[s.text, kind!=='primary'&&s.dark]}>{label}</Text></Pressable>
}
const s=StyleSheet.create({base:{paddingVertical:12,paddingHorizontal:17,borderRadius:999,alignItems:'center'},primary:{backgroundColor:'#171717'},soft:{backgroundColor:'#FFE9E6'},ghost:{backgroundColor:'#F0F0EC'},text:{color:'#fff',fontSize:15,fontWeight:'800'},dark:{color:'#171717'},pressed:{opacity:.78}})
