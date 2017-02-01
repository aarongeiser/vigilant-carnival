window.getAudio = function(callback) {
  const success = stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstraint = 1.0;
    source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    return callback({ analyser, source, permission: true });
  };

  const error = err => {
    return callback({ permission: false });
  };

  navigator.getUserMedia({ audio: true }, success, error);
}
