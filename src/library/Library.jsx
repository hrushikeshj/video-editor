import React, { useState, useEffect } from 'react';
import { Droppable } from "react-beautiful-dnd";
import Video from './Video';
import VideoPreviewModal from '../util/Modal'
import useVidoeModal from '../hooks/useVideoModal'
import './Library.css'

function Library({videos, addVideoToLibrary}){
  const { show, url, setShow, setUrl } = useVidoeModal();
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
    <div className='ml-4 mt-2 lib-cont'>
      <div className="prose lg:prose-xl">
        <h5 className='text-white'>Library</h5>
      </div>
      <label className="custom-file-upload text-sm">
          <input type="file" onChange={addVideo}/>
          <i className="fa fa-cloud-upload"/> Attach
      </label>
      <Droppable droppableId="library">
      {provided => (
        <div className="videos mr-1 mt-1"  ref={provided.innerRef} {...provided.droppableProps}>
          {videos.map((v, i) => <Video preview={() => {setUrl(v.url); setShow(true)}} video={v} key={v.fileName} index={i}/>)}
          {provided.placeholder}
        </div>
      )}
      </Droppable>

      <VideoPreviewModal show={show} setShow={setShow}>
        <div
          style={{
            display: 'grid',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <video src={url} controls autoPlay={true}></video>
        </div>
      </VideoPreviewModal>
    </div>
  );
}

export default Library;
