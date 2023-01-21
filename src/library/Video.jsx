import {useEffect, useState} from 'react';
import { Draggable } from "react-beautiful-dnd";
import { readableDuration } from '../lib/util'

function Video({video: {title, url, fileName, thumbnail, duration}, bg='100%', index, preview}){
  return (
    <Draggable draggableId={'lib'+fileName} index={index}>
    {provided =>(
      <div ref={provided.innerRef} className="lib-video" onClick={preview}
        {...provided.draggableProps} {...provided.dragHandleProps} 
      >
        <div 
          style={{
            backgroundImage: `url("${thumbnail}")`,
            backgroundSize: bg, 
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        >
          <span className='text-white text-sm-start mx-2'>{title.length > 20 ? title.slice(0, 20) + '...' : title}</span>
          <span
            className='text-white'
            style={{
              position: 'absolute',
              bottom: '2px',
              left: '3px'
            }}
          >
            <i className="bi bi-film text-white"/> {readableDuration(duration)}
          </span>

          <span
            className='text-white'
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%)`,
              fontSize: '25px'
            }}
          >
            <i className="bi bi-play text-white"/>
          </span>
        </div>
      </div>
    )}
    </Draggable>
  );
}

export default Video;
