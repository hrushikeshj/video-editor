import { useEffect, useState } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { DragDropContext } from "react-beautiful-dnd";
import { uuid } from './lib/util';
import Button from 'react-bootstrap/Button';
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
  const [timeline, setTimeline] = useState([]);

  const ffmpeg = createFFmpeg({
    log: true,
  });

  useEffect(() => {
    //addVideoToLibrary(rabbit, 'dd');
  }, []);

  /*
  TODO:
    convert to mp4
    store thumbnail and length
  */
  async function addVideoToLibrary(url, title){
    if(!ffmpeg.isLoaded()){
      await ffmpeg.load();
    }
    let file_name = title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-") + '_' + uuid() + '.mp4';
    ffmpeg.FS('writeFile', file_name, await fetchFile(url));

    const output = ffmpeg.FS('readFile', file_name);
    const new_url = URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' }));

    setLibrary(lib => [...lib, {title: title, url: new_url, fileName: file_name}]);
  }

  async function joinVideos(){
    if(!ffmpeg.isLoaded()){
      await ffmpeg.load();
    }

    for(const f of timeline){
      ffmpeg.FS('writeFile', f.fileName, await fetchFile(f.url));
    }

    await ffmpeg.run(...CreateCmd.joinVideos(timeline));

    console.log(CreateCmd.joinVideos(timeline));
    const output = ffmpeg.FS('readFile', 'output.mp4');
    setPreviewSrc(URL.createObjectURL(new Blob([output.buffer], { type: 'video/mp4' })));

    // clean up
    try{
      for(const f of timeline){
        ffmpeg.FS('unlink', f.fileName);
      }
    }
    catch(e){
      console.error(e)
    }
  }

  const addVideoToTimeline = (lib_index, dest_index) => {
    const video = { ...library[lib_index], original: true };
    video.fileName = uuid() + '_' + video.fileName;

    const newTimeline = Array.from(timeline);
    newTimeline.splice(dest_index, 0, video)
    setTimeline(newTimeline);
  }

  const onDragEnd = result => {
    console.log(result);
    const { destination, source, draggableId } = result;

    if(destination === null || source === null){
      console.error("destination or source is null");
      return;
    }

    // no change
    if(
      destination.droppableId === source.droppableId &&
      destination.index == source.index
    ){
        return;
    }

    if(
      (destination.droppableId === 'library' && source.droppableId === 'library') ||
      (source.droppableId === 'timeline' && destination.droppableId === 'library')
    ){
      return;
    }

    // add video to timeline
    if(source.droppableId === 'library' && destination.droppableId === 'timeline'){
      addVideoToTimeline(source.index, destination.index);
      return;
    }

    // re-order timeline
    const newTimeline = Array.from(timeline);
    const vid = newTimeline.splice(source.index, 1);
    newTimeline.splice(destination.index, 0, vid[0])
    setTimeline(newTimeline);
  }

  return (
    <div className="App">

      <DragDropContext onDragEnd={onDragEnd}>
        <div id="library" className="component">
          <Library videos={library} addVideoToLibrary={addVideoToLibrary}/>
        </div>
        <div id="preview" className="component">
          <video src={previewSrc || rabbit} controls></video>
        </div>
        <div id="timeline" className="component">
          <Button className="btn-sm btn-info" onClick={joinVideos}>Join</Button>
          <Timeline videos={timeline}/>
        </div>
      </DragDropContext>
    </div>
  )
}

export default App
