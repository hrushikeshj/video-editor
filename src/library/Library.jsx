import React, { useState, useEffect } from 'react';
import Video from './Video';
import './Library.css'

function Library({videos}){
  return (
    <div className='ml-4 mt-4 lib-cont'>
      <div className="prose lg:prose-xl">
        <h3 className='text-white'>Library</h3>
      </div>
      <div className="videos mr-2">
        {
          videos.map(v => <Video video={v} key={v.fileName}/>)
        }  
      </div>
    </div>
  );
}

export default Library;
