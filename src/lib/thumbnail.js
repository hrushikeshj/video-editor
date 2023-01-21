const generateVideoThumbnail = (url) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = url;

    video.onloadeddata = () => {
      const duration = video.duration;
      let ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();

      return resolve({
        duration: duration,
        thumbnail: canvas.toDataURL("image/png")
      });
    };
  });
};

export default generateVideoThumbnail;
