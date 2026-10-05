import { useMemo,useState } from 'react';
import { Pressable,StyleSheet,Text,TextInput,View } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { discoverCards } from '@wanna/domain';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { H1,H2,Muted } from '../../src/components/Typography';
import { Button } from '../../src/components/Button';
import { useWanna } from '../../src/state/WannaStore';
type TimeChoice='NONE'|'TONIGHT'|'TOMORROW'|'WEEKEND';
function startsAtFor(choice:TimeChoice){if(choice==='NONE')return undefined;const date=new Date();if(choice==='TONIGHT'){date.setHours(19,30,0,0);if(date.getTime()<Date.now())date.setDate(date.getDate()+1)}if(choice==='TOMORROW'){date.setDate(date.getDate()+1);date.setHours(19,30,0,0)}if(choice==='WEEKEND'){const days=(6-date.getDay()+7)%7||7;date.setDate(date.getDate()+days);date.setHours(19,30,0,0)}return date.toISOString()}
export default function CreateScreen(){
 const router=useRouter();const params=useLocalSearchParams<{discoverId?:string}>();const sourceCard=useMemo(()=>discoverCards.find(c=>c.id===params.discoverId),[params.discoverId]);const {people,currentUser,createPlan}=useWanna();const suggestedPeople=sourceCard?.interestedUserIds??[];
 const [text,setText]=useState(sourceCard?.title??'');const [selectedPeople,setSelectedPeople]=useState<string[]>(suggestedPeople);const [timeChoice,setTimeChoice]=useState<TimeChoice>('NONE');if(!currentUser)return null;
 const togglePerson=(id:string)=>setSelectedPeople(c=>c.includes(id)?c.filter(x=>x!==id):[...c,id]);
 const submit=async()=>{if(!text.trim())return;const plan=await createPlan({title:text,participantIds:selectedPeople,startsAt:startsAtFor(timeChoice),sourceDiscoverItemId:sourceCard?.id});router.push(`/plan/${plan.id}` as never)};
 return <Screen><H1>Create</H1><Muted>Start with the idea. Add only what you already know.</Muted>
 {sourceCard&&<Card><Muted>MATCHED IDEA</Muted><H2>{sourceCard.emoji} {sourceCard.title}</H2><Muted>{sourceCard.reason}</Muted></Card>}
 <Card><H2>What are you thinking?</H2><TextInput value={text} onChangeText={setText} placeholder="Sushi with Benny Friday..." multiline style={s.input}/></Card>
 <Card><H2>Who?</H2><View style={s.chips}>{people.filter(p=>p.id!==currentUser.id).map(person=>{const selected=selectedPeople.includes(person.id);return <Pressable key={person.id} onPress={()=>togglePerson(person.id)} style={[s.chip,selected&&s.chipSelected]}><Text style={[s.chipText,selected&&s.chipTextSelected]}>{person.name}</Text></Pressable>})}</View></Card>
 <Card><H2>When?</H2><View style={s.chips}>{([['NONE','Decide later'],['TONIGHT','Tonight'],['TOMORROW','Tomorrow'],['WEEKEND','This weekend']] as [TimeChoice,string][]).map(([value,label])=>{const selected=value===timeChoice;return <Pressable key={value} onPress={()=>setTimeChoice(value)} style={[s.chip,selected&&s.chipSelected]}><Text style={[s.chipText,selected&&s.chipTextSelected]}>{label}</Text></Pressable>})}</View></Card>
 <Button label="Create plan" onPress={submit}/></Screen>;
}
const s=StyleSheet.create({input:{minHeight:110,borderRadius:18,backgroundColor:'#F3F3EF',padding:16,fontSize:18,textAlignVertical:'top'},chips:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{paddingHorizontal:14,paddingVertical:10,borderRadius:999,backgroundColor:'#F0F0EC'},chipSelected:{backgroundColor:'#171717'},chipText:{color:'#171717',fontWeight:'700'},chipTextSelected:{color:'#FFFFFF'}});
