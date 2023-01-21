export function uuid(){
  return crypto.randomUUID().split('-')[0];
}

export function readableDuration(sec){
  const r_sec = Math.round(sec);
  return `${Math.floor(r_sec/60)}:${r_sec%60}`; 
}