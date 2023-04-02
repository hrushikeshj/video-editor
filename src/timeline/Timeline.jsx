import { useState, useEffect } from 'react';
import { joinVideos, trimVideo } from '../lib/util'
import './Timeline.css'
import { Droppable } from "react-beautiful-dnd";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import VideoThumbnail from './VideoThumbnail'
import TrimForm from '../form/Trim'
import SplitForm from '../form/Split'

function humanizeProgress(p){
  //{"ratio":0.7052561543579509,"time":7.29}
  let ratio = p.ratio ? (p.ratio * 100).toFixed(2) : 0;
  let time = p.time ? p.time : 0;

  return `${ratio}%, ${time} sec`
}

function Timeline({videos, removeVideo, setModalUrl, setModalShow, ffmpeg, setPreviewSrc, replaceVideo, duplicate, gSetModalShow, gSetModalContent, exportAndDownload}){
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [progress, setProgress] = useState({time: -1});
  const [running, setRunning] = useState(false);

  ffmpeg.setProgress(setProgress)
  ffmpeg.runWithLock = async function(...cmd){
    setRunning(true);
    await this.run(...cmd);
    setRunning(false);
  }

  const join = async () => {
    const out_url = await joinVideos(ffmpeg, videos);
    setPreviewSrc(out_url);
  }

  const trim = async (video) => {
    gSetModalShow(true);
    setSelectedVideo(null);
    gSetModalContent(
      <TrimForm 
      trimFnc={
        async (ss, t) => {
          gSetModalShow(false);
          const out_url = await trimVideo(ffmpeg, video.url, video.fileName, ss, t);
          replaceVideo(video.fileName, [out_url]);
        }
      }/>
    )
  }

  const split = async (video) => {
    setSelectedVideo(null);

    gSetModalShow(true);
    gSetModalContent(
      <SplitForm 
      trimFnc={
        async (split_at) => {
          if(split_at > video.duration){
            alert("Invalid time");
            return;
          }

          gSetModalShow(false);
          const out_url = await trimVideo(ffmpeg, video.url, video.fileName, 0, split_at);
          const out_url1 = await trimVideo(ffmpeg, video.url, video.fileName, split_at, video.duration);
          replaceVideo(video.fileName, [out_url, out_url1]);
        }
      }/>
    )
  }

  // B-DnD fix in StrictMode
  const [enabled, setEnabled ] = useState(false);
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

  return (
    <div>
      <div className="grid-center my-2">
        <div className='options'>
          <span className={running ? 'text-white' : ''}>{'.'}</span>
          <Button className="btn-sm btn-info" onClick={join}>Join</Button>

          <Button
              className='bg-transparent video-option'
              disabled={selectedVideo === null}
              onClick={() => trim(selectedVideo)}
            >
              <i className="bi bi-scissors text-white"></i> Trim
          </Button>

          <Button
              className='bg-transparent video-option'
              disabled={selectedVideo === null}
              onClick={() => split(selectedVideo)}
            >
              <i className="bi bi-layout-split text-white"></i> Split
          </Button>

          <Button
              className='bg-transparent video-option'
              disabled={selectedVideo === null}
              onClick={() => duplicate(selectedVideo.fileName)}
            >
              <i className="bi bi-journal-bookmark-fill text-white"></i> Clone
          </Button>

          <Button
              className='bg-transparent video-option'
              disabled={selectedVideo === null}
              onClick={() => {
                setModalShow(true);
                setModalUrl(selectedVideo.url);
              }}
            >
              <i className="bi bi-eye text-white"></i> Preview
          </Button>

          <div className='divider'>
            <Button
              className='bg-transparent video-option'
              disabled={selectedVideo === null}
              onClick={() => {
                removeVideo(selectedVideo.fileName);
                setSelectedVideo(null);
              }}
            >
              <i className="bi bi-trash3 text-white"></i>
            </Button>
          </div>

          <div className='divider'>
            <Form.Select aria-label="Default select example" style={{marginTop: "3px"}} size="sm" onChange={exportAndDownload}>
              <option value="Export">Export</option>
              <option value="5">gif</option>
              <option value="1">mp4</option>
              <option value="2">avi</option>
              <option value="3">mkv</option>
              <option value="4">mp3</option>
            </Form.Select>
          </div>
          
        </div>
      </div>
      <Droppable droppableId="timeline" direction="horizontal">
        {provided => (
          <div className='storyboard px-2 ' ref={provided.innerRef} {...provided.droppableProps}>
            {videos.map((v, i) => <VideoThumbnail 
                                    select={() => setSelectedVideo(v)}
                                    selected={selectedVideo && (selectedVideo.fileName === v.fileName)} 
                                    video={v} 
                                    bg="cover" 
                                    key={v.fileName} 
                                    index={i}
                                  />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="loading style-2" style={{display: running ? "block" : "none"}}>
        <div className='loading-wheel-center'>
          <div className="loading-wheel"></div>
          <div className="progress-video text-white text-center">
            {humanizeProgress(progress)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
