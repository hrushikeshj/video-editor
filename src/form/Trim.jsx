import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MultiRange from '../range/multirangeslider';
import { readableDurationMill } from '../lib/util'

function Trim({trimFnc, duration, url}) {
  const [st, setSt] = useState(0);
  const [tl, setTl] = useState(duration);
  const [disabled, setDiabled] =  useState(false);
  const previewVideo = useRef();
  const previousMin = useRef({minValue: 0, maxValue: duration});


  function handelSubmit(e){
    e.preventDefault();
    setDiabled(true)
    trimFnc(st, tl);
  }

  function updateRange(e){
    setSt(e.minValue);
    setTl(e.maxValue - e.minValue);
  }
  
  function updateVideo(e){
    if(previousMin.current.minValue != e.minValue){
      previewVideo.current.currentTime = e.minValue;
    }

    if(previousMin.current.maxValue != e.maxValue){
      previewVideo.current.currentTime = e.maxValue;
    }

    previousMin.current = e;
  }

  return (
    <Form onSubmit={handelSubmit}>
      <div
        style={{
          display: 'grid',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <video ref={previewVideo} src={url} controls autoPlay={false} style={{width: "100%"}}></video>
      </div>
      <MultiRange 
        ruler={false}
        step="0.05"
        minValue="0"
        maxValue={duration}
        max={duration}
        displayCaption={readableDurationMill} 
        onChange={updateRange}
        onInput={updateVideo}
      />

      <div
        style={{
          display: 'grid',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button variant="primary" type="submit" disabled={disabled}>
          {disabled ? "Trimming.." : "Trim"}
        </Button>
      </div>
    </Form>
  );
}

export default Trim;
