import { useEffect, useState } from 'react'

function useVidoeModal(durl='', default_show=false){
  const [show, setShow] = useState(default_show);
  const [url, setUrl] = useState(durl);

  return {
    show,
    url,
    setShow,
    setUrl
  };

}

export default useVidoeModal;
