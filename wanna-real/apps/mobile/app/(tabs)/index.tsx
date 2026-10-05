import { useRouter } from 'expo-router';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { Body,H1,H2,Muted } from '../../src/components/Typography';
import { Button } from '../../src/components/Button';
import { shortDate } from '../../src/lib/date';
import { useWanna } from '../../src/state/WannaStore';
export default function HomeScreen(){
 const router=useRouter();const {plans,currentUser}=useWanna();if(!currentUser)return null;
 const needsYou=plans.filter(p=>p.status==='PLANNING'||p.status==='READY_TO_CONFIRM');
 const upcoming=plans.filter(p=>p.status==='CONFIRMED');
 const today=new Intl.DateTimeFormat('en',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
 return <Screen><Muted>{today}</Muted><H1>Good morning, {currentUser.name}</H1>
 <Card><Muted>QUICK START</Muted><H2>What do you wanna do?</H2><Body>Start with an idea, a person, a date or a place.</Body><Button label="Create something" onPress={()=>router.push('/create' as never)}/></Card>
 <H2>Needs you</H2>{needsYou.length===0&&<Card><Body>Nothing waiting on you. Nice.</Body></Card>}
 {needsYou.map(plan=><Card key={plan.id}><Muted>{plan.status==='READY_TO_CONFIRM'?'READY TO CONFIRM':'VOTE NEEDED'}</Muted><H2>{plan.emoji} {plan.title}</H2><Body>{plan.participants.map(p=>p.name).join(' | ')}</Body>{plan.timeOptions[0]&&<Muted>{shortDate(plan.timeOptions[0].startsAt)}</Muted>}<Button label={plan.status==='READY_TO_CONFIRM'?'Confirm plan':'Vote'} onPress={()=>router.push(`/plan/${plan.id}` as never)}/></Card>)}
 <H2>For you</H2><Card><Muted>GOOD WINDOW</Muted><H2>Make something happen</H2><Body>Turn a loose idea into a plan in a few taps.</Body><Button label="Make a plan" kind="soft" onPress={()=>router.push('/create' as never)}/></Card>
 {upcoming.length>0&&<H2>Upcoming</H2>}{upcoming.map(plan=><Card key={plan.id}><H2>{plan.emoji} {plan.title}</H2>{plan.confirmedStartsAt&&<Muted>{shortDate(plan.confirmedStartsAt)}</Muted>}<Button label="Open" kind="ghost" onPress={()=>router.push(`/plan/${plan.id}` as never)}/></Card>)}
 </Screen>;
}
