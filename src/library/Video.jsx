import {useEffect, useState} from 'react';
import generateVideoThumbnail from '../lib/thumbnail'

function Video({video: {title, url}, bg='100%'}){
  const [thumbnail, setThumbnail] = useState();

  useEffect(() => {
    generateVideoThumbnail(url).then(s => setThumbnail(s));
  }, []);

  return (
    <div className="lib-video" style={{
      backgroundImage: `url("${thumbnail}")`,
      backgroundSize: bg, 
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    }}>
        <span className='text-white'>{title}</span>
    </div>
  );
}

export default Video;
