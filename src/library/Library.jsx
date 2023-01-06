import React, { useState, useEffect } from 'react';
import Video from './Video';
import './Library.css'

function Library({videos}){
  return (
    <>
      <div className="prose lg:prose-xl">
        <h2>Library</h2>
      </div>
      <div className="videos mr-2">
        {
          videos.map(v => <Video video={v}/>)
        }  
      </div>
    </>
  );
}

export default Library;
