
window.getAudio((audio) => {
  if (audio.permission) {
    const canvas = document.getElementById('audioCanvas');
    const ctx = canvas.getContext('2d');
    const { analyser } = audio;
    const height = canvas.height = window.innerHeight;
    const width = canvas.width = window.innerWidth;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (width / bufferLength) * 2.5;

    const draw = () => {
      let x = 0;
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = `rgb(${barHeight + 36}, 255, 232)`;
        ctx.fillRect(x, height, barWidth, -barHeight * 3);
        x += barWidth + 1;
      }

      requestAnimationFrame(draw);
    };

    draw();
  }
});
