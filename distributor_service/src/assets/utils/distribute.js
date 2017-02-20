

window.onload = () => {
  const socket = io(window.location.origin + '/distributor');
  const statusElement = document.getElementById("audioStatus");
  const connectionCount = document.getElementById("connectionCount");
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
      function getAverageVolume(array) {
        let values = array.reduce(function(a, b) {
          return a += b;
        });
        return values / array.length;
      }
      function distribute() {
        requestAnimationFrame(distribute);
        const bufferLength = audio.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audio.analyser.getByteFrequencyData(dataArray);
        socket.emit('audio', { frequency: dataArray, volume: getAverageVolume(dataArray) });
      }

      distribute();
    });
  });

  socket.on('update_count', data => {
    connectionCount.innerHTML = `${data.connectionCount} current connections`;
  });

  socket.on('disconnect', data => {
    connected = false;
    console.log('disconnected', { data });
  });

};
