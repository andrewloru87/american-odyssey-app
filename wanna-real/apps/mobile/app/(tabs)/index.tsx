import { useRouter } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { Body,H1,H2,Muted } from '../../src/components/Typography';
import { Button } from '../../src/components/Button';
import { shortDate } from '../../src/lib/date';
import { useWanna } from '../../src/state/WannaStore';

export default function HomeScreen(){
  const router=useRouter();
  const {plans,currentUser}=useWanna();
  if(!currentUser)return null;

  const needsYou=plans.filter(p=>p.status==='PLANNING'||p.status==='READY_TO_CONFIRM');
  const upcoming=plans.filter(p=>p.status==='CONFIRMED');
  const today=new Intl.DateTimeFormat('en',{weekday:'short',day:'numeric',month:'long'}).format(new Date()).toUpperCase();

  return <Screen>
    <View style={s.top}><Muted style={s.date}>{today}</Muted><Text style={s.profileDot}>◉</Text></View>
    <H1>Good morning,{'
'}{currentUser.name}</H1>

    <Card>
      <Muted style={s.eyebrow}>QUICK START</Muted>
      <H2>What do you wanna do?</H2>
      <Body>Start with an idea, a person, a date or a place.</Body>
      <View style={s.left}><Button label="＋ Create something" onPress={()=>router.push('/create' as never)}/></View>
    </Card>

    <View style={s.heading}><H2>Needs you</H2><Muted>{needsYou.length}</Muted></View>
    {needsYou.length===0&&<Card><Body>Nothing waiting on you. Nice.</Body></Card>}
    {needsYou.map(plan=><Card key={plan.id}>
      <Muted style={s.eyebrow}>{plan.status==='READY_TO_CONFIRM'?'READY TO CONFIRM':'VOTE NEEDED'}</Muted>
      <H2>{plan.emoji} {plan.title}</H2>
      <Body>{plan.participants.map(p=>p.name).join(' · ')}</Body>
      {plan.timeOptions[0]&&<Muted>{shortDate(plan.timeOptions[0].startsAt)}</Muted>}
      <View style={s.left}><Button label={plan.status==='READY_TO_CONFIRM'?'Confirm plan':'Vote'} onPress={()=>router.push(('/plan/'+plan.id) as never)}/></View>
    </Card>)}

    <View style={s.heading}><H2>For you</H2></View>
    <Card>
      <Muted style={s.eyebrow}>✨ GOOD WINDOW</Muted>
      <H2>Make something happen</H2>
      <Body>When calendar availability is connected, Wanna will surface the easiest moments to meet.</Body>
      <View style={s.left}><Button label="Make a plan" kind="soft" onPress={()=>router.push('/create' as never)}/></View>
    </Card>

    {upcoming.length>0&&<View style={s.heading}><H2>Upcoming</H2></View>}
    {upcoming.map(plan=><Card key={plan.id}>
      <H2>{plan.emoji} {plan.title}</H2>
      {plan.confirmedStartsAt&&<Muted>{shortDate(plan.confirmedStartsAt)}</Muted>}
      <View style={s.left}><Button label="Open" kind="ghost" onPress={()=>router.push(('/plan/'+plan.id) as never)}/></View>
    </Card>)}
  </Screen>;
}

const s=StyleSheet.create({
  top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  date:{fontSize:12,fontWeight:'800',letterSpacing:1},
  profileDot:{fontSize:18,color:'#171717'},
  eyebrow:{fontSize:12,fontWeight:'800',letterSpacing:1},
  heading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8},
  left:{alignSelf:'flex-start'},
});
