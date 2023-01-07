import {useEffect, useState} from 'react';
import { Draggable } from "react-beautiful-dnd";
import generateVideoThumbnail from '../lib/thumbnail'

function VideoThumbnail({video: {title, url, fileName}, bg='100%', index}){
  const [thumbnail, setThumbnail] = useState();

  useEffect(() => {
    generateVideoThumbnail(url).then(s => setThumbnail(s));
  }, []);

  return (
    <Draggable draggableId={fileName} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}
          index={index} {...provided.dragHandleProps} 
          className="thumbnail-cont"
        >
          <div 
            style={{
              backgroundImage: `url("${thumbnail}")`,
              backgroundSize: bg, 
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100%'
            }}
          >
            <span className='text-white'>{title}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default VideoThumbnail;
