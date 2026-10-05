import type { DiscoverCard } from './types';
export function matchCount(card:DiscoverCard,currentUserId:string){return card.interestedUserIds.filter(id=>id!==currentUserId).length}
export function isMatch(card:DiscoverCard,currentUserId:string){return card.interestedUserIds.includes(currentUserId)&&matchCount(card,currentUserId)>0}
export function explainMatch(card:DiscoverCard,names:string[]){if(!names.length)return card.reason;if(names.length===1)return `${names[0]} wants to do this too.`;return `${names.length} friends want to do this too.`}
