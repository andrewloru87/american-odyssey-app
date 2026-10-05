export interface CalendarBusySlot{startsAt:string;endsAt:string}
export interface CalendarAdapter{requestPermission():Promise<boolean>;getBusySlots(range:{startsAt:string;endsAt:string}):Promise<CalendarBusySlot[]>;createConfirmedPlan(input:{title:string;startsAt:string;endsAt?:string;location?:string;notes?:string}):Promise<string>}
export const demoCalendarAdapter:CalendarAdapter={async requestPermission(){return true},async getBusySlots(){return []},async createConfirmedPlan(){return `demo-${Date.now()}`}};
