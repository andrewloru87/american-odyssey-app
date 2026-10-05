import { useMemo,useState } from 'react';
import { Pressable,StyleSheet,Text,View } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import type { VoteValue } from '@wanna/domain';
import { Button } from '../../src/components/Button';import { Card } from '../../src/components/Card';import { Screen } from '../../src/components/Screen';import { Body,H1,H2,Muted } from '../../src/components/Typography';import { shortDate } from '../../src/lib/date';import { useWanna } from '../../src/state/WannaStore';
export default function PlanDetailScreen(){
 const router=useRouter();const params=useLocalSearchParams<{id:string}>();const {currentUser,getPlan,vote,markReady,confirmPlan}=useWanna();const plan=getPlan(params.id);const [selectedOptionId,setSelectedOptionId]=useState<string|undefined>(plan?.timeOptions[0]?.id);
 const selectedOption=useMemo(()=>plan?.timeOptions.find(o=>o.id===selectedOptionId)??plan?.timeOptions[0],[plan,selectedOptionId]);
 if(!currentUser)return null;if(!plan)return <Screen><H1>Plan not found</H1><Button label="Back" onPress={()=>router.back()}/></Screen>;
 const allYes=selectedOption?plan.participants.every(p=>selectedOption.votes[p.id]==='YES'):false;
 const chooseVote=(value:VoteValue)=>{if(selectedOption)void vote(plan.id,selectedOption.id,value)};
 return <Screen><Button label="Back" kind="ghost" onPress={()=>router.back()}/><Muted>{plan.status.replaceAll('_',' ')}</Muted><H1>{plan.emoji} {plan.title}</H1><Muted>{plan.participants.map(p=>p.name).join(' | ')}</Muted>
 {plan.place&&<Card><Muted>PLACE</Muted><H2>{plan.place.name}</H2>{plan.place.address&&<Body>{plan.place.address}</Body>}</Card>}
 <H2>When</H2>{plan.timeOptions.length===0&&<Card><Body>No time proposed yet.</Body><Muted>This plan can stay an idea until you are ready to schedule it.</Muted></Card>}
 {plan.timeOptions.map(option=>{const selected=option.id===selectedOption?.id;return <Pressable key={option.id} onPress={()=>setSelectedOptionId(option.id)}><Card><View style={s.optionTop}><View style={{flex:1}}><H2>{shortDate(option.startsAt)}</H2><Muted>{Object.values(option.votes).filter(v=>v==='YES').length} yes | {Object.values(option.votes).filter(v=>v==='MAYBE').length} maybe</Muted></View><View style={[s.radio,selected&&s.radioSelected]}/></View></Card></Pressable>})}
 {selectedOption&&plan.status!=='CONFIRMED'&&<Card><H2>Your vote</H2><View style={s.voteRow}>{(['YES','MAYBE','NO'] as VoteValue[]).map(value=>{const active=selectedOption.votes[currentUser.id]===value;return <Pressable key={value} onPress={()=>chooseVote(value)} style={[s.vote,active&&s.voteActive]}><Text style={[s.voteText,active&&s.voteTextActive]}>{value}</Text></Pressable>})}</View></Card>}
 {plan.status==='PLANNING'&&selectedOption&&<Card><H2>{allYes?'Everyone is in':'Still collecting votes'}</H2><Muted>{allYes?'This option can move to final confirmation.':'You can still mark the preferred option ready when the group agrees.'}</Muted>{plan.organizerId===currentUser.id&&<Button label="Ready to confirm" onPress={()=>void markReady(plan.id,selectedOption.id)}/>}</Card>}
 {plan.status==='READY_TO_CONFIRM'&&<Card><Muted>FINAL STEP</Muted><H2>Lock it in?</H2>{selectedOption&&<Body>{shortDate(selectedOption.startsAt)}</Body>}{plan.organizerId===currentUser.id&&<Button label="Confirm plan" onPress={()=>void confirmPlan(plan.id,selectedOption?.id)}/>}</Card>}
 {plan.status==='CONFIRMED'&&<Card><Muted>CONFIRMED</Muted><H2>It is happening.</H2>{plan.confirmedStartsAt&&<Body>{shortDate(plan.confirmedStartsAt)}</Body>}</Card>}</Screen>;
}
const s=StyleSheet.create({optionTop:{flexDirection:'row',alignItems:'center',gap:12},radio:{width:22,height:22,borderRadius:11,borderWidth:2,borderColor:'#B9B9B3'},radioSelected:{borderWidth:7,borderColor:'#171717'},voteRow:{flexDirection:'row',gap:8},vote:{flex:1,paddingVertical:12,borderRadius:999,backgroundColor:'#F0F0EC',alignItems:'center'},voteActive:{backgroundColor:'#171717'},voteText:{fontWeight:'800',color:'#171717'},voteTextActive:{color:'#FFFFFF'}});
