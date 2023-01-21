import { useState, useEffect } from 'react';
import { joinVideos } from '../lib/util'
import './Timeline.css'
import { Droppable } from "react-beautiful-dnd";
import Button from 'react-bootstrap/Button';
import VideoThumbnail from './VideoThumbnail'

function Timeline({videos, removeVideo, setModalUrl, setModalShow, ffmpeg, setPreviewSrc}){
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [progress, setProgress] = useState({});
  const [running, setRunning] = useState(false);

  ffmpeg.setProgress(setProgress)
  ffmpeg.runWithLock = async function(...cmd){
    setRunning(true);
    await this.run(...cmd);
    setRunning(false);
  }

  const join = async () => {
    const out_url = await joinVideos(ffmpeg, videos);
    setPreviewSrc(out_url);
  }


  // B-DnD fix in StrictMode
  const [ enabled, setEnabled ] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
       cancelAnimationFrame(animation);
       setEnabled(false);
    };
  }, []);

  if (!enabled) {
      return null;
  }
  // end hack

  return (
    <div>
      <div className="grid-center my-2">
        <div className='options'>
          <span className={running ? 'text-white' : ''}>{JSON.stringify(progress)}</span>
          <Button className="btn-sm btn-info" onClick={join}>Join</Button>

          <Button
              className='bg-transparent video-option'
              disabled={selectedVideo === null}
              onClick={() => {
                setModalShow(true);
                setModalUrl(videos.find(v => v.fileName == selectedVideo).url);
              }}
            >
              <i className="bi bi-eye text-white"></i> Preview
            </Button>

          <div className='divider'>
            <Button
              className='bg-transparent video-option'
              disabled={selectedVideo === null}
              onClick={() => {
                removeVideo(selectedVideo);
                setSelectedVideo(null);
              }}
            >
              <i className="bi bi-trash3 text-white"></i>
            </Button>
          </div>
          
        </div>
      </div>
      <Droppable droppableId="timeline" direction="horizontal">
        {provided => (
          <div className='storyboard px-2 ' ref={provided.innerRef} {...provided.droppableProps}>
            {videos.map((v, i) => <VideoThumbnail 
                                    select={() => setSelectedVideo(v.fileName)}
                                    selected={selectedVideo === v.fileName} 
                                    video={v} 
                                    bg="cover" 
                                    key={v.fileName} 
                                    index={i}
                                  />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Timeline;
