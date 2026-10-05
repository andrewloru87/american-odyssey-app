import { useMemo,useState } from 'react';
import { Pressable,StyleSheet,Text,TextInput,View } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { discoverCards } from '@wanna/domain';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { H1,H2,Muted,Body } from '../../src/components/Typography';
import { Button } from '../../src/components/Button';
import { useWanna } from '../../src/state/WannaStore';

type TimeChoice='NONE'|'TONIGHT'|'TOMORROW'|'WEEKEND';

function startsAtFor(choice:TimeChoice){
  if(choice==='NONE')return undefined;
  const date=new Date();
  if(choice==='TONIGHT'){date.setHours(19,30,0,0);if(date.getTime()<Date.now())date.setDate(date.getDate()+1)}
  if(choice==='TOMORROW'){date.setDate(date.getDate()+1);date.setHours(19,30,0,0)}
  if(choice==='WEEKEND'){const days=(6-date.getDay()+7)%7||7;date.setDate(date.getDate()+days);date.setHours(19,30,0,0)}
  return date.toISOString();
}

export default function CreateScreen(){
  const router=useRouter();
  const params=useLocalSearchParams<{discoverId?:string}>();
  const sourceCard=useMemo(()=>discoverCards.find(c=>c.id===params.discoverId),[params.discoverId]);
  const {people,currentUser,createPlan}=useWanna();
  const suggestedPeople=sourceCard?.interestedUserIds??[];
  const [text,setText]=useState(sourceCard?.title??'');
  const [selectedPeople,setSelectedPeople]=useState<string[]>(suggestedPeople);
  const [timeChoice,setTimeChoice]=useState<TimeChoice>('NONE');
  const [details,setDetails]=useState(Boolean(sourceCard));
  if(!currentUser)return null;

  const togglePerson=(id:string)=>setSelectedPeople(c=>c.includes(id)?c.filter(x=>x!==id):[...c,id]);

  const submit=async()=>{
    if(!text.trim())return;
    const plan=await createPlan({
      title:text,
      participantIds:selectedPeople,
      startsAt:startsAtFor(timeChoice),
      sourceDiscoverItemId:sourceCard?.id,
    });
    router.push(('/plan/'+plan.id) as never);
  };

  return <Screen>
    <H1>Create</H1>
    <Muted>Start anywhere. Wanna asks only for what is missing.</Muted>

    {sourceCard&&<Card>
      <Muted style={s.eyebrow}>MATCHED IDEA</Muted>
      <H2>{sourceCard.emoji} {sourceCard.title}</H2>
      <Muted>{sourceCard.reason}</Muted>
    </Card>}

    <Card>
      <H2>What are you thinking?</H2>
      <TextInput value={text} onChangeText={setText} placeholder="Sushi with Benny Friday…" multiline style={s.input}/>
      {!details
        ? <View style={s.left}><Button label="Continue" onPress={()=>text.trim()&&setDetails(true)}/></View>
        : <Body>Nice. Add only the details you already know.</Body>}
    </Card>

    {!details&&<Card>
      <H2>Or start with…</H2>
      <View style={s.chips}>
        {['👥 People','🗓 Date','📍 Place','🔗 Link'].map(label=>
          <Pressable key={label} style={s.chip} onPress={()=>setDetails(true)}>
            <Text style={s.chipText}>{label}</Text>
          </Pressable>)}
      </View>
    </Card>}

    {details&&<>
      <Card>
        <H2>Who?</H2>
        <View style={s.chips}>
          {people.filter(p=>p.id!==currentUser.id).map(person=>{
            const selected=selectedPeople.includes(person.id);
            return <Pressable key={person.id} onPress={()=>togglePerson(person.id)} style={[s.chip,selected&&s.chipSelected]}>
              <Text style={[s.chipText,selected&&s.chipTextSelected]}>{person.name}</Text>
            </Pressable>;
          })}
          {people.filter(p=>p.id!==currentUser.id).length===0&&<Muted>Your friends will appear here after they create an account.</Muted>}
        </View>
      </Card>

      <Card>
        <H2>When?</H2>
        <View style={s.chips}>
          {([['NONE','Decide later'],['TONIGHT','Tonight'],['TOMORROW','Tomorrow'],['WEEKEND','This weekend']] as [TimeChoice,string][]).map(([value,label])=>{
            const selected=value===timeChoice;
            return <Pressable key={value} onPress={()=>setTimeChoice(value)} style={[s.chip,selected&&s.chipSelected]}>
              <Text style={[s.chipText,selected&&s.chipTextSelected]}>{label}</Text>
            </Pressable>;
          })}
        </View>
      </Card>

      <Button label="Create plan" onPress={()=>void submit()}/>
    </>}
  </Screen>;
}

const s=StyleSheet.create({
  eyebrow:{fontSize:12,fontWeight:'800',letterSpacing:1},
  input:{minHeight:130,borderRadius:19,backgroundColor:'#F2F2EE',padding:15,fontSize:17,textAlignVertical:'top'},
  chips:{flexDirection:'row',flexWrap:'wrap',gap:8},
  chip:{paddingHorizontal:13,paddingVertical:9,borderRadius:999,backgroundColor:'#ECECE7'},
  chipSelected:{backgroundColor:'#171717'},
  chipText:{color:'#171717',fontWeight:'700'},
  chipTextSelected:{color:'#FFFFFF'},
  left:{alignSelf:'flex-start'},
});
