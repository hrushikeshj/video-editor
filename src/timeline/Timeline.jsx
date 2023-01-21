import { useState, useEffect } from 'react';
import './Timeline.css'
import { Droppable } from "react-beautiful-dnd";
import Button from 'react-bootstrap/Button';
import VideoThumbnail from './VideoThumbnail'

function Timeline({videos, joinVideos, removeVideo}){
  const [selectedVideo, setSelectedVideo] = useState(null);

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
          <Button className="btn-sm btn-info" onClick={joinVideos}>Join</Button>

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
