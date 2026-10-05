import { Tabs } from 'expo-router';
import { Text } from 'react-native';
const Icon=({children,focused}:{children:string;focused:boolean})=><Text style={{fontSize:focused?23:21,opacity:focused?1:.55}}>{children}</Text>;
export default function TabsLayout(){return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:'#171717',tabBarInactiveTintColor:'#8A8A86',tabBarStyle:{height:78,paddingTop:8}}}>
<Tabs.Screen name="index" options={{title:'Home',tabBarIcon:({focused}:{focused:boolean})=><Icon focused={focused}>⌂</Icon>}}/>
<Tabs.Screen name="discover" options={{title:'Discover',tabBarIcon:({focused}:{focused:boolean})=><Icon focused={focused}>✦</Icon>}}/>
<Tabs.Screen name="create" options={{title:'Create',tabBarIcon:({focused}:{focused:boolean})=><Icon focused={focused}>＋</Icon>}}/>
<Tabs.Screen name="plans" options={{title:'Plans',tabBarIcon:({focused}:{focused:boolean})=><Icon focused={focused}>◫</Icon>}}/>
<Tabs.Screen name="you" options={{title:'You',tabBarIcon:({focused}:{focused:boolean})=><Icon focused={focused}>◎</Icon>}}/>
</Tabs>}
