import { createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode } from 'react';
import { discoverCards,type Plan,type PlanCategory,type PlanStatus,type UserSummary,type VoteValue } from '@wanna/domain';
import { isSupabaseConfigured,supabase } from '../lib/supabase';

type DiscoverDecision='PASS'|'SAVE'|'WANNA';
type CreatePlanInput={title:string;emoji?:string;participantIds?:string[];startsAt?:string;endsAt?:string;sourceDiscoverItemId?:string};

type WannaStoreValue={
  ready:boolean;
  backendError:string|null;
  currentUser:UserSummary|null;
  people:UserSummary[];
  plans:Plan[];
  discoverDecisions:Record<string,DiscoverDecision>;
  getPlan(id:string):Plan|undefined;
  signInWithEmail(email:string,password:string):Promise<void>;
  signUpWithEmail(email:string,password:string,name?:string):Promise<'ok'|'confirm_email'>;
  signOut():Promise<void>;
  chooseDiscover(itemId:string,decision:DiscoverDecision):void;
  createPlan(input:CreatePlanInput):Promise<Plan>;
  vote(planId:string,optionId:string,vote:VoteValue):Promise<void>;
  markReady(planId:string,optionId?:string):Promise<void>;
  confirmPlan(planId:string,optionId?:string):Promise<void>;
  setPlanStatus(planId:string,status:PlanStatus):Promise<void>;
  refresh():Promise<void>;
};

const WannaStore=createContext<WannaStoreValue|null>(null);

const PLAN_SELECT=`id,title,emoji,category,status,organizer_id,confirmed_starts_at,confirmed_ends_at,created_at,
plan_members(user_id,role,profiles(id,handle,display_name,avatar_url)),
plan_time_options(id,starts_at,ends_at,created_by,plan_time_votes(user_id,vote))`;

function toUser(row:any):UserSummary{
  return{
    id:row.id,
    name:row.display_name,
    handle:row.handle?.startsWith('@')?row.handle:'@'+row.handle,
    avatar:row.avatar_url??undefined,
  };
}

function toPlan(row:any):Plan{
  const participants=(row.plan_members??[])
    .map((m:any)=>m.profiles?toUser(m.profiles):undefined)
    .filter(Boolean) as UserSummary[];

  const timeOptions=(row.plan_time_options??[]).map((o:any)=>({
    id:o.id,
    startsAt:o.starts_at,
    endsAt:o.ends_at??undefined,
    votes:Object.fromEntries((o.plan_time_votes??[]).map((v:any)=>[v.user_id,v.vote])),
  }));

  return{
    id:row.id,
    title:row.title,
    emoji:row.emoji??'✨',
    mode:'SIMPLE',
    category:row.category,
    status:row.status,
    organizerId:row.organizer_id,
    participants,
    timeOptions,
    confirmedStartsAt:row.confirmed_starts_at??undefined,
    confirmedEndsAt:row.confirmed_ends_at??undefined,
  };
}

export function WannaProvider({children}:{children:ReactNode}){
  const [ready,setReady]=useState(false);
  const [backendError,setBackendError]=useState<string|null>(null);
  const [currentUser,setCurrentUser]=useState<UserSummary|null>(null);
  const [people,setPeople]=useState<UserSummary[]>([]);
  const [plans,setPlans]=useState<Plan[]>([]);
  const [discoverDecisions,setDiscoverDecisions]=useState<Record<string,DiscoverDecision>>({});

  const loadIdentity=useCallback(async(userId?:string)=>{
    if(!isSupabaseConfigured){setCurrentUser(null);return null}
    const id=userId??(await supabase.auth.getUser()).data.user?.id;
    if(!id){setCurrentUser(null);return null}
    const {data,error}=await supabase.from('profiles').select('id,handle,display_name,avatar_url').eq('id',id).single();
    if(error)throw error;
    const profile=toUser(data);
    setCurrentUser(profile);
    return profile;
  },[]);

  const loadPeople=useCallback(async()=>{
    if(!isSupabaseConfigured)return[];
    const {data,error}=await supabase.from('profiles').select('id,handle,display_name,avatar_url').order('display_name');
    if(error)throw error;
    const next=(data??[]).map(toUser);
    setPeople(next);
    return next;
  },[]);

  const loadPlans=useCallback(async()=>{
    if(!isSupabaseConfigured)return[];
    const {data,error}=await supabase.from('plans').select(PLAN_SELECT).order('created_at',{ascending:false});
    if(error)throw error;
    const next=(data??[]).map(toPlan);
    setPlans(next);
    return next;
  },[]);

  const hydrate=useCallback(async(userId?:string)=>{
    const profile=await loadIdentity(userId);
    if(profile)await Promise.all([loadPeople(),loadPlans()]);
    else{setPeople([]);setPlans([])}
  },[loadIdentity,loadPeople,loadPlans]);

  useEffect(()=>{
    let cancelled=false;

    (async()=>{
      try{
        if(!isSupabaseConfigured)throw new Error('Supabase environment variables are missing.');
        const {data}=await supabase.auth.getSession();
        if(data.session?.user)await hydrate(data.session.user.id);
      }catch(error:any){
        if(!cancelled)setBackendError(error?.message??'Could not connect to Wanna.');
      }finally{
        if(!cancelled)setReady(true);
      }
    })();

    const {data:sub}=supabase.auth.onAuthStateChange((_event,session)=>{
      setBackendError(null);
      void hydrate(session?.user?.id);
    });

    return()=>{cancelled=true;sub.subscription.unsubscribe()};
  },[hydrate]);

  useEffect(()=>{
    if(!currentUser)return;

    const reloadPlans=()=>void loadPlans();
    const reloadPeople=()=>void loadPeople();

    const channel=supabase.channel('wanna-live-'+currentUser.id)
      .on('postgres_changes',{event:'*',schema:'public',table:'plans'},reloadPlans)
      .on('postgres_changes',{event:'*',schema:'public',table:'plan_members'},reloadPlans)
      .on('postgres_changes',{event:'*',schema:'public',table:'plan_time_options'},reloadPlans)
      .on('postgres_changes',{event:'*',schema:'public',table:'plan_time_votes'},reloadPlans)
      .on('postgres_changes',{event:'*',schema:'public',table:'profiles'},reloadPeople)
      .subscribe();

    return()=>{void supabase.removeChannel(channel)};
  },[currentUser,loadPeople,loadPlans]);

  const signInWithEmail=useCallback(async(email:string,password:string)=>{
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error)throw error;
  },[]);

  const signUpWithEmail=useCallback(async(email:string,password:string,name?:string):Promise<'ok'|'confirm_email'>=>{
    const redirectTo=typeof window!=='undefined'?window.location.origin:undefined;
    const options:any={};
    if(name)options.data={full_name:name};
    if(redirectTo)options.emailRedirectTo=redirectTo;

    const {data,error}=await supabase.auth.signUp({email,password,options});
    if(error)throw error;
    return data.session?'ok':'confirm_email';
  },[]);

  const signOut=useCallback(async()=>{
    await supabase.auth.signOut();
    setCurrentUser(null);
    setPeople([]);
    setPlans([]);
  },[]);

  const refresh=useCallback(async()=>{
    if(currentUser)await Promise.all([loadPeople(),loadPlans()]);
  },[currentUser,loadPeople,loadPlans]);

  const chooseDiscover=useCallback((itemId:string,decision:DiscoverDecision)=>{
    setDiscoverDecisions(c=>({...c,[itemId]:decision}));
    if(!currentUser)return;
    void supabase.from('discover_swipes').upsert({
      item_id:itemId,
      user_id:currentUser.id,
      decision,
    },{onConflict:'item_id,user_id'});
  },[currentUser]);

  const createPlan=useCallback(async(input:CreatePlanInput):Promise<Plan>=>{
    if(!currentUser)throw new Error('Sign in first.');
    const source=input.sourceDiscoverItemId?discoverCards.find(c=>c.id===input.sourceDiscoverItemId):undefined;

    const {data,error}=await supabase.rpc('create_plan',{
      p_title:input.title.trim(),
      p_emoji:input.emoji??source?.emoji??'✨',
      p_category:(source?.category??'OTHER') as PlanCategory,
      p_participant_ids:input.participantIds??[],
      p_starts_at:input.startsAt??null,
      p_ends_at:input.endsAt??null,
    });
    if(error)throw error;

    const {data:row,error:e}=await supabase.from('plans').select(PLAN_SELECT).eq('id',data).single();
    if(e)throw e;

    const plan=toPlan(row);
    setPlans(c=>[plan,...c.filter(x=>x.id!==plan.id)]);
    return plan;
  },[currentUser]);

  const vote=useCallback(async(_planId:string,optionId:string,voteValue:VoteValue)=>{
    if(!currentUser)return;

    const {error}=await supabase.from('plan_time_votes').upsert({
      option_id:optionId,
      user_id:currentUser.id,
      vote:voteValue,
      updated_at:new Date().toISOString(),
    },{onConflict:'option_id,user_id'});

    if(error)throw error;
    await loadPlans();
  },[currentUser,loadPlans]);

  const updatePlanStatus=useCallback(async(planId:string,status:PlanStatus,optionId?:string)=>{
    const plan=plans.find(p=>p.id===planId);
    const option=plan?.timeOptions.find(o=>o.id===optionId)??plan?.timeOptions[0];
    const patch:Record<string,any>={status,updated_at:new Date().toISOString()};

    if(status==='READY_TO_CONFIRM'||status==='CONFIRMED'){
      patch.confirmed_starts_at=option?.startsAt??plan?.confirmedStartsAt??null;
      patch.confirmed_ends_at=option?.endsAt??plan?.confirmedEndsAt??null;
    }

    const {error}=await supabase.from('plans').update(patch).eq('id',planId);
    if(error)throw error;
    await loadPlans();
  },[loadPlans,plans]);

  const value=useMemo<WannaStoreValue>(()=>({
    ready,
    backendError,
    currentUser,
    people,
    plans,
    discoverDecisions,
    getPlan:(id)=>plans.find(p=>p.id===id),
    signInWithEmail,
    signUpWithEmail,
    signOut,
    chooseDiscover,
    createPlan,
    vote,
    markReady:(planId,optionId)=>updatePlanStatus(planId,'READY_TO_CONFIRM',optionId),
    confirmPlan:(planId,optionId)=>updatePlanStatus(planId,'CONFIRMED',optionId),
    setPlanStatus:(planId,status)=>updatePlanStatus(planId,status),
    refresh,
  }),[
    ready,backendError,currentUser,people,plans,discoverDecisions,
    signInWithEmail,signUpWithEmail,signOut,chooseDiscover,createPlan,vote,
    updatePlanStatus,refresh,
  ]);

  return <WannaStore.Provider value={value}>{children}</WannaStore.Provider>;
}

export function useWanna(){
  const value=useContext(WannaStore);
  if(!value)throw new Error('useWanna must be used inside WannaProvider');
  return value;
}
