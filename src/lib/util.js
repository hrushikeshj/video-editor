export function uuid(){
  return crypto.randomUUID().split('-')[0];
}
