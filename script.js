import { onButtonSelected } from './buttonevents.js';

let hoverStart = null;
let hoverOpacity = 0;
let selectionMade = false;

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    });
    video.srcObject = stream;
    return new Promise(resolve => {
      video.onloadedmetadata = () => resolve();
    });
  }

  async function start() {
    await setupCamera();
    video.play();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const bodyPixNet = await bodyPix.load();

    const hands = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    hands.onResults(results => {
        if (results.multiHandLandmarks) {
          const canvasRect = canvas.getBoundingClientRect();
          let anyOverlap = false;
      
          for (const landmarks of results.multiHandLandmarks) {
            const palm = landmarks[9];
            const x = palm.x * canvas.width;
            const y = palm.y * canvas.height;
      
            const flippedX = (1 - palm.x) * canvas.width;
            const screenX = canvasRect.left + flippedX * (canvasRect.width / canvas.width);
            const screenY = canvasRect.top + y * (canvasRect.height / canvas.height);
      
            const radius = 45;
            const button = document.querySelector('.buttonTest');
            const rect = button.getBoundingClientRect();
      
            const isOverlapping =
              screenX + radius >= rect.left &&
              screenX - radius <= rect.right &&
              screenY + radius >= rect.top &&
              screenY - radius <= rect.bottom;
      
            if (isOverlapping) {
              anyOverlap = true;
      
              if (!hoverStart) hoverStart = Date.now();
      
              const hoverTime = Date.now() - hoverStart;
              const overlayOpacity = Math.min(hoverTime / 3000, 1);
      
              // Draw overlay glow filling up
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, 2 * Math.PI);
              ctx.fillStyle = `rgba(255, 0, 0, ${overlayOpacity})`;
              ctx.fill();
      
              if (overlayOpacity >= 1 && !selectionMade) {
                selectionMade = true;
                onButtonSelected();
              }
            }
      
            // Always draw faint base circle
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.fill();
          }
      
          // Reset if no hand over the button
          if (!anyOverlap) {
            hoverStart = null;
            hoverOpacity = 0;
            selectionMade = false;
          }
        }
      });      
    
    function checkOverlapWithButton(screenX, screenY, radius = 45) {
        const button = document.querySelector('.buttonTest');
        const rect = button.getBoundingClientRect();
      
        const isOverlapping =
          screenX + radius >= rect.left &&
          screenX - radius <= rect.right &&
          screenY + radius >= rect.top &&
          screenY - radius <= rect.bottom;
      
        if (isOverlapping) {
          console.log('overlap!');
        }
    }    

    async function render() {
      // Draw silhouette
      const segmentation = await bodyPixNet.segmentPerson(video, {
        internalResolution: 'full',
        segmentationThreshold: 0.6
      });

      const mask = bodyPix.toMask(
        segmentation,
        { r: 0, g: 0, b: 0, a: 255 },  // Black silhouette
        { r: 0, g: 0, b: 0, a: 0 }     // Transparent background
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(mask, 0, 0);

      // Run hand detection
      await hands.send({ image: video });

      requestAnimationFrame(render);
    }

    render();
  }

  start();