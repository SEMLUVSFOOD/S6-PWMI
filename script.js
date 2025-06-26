import { onButtonSelected } from './buttonevents.js';

let hoverStart = null;
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
  
          const radius = 35;
          const overlappingButton = getOverlappingButton(screenX, screenY, radius);
  
          if (overlappingButton) {
            anyOverlap = true;
  
            if (!hoverStart) hoverStart = Date.now();
  
            const hoverTime = Date.now() - hoverStart;
            const progress = Math.min(hoverTime / 2000, 1);
  
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + 2 * Math.PI * progress;
  
            ctx.beginPath();
            ctx.arc(x, y, radius + 4, startAngle, endAngle, false);
            ctx.strokeStyle = 'rgba(252, 168, 140, 1)';
            ctx.lineWidth = 4;
            ctx.stroke();
  
            if (progress >= 1 && !selectionMade) {
              selectionMade = true;
              const label = overlappingButton.dataset.id || overlappingButton.textContent;
              onButtonSelected(label);
            }
          }
  
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(252, 168, 140, 0.5)';
          ctx.fill();
        }
  
        if (!anyOverlap) {
          hoverStart = null;
          selectionMade = false;
        }
      }
    });
  
    function getOverlappingButton(screenX, screenY, radius = 45) {
      const buttons = document.querySelectorAll('.hoverButton');
      for (const button of buttons) {
        const rect = button.getBoundingClientRect();
        const isOverlapping =
          screenX + radius >= rect.left &&
          screenX - radius <= rect.right &&
          screenY + radius >= rect.top &&
          screenY - radius <= rect.bottom;
  
        if (isOverlapping) return button;
      }
      return null;
    }
  
    async function render() {
      const segmentation = await bodyPixNet.segmentPerson(video, {
        internalResolution: 'full',
        segmentationThreshold: 0.6
      });
  
      const mask = bodyPix.toMask(
        segmentation,
        { r: 0, g: 0, b: 0, a: 255 },
        { r: 0, g: 0, b: 0, a: 0 }
      );
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(mask, 0, 0);
  
      await hands.send({ image: video });
  
      requestAnimationFrame(render);
    }
  
    // --- Motion Detection Setup ---
    const motionCanvas = document.getElementById('motionCanvas');
    motionCanvas.width = video.videoWidth;
    motionCanvas.height = video.videoHeight;
    const motionCtx = motionCanvas.getContext('2d');
  
    let lastMotionTime = Date.now();
    let lastFrameData = null;
  
    function detectMotion() {
      motionCtx.drawImage(video, 0, 0, motionCanvas.width, motionCanvas.height);
      const frame = motionCtx.getImageData(0, 0, motionCanvas.width, motionCanvas.height);
  
      if (lastFrameData) {
        let motionPixels = 0;
        for (let i = 0; i < frame.data.length; i += 4) {
          const diff =
            Math.abs(frame.data[i] - lastFrameData.data[i]) +
            Math.abs(frame.data[i + 1] - lastFrameData.data[i + 1]) +
            Math.abs(frame.data[i + 2] - lastFrameData.data[i + 2]);
  
          if (diff > 50) motionPixels++;
        }
  
        const motionRatio = motionPixels / (frame.data.length / 4);
        if (motionRatio > 0.02) {
          lastMotionTime = Date.now(); // Motion detected
        }
      }
  
      lastFrameData = frame;
  
      if (Date.now() - lastMotionTime > 5000) {
        window.location.href = 'cta.html';
      }
  
      setTimeout(detectMotion, 1000); // Check every second
    }
  
    detectMotion();
    render();
  }
  

start();
