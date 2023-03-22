import { fetchFile } from '@ffmpeg/ffmpeg';
import CreateCmd from './create_cmd'

export function uuid(){
  return crypto.randomUUID().split('-')[0];
}

export function readableDuration(sec){
  const r_sec = Math.round(sec);
  return `${Math.floor(r_sec/60)}:${r_sec%60}`; 
}

export function  releaseUrl(url, org) {
  if(org) return;

  URL.revokeObjectURL(url);
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

  const out_url = URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' }));

  // clean up
  try{
    for(const f of timeline){
      ffmpeg.FS('unlink', f.fileName);
    }
    ffmpeg.FS('unlink', 'output.mp4');
  }
  catch(e){
    console.error(e)
  }

  return out_url;
}

export async function trimVideo(ffmpeg, url, file_name, ss, t){
  if(!ffmpeg.isLoaded()){
    await ffmpeg.load();
  }

  ffmpeg.FS('writeFile', file_name, await fetchFile(url));

  await ffmpeg.runWithLock("-i", file_name, "-t", t.toString(), "-ss", ss.toString(), "output.mp4");
  const output = ffmpeg.FS('readFile', 'output.mp4');
  const out_url = URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' }));

  try{
    ffmpeg.FS('unlink', 'output.mp4');
    ffmpeg.FS('unlink', file_name);
  }
  catch(e){
    console.error(e)
  }

  return out_url;
}
