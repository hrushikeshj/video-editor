import {useEffect, useState} from 'react';
import { Draggable } from "react-beautiful-dnd";
import generateVideoThumbnail from '../lib/thumbnail'

function Video({video: {title, url, fileName}, bg='100%', index, preview}){
  const [thumbnail, setThumbnail] = useState();

  useEffect(() => {
    generateVideoThumbnail(url).then(s => setThumbnail(s));
  }, []);

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
            height: '100%'
          }}
        >
          <span className='text-white text-2xl'>{title}</span>
        </div>
      </div>
    )}
    </Draggable>
  );
}

export default Video;
