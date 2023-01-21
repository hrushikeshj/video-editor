import React, { useState, useEffect } from 'react';
import { Droppable } from "react-beautiful-dnd";
import Video from './Video';
import './Library.css'

function Library({videos, addVideoToLibrary, setModalUrl, setModalShow}){
  // B-DnD fix in StrictMode
  const [ enabled, setEnabled ] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
       cancelAnimationFrame(animation);
       setEnabled(false);
    };
  }, []);

  if (!enabled) {
      return null;
  }
  // end hack

  function addVideo({ target: { files } }){
    const { name } = files[0];
    addVideoToLibrary(files[0], name);
  }

  return (
    <div className='ms-2 mt-2 lib-cont pe-1'>
      <div className="prose lg:prose-xl">
        <h5 className='text-white'>Library</h5>
      </div>
      <label id="lib-input-label" htmlFor="lib-input" className="custom-file-upload text-white">
        <input id="lib-input" type="file" onChange={addVideo} accept="video/mp4"/>
        <i className="bi bi-plus-lg"/> <span >Add</span>
      </label>
      <Droppable droppableId="library">
      {provided => (
        <div className="videos mt-1"  ref={provided.innerRef} {...provided.droppableProps}>
          {videos.map((v, i) => <Video preview={() => {setModalUrl(v.url); setModalShow(true)}} video={v} key={v.fileName} index={i}/>)}
          {provided.placeholder}
        </div>
      )}
      </Droppable>


    </div>
  );
}

export default Library;
