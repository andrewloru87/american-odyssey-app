import { useState } from 'react';
import { StyleSheet,Text,View } from 'react-native';
import { useRouter } from 'expo-router';
import { discoverCards } from '@wanna/domain';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { H1,H2,Muted,Body } from '../../src/components/Typography';
import { Button } from '../../src/components/Button';
import { useWanna } from '../../src/state/WannaStore';
export default function DiscoverScreen(){
 const router=useRouter();const {chooseDiscover,people}=useWanna();const [index,setIndex]=useState(0);const [lastMatchId,setLastMatchId]=useState<string|null>(null);
 const card=discoverCards[index%discoverCards.length];const lastMatch=discoverCards.find(item=>item.id===lastMatchId);
 const decide=(decision:'PASS'|'SAVE'|'WANNA')=>{chooseDiscover(card.id,decision);if(decision==='WANNA'&&card.interestedUserIds.length>0)setLastMatchId(card.id);else setLastMatchId(null);setIndex(v=>v+1)};
 const matchNames=lastMatch?.interestedUserIds.map(id=>people.find(p=>p.id===id)?.name).filter(Boolean) as string[]|undefined;
 return <Screen><H1>Discover</H1><Muted>Your choices stay private until there is a mutual Wanna.</Muted>
 {lastMatch&&<Card><Muted>IT'S A MATCH</Muted><H2>{lastMatch.emoji} {lastMatch.title}</H2><Body>{matchNames?.join(' and ')} {matchNames?.length===1?'wants':'want'} to do this too.</Body><Button label="Create Plan" onPress={()=>router.push(`/create?discoverId=${lastMatch.id}` as never)}/></Card>}
 <View style={s.hero}><Text style={s.emoji}>{card.emoji}</Text><Muted>{card.recommendationScore}% FOR YOU</Muted><Text style={s.title}>{card.title}</Text><Body>{card.subtitle}</Body><Muted>{card.reason}</Muted>{card.place?.travelMinutes&&<Muted>About {card.place.travelMinutes} min travel</Muted>}</View>
 <View style={s.actions}><Button label="Pass" kind="ghost" onPress={()=>decide('PASS')}/><Button label="Save" kind="soft" onPress={()=>decide('SAVE')}/><Button label="Wanna" onPress={()=>decide('WANNA')}/></View>
 </Screen>;
}
const s=StyleSheet.create({hero:{minHeight:390,borderRadius:30,backgroundColor:'#fff',padding:26,justifyContent:'flex-end',gap:12,borderWidth:1,borderColor:'#E8E8E3'},emoji:{fontSize:72,position:'absolute',top:44,left:26},title:{fontSize:34,fontWeight:'800',letterSpacing:-1,color:'#171717'},actions:{flexDirection:'row',justifyContent:'space-between',gap:8}});
