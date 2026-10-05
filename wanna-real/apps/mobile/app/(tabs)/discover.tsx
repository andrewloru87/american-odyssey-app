import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { discoverCards } from '@wanna/domain';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { H1,H2,Muted,Body } from '../../src/components/Typography';
import { Button } from '../../src/components/Button';
import { useWanna } from '../../src/state/WannaStore';

export default function DiscoverScreen(){
  const router=useRouter();
  const {chooseDiscover,people}=useWanna();
  const [index,setIndex]=useState(0);
  const [lastMatchId,setLastMatchId]=useState<string|null>(null);
  const card=discoverCards[index%discoverCards.length];
  const lastMatch=discoverCards.find(item=>item.id===lastMatchId);

  const decide=(decision:'PASS'|'SAVE'|'WANNA')=>{
    chooseDiscover(card.id,decision);
    if(decision==='WANNA'&&card.interestedUserIds.length>0)setLastMatchId(card.id);
    else setLastMatchId(null);
    setIndex(v=>v+1);
  };

  const matchNames=lastMatch?.interestedUserIds
    .map(id=>people.find(p=>p.id===id)?.name)
    .filter(Boolean) as string[]|undefined;

  return <Screen>
    <View style={s.top}><H1 style={{marginBottom:6}}>Discover</H1><Text style={s.settings}>⚙</Text></View>
    <Muted>Things you might actually wanna do.</Muted>

    {lastMatch&&<Card>
      <View style={s.match}>
        <Muted style={s.matchEyebrow}>IT'S A MATCH ✨</Muted>
        <H2 style={s.matchText}>{lastMatch.emoji} {lastMatch.title}</H2>
        <Body style={s.matchMuted}>{matchNames?.length
          ? matchNames.join(' and ')+' '+(matchNames.length===1?'wants':'want')+' to do this too.'
          : 'Someone you know wants to do this too.'}</Body>
        <View style={s.left}><Button label="Create Plan" kind="soft" onPress={()=>router.push(('/create?discoverId='+lastMatch.id) as never)}/></View>
      </View>
    </Card>}

    <View style={s.hero}>
      <Text style={s.emoji}>{card.emoji}</Text>
      <Text style={s.score}>{card.recommendationScore}% FOR YOU</Text>
      <Text style={s.title}>{card.title}</Text>
      <Body>{card.subtitle}</Body>
      <Muted>{card.reason}</Muted>
    </View>

    <View style={s.actions}>
      <Pressable onPress={()=>decide('PASS')} style={({pressed})=>[s.circle,s.soft,pressed&&s.pressed]}><Text style={s.circleText}>✕</Text></Pressable>
      <Pressable onPress={()=>decide('SAVE')} style={({pressed})=>[s.circle,s.soft,pressed&&s.pressed]}><Text style={s.circleText}>☆</Text></Pressable>
      <Pressable onPress={()=>decide('WANNA')} style={({pressed})=>[s.circle,s.dark,pressed&&s.pressed]}><Text style={s.heart}>♥</Text></Pressable>
    </View>
  </Screen>;
}

const s=StyleSheet.create({
  top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  settings:{fontSize:18},
  hero:{minHeight:420,borderRadius:26,backgroundColor:'#FFFFFF',padding:18,justifyContent:'flex-end',gap:8,borderWidth:1,borderColor:'#E6E6E1'},
  emoji:{fontSize:76,position:'absolute',top:26,left:18},
  score:{fontWeight:'900',fontSize:12,color:'#FF625D'},
  title:{fontSize:32,fontWeight:'800',letterSpacing:-1.3,color:'#171717',marginTop:2},
  actions:{flexDirection:'row',justifyContent:'center',gap:10},
  circle:{width:64,height:54,borderRadius:999,alignItems:'center',justifyContent:'center'},
  soft:{backgroundColor:'#FFE9E6'},
  dark:{backgroundColor:'#171717'},
  circleText:{fontSize:20,fontWeight:'800',color:'#171717'},
  heart:{fontSize:20,fontWeight:'800',color:'#FFFFFF'},
  pressed:{opacity:.7},
  match:{backgroundColor:'#171717',margin:-18,padding:18,borderRadius:25,gap:10},
  matchEyebrow:{color:'#BBBBBB',fontSize:12,fontWeight:'800',letterSpacing:1},
  matchText:{color:'#FFFFFF'},
  matchMuted:{color:'#BBBBBB'},
  left:{alignSelf:'flex-start'},
});
