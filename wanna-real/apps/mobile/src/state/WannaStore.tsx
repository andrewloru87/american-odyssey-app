import { createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode } from 'react';
import { demoPlans,discoverCards,me,benny,mokya,type Plan,type PlanCategory,type PlanStatus,type UserSummary,type VoteValue } from '@wanna/domain';
import { isSupabaseConfigured,supabase } from '../lib/supabase';

type DiscoverDecision='PASS'|'SAVE'|'WANNA';
type CreatePlanInput={title:string;emoji?:string;participantIds?:string[];startsAt?:string;endsAt?:string;sourceDiscoverItemId?:string};
type WannaStoreValue={
 ready:boolean;backendError:string|null;currentUser:UserSummary|null;people:UserSummary[];plans:Plan[];discoverDecisions:Record<string,DiscoverDecision>;
 getPlan(id:string):Plan|undefined;claimProfile(handle:string):Promise<void>;chooseDiscover(itemId:string,decision:DiscoverDecision):void;
 createPlan(input:CreatePlanInput):Promise<Plan>;vote(planId:string,optionId:string,vote:VoteValue):Promise<void>;
 markReady(planId:string,optionId?:string):Promise<void>;confirmPlan(planId:string,optionId?:string):Promise<void>;
 setPlanStatus(planId:string,status:PlanStatus):Promise<void>;refresh():Promise<void>;
};
const WannaStore=createContext<WannaStoreValue|null>(null);
const FALLBACK_PEOPLE=[me,benny,mokya];
const PLAN_SELECT=`id,title,emoji,category,status,organizer_id,confirmed_starts_at,confirmed_ends_at,created_at,
plan_members(user_id,role,profiles(id,handle,display_name,avatar_url)),
plan_time_options(id,starts_at,ends_at,created_by,plan_time_votes(user_id,vote))`;

function toUser(row:any):UserSummary{return{id:row.id,name:row.display_name,handle:row.handle?.startsWith('@')?row.handle:`@${row.handle}`,avatar:row.avatar_url??undefined}}
function toPlan(row:any):Plan{
 const participants=(row.plan_members??[]).map((m:any)=>m.profiles?toUser(m.profiles):undefined).filter(Boolean) as UserSummary[];
 const timeOptions=(row.plan_time_options??[]).map((o:any)=>({id:o.id,startsAt:o.starts_at,endsAt:o.ends_at??undefined,votes:Object.fromEntries((o.plan_time_votes??[]).map((v:any)=>[v.user_id,v.vote]))}));
 return{id:row.id,title:row.title,emoji:row.emoji??'✨',mode:'SIMPLE',category:row.category,status:row.status,organizerId:row.organizer_id,
 participants,timeOptions,confirmedStartsAt:row.confirmed_starts_at??undefined,confirmedEndsAt:row.confirmed_ends_at??undefined};
}

export function WannaProvider({children}:{children:ReactNode}){
 const [ready,setReady]=useState(false);const [backendError,setBackendError]=useState<string|null>(null);const [currentUser,setCurrentUser]=useState<UserSummary|null>(null);
 const [people,setPeople]=useState<UserSummary[]>(FALLBACK_PEOPLE);const [plans,setPlans]=useState<Plan[]>(isSupabaseConfigured?[]:demoPlans);
 const [discoverDecisions,setDiscoverDecisions]=useState<Record<string,DiscoverDecision>>({});

 const ensureSession=useCallback(async()=>{if(!isSupabaseConfigured)return null;const {data:s}=await supabase.auth.getSession();if(s.session?.user)return s.session.user;const {data,error}=await supabase.auth.signInAnonymously();if(error)throw error;if(!data.user)throw new Error('Could not create a beta session.');return data.user},[]);
 const loadPeople=useCallback(async()=>{if(!isSupabaseConfigured)return FALLBACK_PEOPLE;const {data,error}=await supabase.from('profiles').select('id,handle,display_name,avatar_url').order('display_name');if(error)throw error;const next=(data??[]).map(toUser);setPeople(next);return next},[]);
 const loadIdentity=useCallback(async(userId?:string)=>{if(!isSupabaseConfigured){setCurrentUser(me);return me}const user=userId?{id:userId}:await ensureSession();if(!user)return null;
  const {data,error}=await supabase.from('beta_devices').select('profile_id').eq('auth_user_id',user.id).maybeSingle();if(error)throw error;
  if(!data?.profile_id){setCurrentUser(null);return null}
  const {data:row,error:e}=await supabase.from('profiles').select('id,handle,display_name,avatar_url').eq('id',data.profile_id).single();if(e)throw e;const profile=toUser(row);setCurrentUser(profile);return profile;
 },[ensureSession]);
 const loadPlans=useCallback(async()=>{if(!isSupabaseConfigured){setPlans(demoPlans);return demoPlans}const {data,error}=await supabase.from('plans').select(PLAN_SELECT).order('created_at',{ascending:false});if(error)throw error;const next=(data??[]).map(toPlan);setPlans(next);return next},[]);
 const refresh=useCallback(async()=>{if(!currentUser&&isSupabaseConfigured)return;await loadPlans()},[currentUser,loadPlans]);

 useEffect(()=>{let cancelled=false;(async()=>{try{if(!isSupabaseConfigured){if(!cancelled){setBackendError('Supabase environment variables are missing.');setReady(true)}return}
   const user=await ensureSession();await loadPeople();const identity=await loadIdentity(user?.id);if(identity)await loadPlans();
  }catch(error:any){if(!cancelled)setBackendError(error?.message??'Could not connect to Wanna Cloud.')}finally{if(!cancelled)setReady(true)}})();return()=>{cancelled=true}},[ensureSession,loadIdentity,loadPeople,loadPlans]);

 useEffect(()=>{if(!isSupabaseConfigured||!currentUser)return;const reload=()=>{void loadPlans()};const channel=supabase.channel(`wanna-plans-${currentUser.id}`)
  .on('postgres_changes',{event:'*',schema:'public',table:'plans'},reload).on('postgres_changes',{event:'*',schema:'public',table:'plan_members'},reload)
  .on('postgres_changes',{event:'*',schema:'public',table:'plan_time_options'},reload).on('postgres_changes',{event:'*',schema:'public',table:'plan_time_votes'},reload).subscribe();
  return()=>{void supabase.removeChannel(channel)}},[currentUser,loadPlans]);

 const claimProfile=useCallback(async(handle:string)=>{setBackendError(null);if(!isSupabaseConfigured)return;const {error}=await supabase.rpc('claim_beta_profile',{p_handle:handle});if(error){setBackendError(error.message);return}const identity=await loadIdentity();if(identity)await loadPlans()},[loadIdentity,loadPlans]);
 const chooseDiscover=useCallback((itemId:string,decision:DiscoverDecision)=>{setDiscoverDecisions(c=>({...c,[itemId]:decision}));if(!isSupabaseConfigured||!currentUser)return;void supabase.from('discover_swipes').upsert({item_id:itemId,user_id:currentUser.id,decision},{onConflict:'item_id,user_id'})},[currentUser]);

 const createPlan=useCallback(async(input:CreatePlanInput):Promise<Plan>=>{if(!currentUser)throw new Error('Choose your beta profile first.');
  if(!isSupabaseConfigured){const source=input.sourceDiscoverItemId?discoverCards.find(c=>c.id===input.sourceDiscoverItemId):undefined;const ids=new Set([currentUser.id,...(input.participantIds??[])]);const plan:Plan={id:`plan-${Date.now()}`,title:input.title.trim(),emoji:input.emoji??source?.emoji??'✨',mode:'SIMPLE',category:source?.category??'OTHER',status:input.startsAt?'PLANNING':'IDEA',organizerId:currentUser.id,participants:people.filter(p=>ids.has(p.id)),timeOptions:input.startsAt?[{id:`time-${Date.now()}`,startsAt:input.startsAt,endsAt:input.endsAt,votes:{[currentUser.id]:'YES'}}]:[]};setPlans(c=>[plan,...c]);return plan}
  const source=input.sourceDiscoverItemId?discoverCards.find(c=>c.id===input.sourceDiscoverItemId):undefined;const {data,error}=await supabase.rpc('create_plan',{p_title:input.title.trim(),p_emoji:input.emoji??source?.emoji??'✨',p_category:(source?.category??'OTHER') as PlanCategory,p_participant_ids:input.participantIds??[],p_starts_at:input.startsAt??null,p_ends_at:input.endsAt??null});if(error)throw error;
  const {data:row,error:e}=await supabase.from('plans').select(PLAN_SELECT).eq('id',data).single();if(e)throw e;const plan=toPlan(row);setPlans(c=>[plan,...c.filter(x=>x.id!==plan.id)]);return plan;
 },[currentUser,people]);

 const vote=useCallback(async(planId:string,optionId:string,voteValue:VoteValue)=>{if(!currentUser)return;if(!isSupabaseConfigured){setPlans(c=>c.map(p=>p.id===planId?{...p,timeOptions:p.timeOptions.map(o=>o.id===optionId?{...o,votes:{...o.votes,[currentUser.id]:voteValue}}:o)}:p));return}
  const {error}=await supabase.from('plan_time_votes').upsert({option_id:optionId,user_id:currentUser.id,vote:voteValue,updated_at:new Date().toISOString()},{onConflict:'option_id,user_id'});if(error)throw error;await loadPlans();
 },[currentUser,loadPlans]);

 const updatePlanStatus=useCallback(async(planId:string,status:PlanStatus,optionId?:string)=>{const plan=plans.find(p=>p.id===planId);const option=plan?.timeOptions.find(o=>o.id===optionId)??plan?.timeOptions[0];if(!isSupabaseConfigured){setPlans(c=>c.map(p=>p.id===planId?{...p,status,confirmedStartsAt:option?.startsAt??p.confirmedStartsAt,confirmedEndsAt:option?.endsAt??p.confirmedEndsAt}:p));return}
  const patch:Record<string,any>={status,updated_at:new Date().toISOString()};if(status==='READY_TO_CONFIRM'||status==='CONFIRMED'){patch.confirmed_starts_at=option?.startsAt??plan?.confirmedStartsAt??null;patch.confirmed_ends_at=option?.endsAt??plan?.confirmedEndsAt??null}
  const {error}=await supabase.from('plans').update(patch).eq('id',planId);if(error)throw error;await loadPlans();
 },[loadPlans,plans]);

 const value=useMemo<WannaStoreValue>(()=>({ready,backendError,currentUser,people,plans,discoverDecisions,getPlan:(id)=>plans.find(p=>p.id===id),claimProfile,chooseDiscover,createPlan,vote,
  markReady:(planId,optionId)=>updatePlanStatus(planId,'READY_TO_CONFIRM',optionId),confirmPlan:(planId,optionId)=>updatePlanStatus(planId,'CONFIRMED',optionId),setPlanStatus:(planId,status)=>updatePlanStatus(planId,status),refresh
 }),[backendError,claimProfile,chooseDiscover,createPlan,currentUser,discoverDecisions,people,plans,ready,refresh,updatePlanStatus,vote]);
 return <WannaStore.Provider value={value}>{children}</WannaStore.Provider>;
}
export function useWanna(){const value=useContext(WannaStore);if(!value)throw new Error('useWanna must be used inside WannaProvider');return value}
