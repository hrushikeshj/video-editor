import {useEffect, useState} from 'react';
import { Draggable } from "react-beautiful-dnd";
import { readableDuration } from '../lib/util'
function VideoThumbnail(
  {video: {title, url, fileName, thumbnail, duration}, bg='100%', index, select, selected}
  ){

  return (
    <Draggable draggableId={fileName} index={index}>
      {provided => (
        <div ref={provided.innerRef} onClick={select}
          {...provided.draggableProps} {...provided.dragHandleProps} 
          className="thumbnail-warpper" select={selected ? 'true' : 'false'} hjhj="dd"
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
            <span className='text-white'>{title}</span>
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
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default VideoThumbnail;
