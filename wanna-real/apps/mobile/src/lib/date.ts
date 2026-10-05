export function shortDate(iso:string){return new Intl.DateTimeFormat('en',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(iso))}
