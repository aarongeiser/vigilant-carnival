window.onload = () => {

  let gap = 10;
  const canvas = document.getElementById('audioCanvas');
  const ctx = canvas.getContext('2d');
  const height = canvas.height = window.innerHeight;
  const width = canvas.width = window.innerWidth;
  const defaultData = { array: new Uint8Array(256) };

  const draw = (data = defaultData) => {
    let x = 0, i = 0;
    let len = Object.keys(data.array).length;
    let sliceWidth = width * 1.0 / len;

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = gap;
    ctx.fillStyle = 'rgb(36, 255, 232)';


    for (; i < len; i++) {
      let d = data.array[i];
      let v = (d ? d : 128) / 128.0;
      let y = v * height / 2;

      ctx.fillRect(x, d, sliceWidth, y);

      x += sliceWidth + gap;
    }
  };

  socket = io('http://localhost:3001/viz');
  socket.on('connect', () => {
    socket.on('audio', draw);
    socket.on('down', draw);
  });
  socket.on('input-a-3', data => {
    gap = data.value * 100;
    console.log(data.value, gap);
  });

  draw();

};
