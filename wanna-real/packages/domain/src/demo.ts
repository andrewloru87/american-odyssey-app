import type { DiscoverCard,Plan,UserSummary } from './types';
export const me:UserSummary={id:'00000000-0000-4000-8000-000000000001',name:'Andreas',handle:'@andreas'};
export const benny:UserSummary={id:'00000000-0000-4000-8000-000000000002',name:'Benny',handle:'@benny'};
export const mokya:UserSummary={id:'00000000-0000-4000-8000-000000000003',name:'Mokya',handle:'@mokya'};
export const benni=benny; export const stefan=mokya;
export const demoPlans:Plan[]=[];
export const discoverCards:DiscoverCard[]=[
{id:'10000000-0000-4000-8000-000000000001',title:'Try Shiki',emoji:'🍣',subtitle:'Japanese · Vienna · €€€',category:'FOOD',recommendationScore:94,reason:'You both rate Japanese food highly.',interestedUserIds:[benny.id],place:{id:'shiki',name:'Shiki',address:'Krugerstraße 3, Wien',travelMinutes:18}},
{id:'10000000-0000-4000-8000-000000000002',title:'Bowling night',emoji:'🎳',subtitle:'Activity · 2–4 people',category:'ACTIVITY',recommendationScore:88,reason:'Three friends have similar activity preferences.',interestedUserIds:[benny.id,mokya.id]},
{id:'10000000-0000-4000-8000-000000000003',title:'Schneeberg day trip',emoji:'🏔️',subtitle:'Outdoor · full day',category:'OUTDOOR',recommendationScore:84,reason:'Saved before and matches your weekend preferences.',interestedUserIds:[mokya.id]}
];
