window.onload = () => {

  let GAP = 10; //range 1 - 100
  let SLICE_WIDTH = 10; //range 10 - 50

  let NUM_LINES = 10;

  const canvas = document.getElementById('audioCanvas');
  const ctx = canvas.getContext('2d');
  const HEIGHT = canvas.height = window.innerHeight;
  const WIDTH = canvas.width = window.innerWidth;
  const HEIGHT_OFFSET = HEIGHT / 2;

  const getDefaultData = () => {
    const defaultData = { array: new Uint8Array(256) };
    Object.keys(defaultData.array).forEach(k => {
      defaultData.array[k] = Math.random() * (0 - 500) + 500;
    });
    return defaultData;
  };

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const sortData = (data = {}) => {
    let len = Object.keys(data.array).length;
    let itemsPerArray = Math.round(len / NUM_LINES);
    let sortedData = [];
    let ar = [];

    for (let item in data.array) {
      if (ar.length === itemsPerArray) {
        sortedData.push(ar);
        ar = [];
      }
      ar.push(data.array[item]);
    }

    return sortedData;

  };



  const draw = (data) => {
    let x = 0, y = 0;
    let sliceWidth;
    let sep = Math.round(HEIGHT / NUM_LINES);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    data = sortData(data ? data : getDefaultData());

    ctx.lineWidth = 20;
    ctx.lineCap = 'square';
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.beginPath();
    data.forEach(ar => {
      sliceWidth = WIDTH * 1.0 / ar.length;

      x = 0;
      y += sep;

      ar.forEach((item, i) => {
        item = Number(item);

        yPos = -(item / 2) + y;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, yPos);
        }
        x += sliceWidth;
      });

      ctx.lineTo(x + sliceWidth, y);

    });

    ctx.stroke();
    ctx.closePath();



  };

  socket = io('http://localhost:3001/viz');
  socket.on('connect', () => {
    socket.on('audio', draw);
    socket.on('down', draw);
  });

  draw();

};
