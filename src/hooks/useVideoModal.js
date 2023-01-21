import { useEffect, useState } from 'react'

function useVidoeModal(durl='', default_show=false){
  const [modalShow, setModalShow] = useState(default_show);
  const [modalUrl, setModalUrl] = useState(durl);

  return {
    modalShow,
    modalUrl,
    setModalShow,
    setModalUrl
  };

}

export default useVidoeModal;
