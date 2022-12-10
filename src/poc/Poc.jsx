import Card from "./Card"
import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

import earth_480x270 from '../assets/videos/earth_480x270.mp4'
import rabbit from '../assets/videos/480x360/rabbit.mp4'

import CreateCmd from '../lib/create_cmd'
window.cc = CreateCmd;


function Poc(){
  const [btnMsg, setBtnMsg] = useState("Trim and Join");
  const [disableBtn, setDisableBtn] = useState(false);
  const [outSrc, setOutSrc] = useState();
  const ffmpeg = createFFmpeg({
    log: true,
  });

  const joinVideo = async () => {
    setDisableBtn(true);

    if(!ffmpeg.isLoaded()){
      setBtnMsg("Loading ffmpeg");
      await ffmpeg.load();
    }

    setBtnMsg('Load Files');
    ffmpeg.FS('writeFile', 'earth_in.mp4', await fetchFile(earth_480x270));
    ffmpeg.FS('writeFile', 'rabbit.mp4', await fetchFile(rabbit));

    setBtnMsg('Triming video 1')
    await ffmpeg.run("-y", "-i", "earth_in.mp4", "-t", "3", "earth.mp4");

    setBtnMsg('Joining!')
    await ffmpeg.run("-vsync", "2", '-i', 'earth.mp4', '-i', 'rabbit.mp4', "-filter_complex", 
                    "[0]scale=480:360:force_original_aspect_ratio=decrease,pad=480:360:(ow-iw)/2:(oh-ih)/2,setsar=1[v0];[1]scale=480:360:force_original_aspect_ratio=decrease,pad=480:360:(ow-iw)/2:(oh-ih)/2,setsar=1[v1];[v0][0:a][v1][1:a]concat=n=2:v=1:a=1[v]",
                    "-map", "[v]", "output.mp4");
    
    const output = ffmpeg.FS('readFile', 'output.mp4');
    setOutSrc(URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' })));
    setBtnMsg('Complete!');

    ffmpeg.FS('unlink', 'earth_in.mp4');
    ffmpeg.FS('unlink', 'rabbit.mp4');
    ffmpeg.FS('unlink', 'output.mp4');
    setDisableBtn(false);
  }

  return (
    <div className="poc mt-3">
      <div className="grid grid-cols-3 gap-4">
        <Card title="Src 1">
          <video src={earth_480x270} controls></video>
        </Card>
        <Card title="Src 2">
          <video src={rabbit} controls></video>
        </Card>
        <Card title="Output Src 1">
          {
            outSrc ? <video src={outSrc} controls></video> : 'out'
          }
        </Card>
      </div>

      <div className="flex flex-col items-center mt-3">
        <button className="btn" disabled={disableBtn} onClick={joinVideo}>{btnMsg}</button>
      </div>
    </div>
  );

}

export default Poc;
