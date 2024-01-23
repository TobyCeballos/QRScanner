import React, { useEffect, useRef } from 'react';

const QRScanner = () => {
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;

    // Acceder a la cámara
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        leerCodigoQR();
      })
      .catch((error) => console.error('Error al acceder a la cámara:', error));

    return () => {
      // Detener la cámara cuando el componente se desmonta
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const leerCodigoQR = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });

    const scanFrame = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const codigoQR = window.jsQR(imageData.data, imageData.width, imageData.height);

      if (codigoQR) {
        alert('Contenido del código QR: ' + codigoQR.data);
      }

      requestAnimationFrame(scanFrame);
    };

    video.addEventListener('loadeddata', () => {
      requestAnimationFrame(scanFrame);
    });
  };

  return (
    <video ref={videoRef} playsInline />
  );
};

export default QRScanner;
