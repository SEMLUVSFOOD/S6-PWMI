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
      // Draw red glowing circles on hand wrists
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          const wrist = landmarks[0];
          const x = wrist.x * canvas.width;
          const y = wrist.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 45, 0, 2 * Math.PI); // Bigger circle
          ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'; // Glowing red
          ctx.fill();
        }
      }
    });

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