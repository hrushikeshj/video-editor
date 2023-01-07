import React, { useState, useEffect } from 'react';
import './Timeline.css'
import { Droppable } from "react-beautiful-dnd";
import VideoThumbnail from './VideoThumbnail'

function Timeline({videos}){

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
    <div className='m-4'>
      <div style={{height: '80px'}}></div>
      <Droppable droppableId="timeline" direction="horizontal">
        {provided => (
          <div className='storyboard ml-4' ref={provided.innerRef} {...provided.droppableProps}>
            {videos.map((v, i) => <VideoThumbnail video={v} bg="cover" key={v.fileName} index={i}/>)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Timeline;
