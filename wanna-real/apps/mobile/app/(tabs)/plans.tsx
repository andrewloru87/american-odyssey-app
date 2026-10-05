import { useMemo,useState } from 'react';
import { Pressable,StyleSheet,Text,View } from 'react-native';
import { useRouter } from 'expo-router';
import type { PlanStatus } from '@wanna/domain';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { H1,H2,Muted } from '../../src/components/Typography';
import { Button } from '../../src/components/Button';
import { useWanna } from '../../src/state/WannaStore';

const tabs:{label:string;statuses:PlanStatus[]}[]=[
  {label:'Ideas',statuses:['IDEA']},
  {label:'Planning',statuses:['PROPOSED','PLANNING','READY_TO_CONFIRM']},
  {label:'Confirmed',statuses:['CONFIRMED']},
  {label:'Past',statuses:['COMPLETED','MEMORY']},
];

export default function PlansScreen(){
  const router=useRouter();
  const {plans}=useWanna();
  const [active,setActive]=useState(1);
  const rows=useMemo(()=>plans.filter(p=>tabs[active].statuses.includes(p.status)),[active,plans]);

  return <Screen>
    <H1>Plans</H1>
    <View style={s.tabs}>
      {tabs.map((tab,index)=><Pressable key={tab.label} onPress={()=>setActive(index)} style={[s.tab,index===active&&s.tabActive]}>
        <Text style={[s.tabText,index===active&&s.tabTextActive]}>{tab.label}</Text>
      </Pressable>)}
    </View>

    {rows.length===0
      ? <Card><H2>Nothing here yet</H2><Muted>Plans move here automatically as they evolve.</Muted></Card>
      : rows.map(plan=><Card key={plan.id}>
          <Muted style={s.eyebrow}>{plan.status.replaceAll('_',' ')}</Muted>
          <H2>{plan.emoji} {plan.title}</H2>
          <Muted>{plan.participants.map(p=>p.name).join(' · ')}</Muted>
          <View style={s.meta}>
            {plan.timeOptions.length>0&&<Text style={s.pill}>{plan.timeOptions.length} {plan.timeOptions.length===1?'date':'dates'}</Text>}
            {plan.place&&<Text style={s.pill}>{plan.place.name}</Text>}
          </View>
          <View style={s.left}><Button label={plan.status==='READY_TO_CONFIRM'?'Confirm':'Open'} kind={plan.status==='READY_TO_CONFIRM'?'primary':'ghost'} onPress={()=>router.push(('/plan/'+plan.id) as never)}/></View>
        </Card>)}
  </Screen>;
}

const s=StyleSheet.create({
  tabs:{flexDirection:'row',gap:8,flexWrap:'wrap'},
  tab:{paddingHorizontal:13,paddingVertical:9,borderRadius:999,backgroundColor:'#ECECE7'},
  tabActive:{backgroundColor:'#171717'},
  tabText:{fontWeight:'700',color:'#62635F'},
  tabTextActive:{color:'#FFFFFF'},
  eyebrow:{fontSize:12,fontWeight:'800',letterSpacing:1},
  meta:{flexDirection:'row',gap:8,flexWrap:'wrap'},
  pill:{paddingHorizontal:10,paddingVertical:6,borderRadius:999,backgroundColor:'#F0F0EC',fontSize:12,fontWeight:'800',color:'#555555',overflow:'hidden'},
  left:{alignSelf:'flex-start'},
});
