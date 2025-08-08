import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const HlsPlayer = ({ src, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;
    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = src;
      }
    }
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video ref={videoRef} controls className={className}>
      Trình duyệt của bạn không hỗ trợ video m3u8
    </video>
  );
};

export default HlsPlayer;