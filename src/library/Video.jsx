import {useEffect, useState} from 'react';
import generateVideoThumbnail from '../lib/thumbnail'

function Video({video: {title, url}}){
  const [thumbnail, setThumbnail] = useState();

  useEffect(() => {
    generateVideoThumbnail(url).then(s => setThumbnail(s));
  }, []);

  return (
    <div className="lib-video" style={
      {backgroundImage: `url("${thumbnail}")`,
      backgroundSize: '100%', 
      backgroundPosition: 'center center'}
    }>
        <span className='text-white'>{title}</span>
    </div>
  );
}

export default Video;
