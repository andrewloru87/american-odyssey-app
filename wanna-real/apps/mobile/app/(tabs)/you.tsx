import { StyleSheet,Text,View } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { H1,H2,Muted,Body } from '../../src/components/Typography';
import { Button } from '../../src/components/Button';
import { useWanna } from '../../src/state/WannaStore';

export default function YouScreen(){
  const {currentUser,people,plans,signOut}=useWanna();
  if(!currentUser)return null;

  const confirmed=plans.filter(p=>['CONFIRMED','COMPLETED','MEMORY'].includes(p.status)).length;
  const memories=plans.filter(p=>['COMPLETED','MEMORY'].includes(p.status));
  const friend=people.find(p=>p.id!==currentUser.id);

  return <Screen>
    <View style={s.top}>
      <View>
        <Muted style={s.eyebrow}>YOUR PROFILE</Muted>
        <H1 style={{marginBottom:4}}>{currentUser.name}</H1>
        <Muted>{currentUser.handle}</Muted>
      </View>
      <View style={s.avatar}><Text style={s.avatarText}>{currentUser.name.slice(0,1).toUpperCase()}</Text></View>
    </View>

    <Card>
      <Muted style={s.eyebrow}>YOUR YEAR</Muted>
      <View style={s.stats}>
        <Stat n={String(plans.length)} l="plans"/>
        <Stat n={String(confirmed)} l="confirmed"/>
        <Stat n={String(memories.length)} l="memories"/>
      </View>
    </Card>

    <View style={s.heading}><H2>Memories</H2></View>
    {memories.length>0
      ? <View style={s.grid}>{memories.slice(0,6).map(plan=><View key={plan.id} style={s.photo}><Text style={{fontSize:32}}>{plan.emoji}</Text></View>)}</View>
      : <Card><Muted>Your completed plans will become memories here.</Muted></Card>}

    <Card>
      <Muted style={s.eyebrow}>{friend ? 'YOU + '+friend.name.toUpperCase() : 'YOUR PEOPLE'}</Muted>
      <H2>{friend?'Shared plans will grow here':'Friends appear after they register'}</H2>
      <Body>{friend?'Wanna will build your shared history automatically.':'Once Benny, Mokya or anyone else creates an account, you can add them to plans.'}</Body>
      {friend&&<View style={s.left}><Button label="Open shared space" kind="soft"/></View>}
    </Card>

    <Card>
      <H2>Circles & privacy</H2>
      <Muted>Circle membership stays private. Availability visibility will be configurable per person, group and circle.</Muted>
    </Card>

    <View style={s.left}><Button label="Sign out" kind="ghost" onPress={()=>void signOut()}/></View>
  </Screen>;
}

function Stat({n,l}:{n:string;l:string}){return <View><Text style={s.n}>{n}</Text><Muted>{l}</Muted></View>}

const s=StyleSheet.create({
  top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  eyebrow:{fontSize:12,fontWeight:'800',letterSpacing:1},
  avatar:{width:68,height:68,borderRadius:34,backgroundColor:'#FFE9E6',alignItems:'center',justifyContent:'center'},
  avatarText:{fontSize:28,fontWeight:'900',color:'#171717'},
  stats:{flexDirection:'row',justifyContent:'space-between'},
  n:{fontSize:25,fontWeight:'900',color:'#171717'},
  heading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  photo:{width:'31%',aspectRatio:1,borderRadius:19,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E6E6E1',alignItems:'center',justifyContent:'center'},
  left:{alignSelf:'flex-start'},
});
