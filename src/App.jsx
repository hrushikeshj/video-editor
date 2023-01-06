import { useEffect, useState } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';
import Library from './library/Library';
import Timeline from './timeline/Timeline';

import earth_480x270 from './assets/videos/earth_480x270.mp4'
import rabbit from './assets/videos/480x360/rabbit.mp4'
import CreateCmd from './lib/create_cmd'

function App() {
  const [count, setCount] = useState(0);
  const [previewSrc, setPreviewSrc] = useState();
  const [library, setLibrary] = useState([
    {
      title: 'earth',
      url: earth_480x270,
      fileName: 'earth.mp4'
    },
    {
      title: 'rabbit',
      url: rabbit,
      fileName: 'rabbit.mp4'
    }
  ]); // for testing

  const ffmpeg = createFFmpeg({
    log: true,
  });

  /*
  TODO:
    convert to mp4
    convert to "createObjectURL"
  */
  function addVideoToLibrary(url, title){
    let file_name = title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-") + '_' + crypto.randomUUID().split('-')[0] + '.mp4';
    //ffmpeg.FS('writeFile', file_name, await fetchFile(url));
    setLibrary(lib => [...lib, {title: title, url: url, fileName: file_name}]);
  }

  async function joinVideos(){
    if(!ffmpeg.isLoaded()){
      await ffmpeg.load();
    }

    for(const f of library){
      ffmpeg.FS('writeFile', f.fileName, await fetchFile(f.url));
    }

    await ffmpeg.run(...CreateCmd.joinVideos(library));

    console.log(CreateCmd.joinVideos(library));
    const output = ffmpeg.FS('readFile', 'output.mp4');
    setPreviewSrc(URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' })));

    // clean up
    try{
      for(const f of library){
        ffmpeg.FS('unlink', f.fileName);
      }
    }
    catch(e){
      console.log(e)
    }
  }

  return (
    <div className="App">
      <div id="library" className="component">
        <Library videos={library}/>
      </div>
      <div id="preview" className="component">
        <video src={previewSrc || rabbit} controls></video>
      </div>
      <div id="timeline" onClick={joinVideos} className="component">
        <Timeline videos={library}/>
      </div>
    </div>
  )
}

export default App
