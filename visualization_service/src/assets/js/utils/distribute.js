

window.onload = () => {
  const socket = io(window.location.origin + '/distributor');
  const statusElement = document.getElementById("audioStatus");
  const setStatus = (status) => {
    statusElement.innerHTML = `<p>${status}</p>`;
  };

  socket.on('connect', () => {
    window.getAudio(function(audio) {
      if (!audio.permission) {
        setStatus("Permission Denied.");
        return;
      }
      setStatus("Permission Granted: Now streaming audio data to server");
      function distribute() {
        requestAnimationFrame(distribute);
        const bufferLength = audio.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audio.analyser.getByteFrequencyData(dataArray);
        socket.emit('audio', { array: dataArray });
      }

      distribute();
    });
  });

  socket.on('disconnect', data => {
    connected = false;
    console.log('disconnected', { data });
  });

};
