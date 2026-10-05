import type { PlanStatus } from './types';
const allowed:Record<PlanStatus,PlanStatus[]>={IDEA:['PROPOSED','ARCHIVED'],PROPOSED:['PLANNING','DECLINED','CANCELLED'],PLANNING:['READY_TO_CONFIRM','DECLINED','CANCELLED'],READY_TO_CONFIRM:['CONFIRMED','PLANNING','CANCELLED'],CONFIRMED:['PLANNING','COMPLETED','CANCELLED'],COMPLETED:['MEMORY','ARCHIVED'],MEMORY:['ARCHIVED'],DECLINED:['ARCHIVED'],CANCELLED:['ARCHIVED'],ARCHIVED:[]};
export function canTransition(from:PlanStatus,to:PlanStatus){return allowed[from].includes(to)}
export function requiresReconfirmation(change:{dateChanged?:boolean;timeChanged?:boolean;placeChanged?:boolean;participantsChanged?:boolean}){return Boolean(change.dateChanged||change.timeChanged||change.placeChanged||change.participantsChanged)}
