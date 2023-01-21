import CreateCmd from './create_cmd'
import { fetchFile } from '@ffmpeg/ffmpeg';

export function uuid(){
  return crypto.randomUUID().split('-')[0];
}

export function readableDuration(sec){
  const r_sec = Math.round(sec);
  return `${Math.floor(r_sec/60)}:${r_sec%60}`; 
}

export async function joinVideos(ffmpeg, timeline){
  if(!ffmpeg.isLoaded()){
    await ffmpeg.load();
  }

  for(const f of timeline){
    ffmpeg.FS('writeFile', f.fileName, await fetchFile(f.url));
  }

  await ffmpeg.runWithLock(...CreateCmd.joinVideos(timeline));

  console.log(CreateCmd.joinVideos(timeline));
  const output = ffmpeg.FS('readFile', 'output.mp4');

  // clean up
  try{
    for(const f of timeline){
      ffmpeg.FS('unlink', f.fileName);
    }
  }
  catch(e){
    console.error(e)
  }

  return URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' }));
}