import React, { useState, useEffect } from 'react';
import Video from './Video';
import './Library.css'

function Library({videos, addVideoToLibrary}){

  function addVideo({ target: { files } }){
    const { name } = files[0];
    addVideoToLibrary(files[0], name);
  }

  return (
    <div className='ml-4 mt-4 lib-cont'>
      <div className="prose lg:prose-xl">
        <h3 className='text-white'>Library</h3>
      </div>
      <label className="custom-file-upload">
          <input type="file" onChange={addVideo}/>
          <i className="fa fa-cloud-upload"/> Attach
      </label>
      <div className="videos mr-2">
        {
          videos.map(v => <Video video={v} key={v.fileName}/>)
        }  
      </div>
    </div>
  );
}

export default Library;
