import React, { useState } from 'react';
import './Timeline.css'
import Video from '../library/Video';

function Timeline({videos}){
  return (
    <div className='m-4'>
      <div style={{height: '80px'}}></div>
      <div className='storyboard ml-4'>
        {videos.map(v => <Video video={v} bg="cover" key={v.fileName}/>)}
      </div>
    </div>
  );
}

export default Timeline;
