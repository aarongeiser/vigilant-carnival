window.onload = () => {

  let GAP = 10; //range 1 - 100
  let SLICE_WIDTH = 10; //range 10 - 50

  const canvas = document.getElementById('audioCanvas');
  const ctx = canvas.getContext('2d');
  const HEIGHT = canvas.height = window.innerHeight;
  const WIDTH = canvas.width = window.innerWidth;
  const HEIGHT_OFFSET = HEIGHT / 2;

  const defaultData = { array: new Uint8Array(256) };


  Object.keys(defaultData.array).forEach(k => {
    defaultData.array[k] = Math.random() * (0 - 500) + 500;
  })

  const draw = (data = defaultData) => {
    let x = 0, i = 0;
    let len = Object.keys(data.array).length;
    let incrememt = SLICE_WIDTH + GAP;

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (; x < WIDTH; i++) {
      let bar_height = data.array[i] * 5;
      let bar_y = (HEIGHT - bar_height) / 2;

      let opacity = bar_height / HEIGHT_OFFSET;

      ctx.fillStyle = `rgba(125, 255, 125, ${opacity})`;
      ctx.fillRect(x, bar_y, SLICE_WIDTH, bar_height);

      x += incrememt;
    }
  };

  socket = io('http://localhost:3001/viz');
  socket.on('connect', () => {
    socket.on('audio', draw);
    socket.on('down', draw);
  });
  socket.on('input-a-pot', data => {
    console.log(data);
    GAP = data.value * 100;
    if (GAP > 100) { GAP = 100; }
    if (GAP < 1) { GAP = 1; }
  });
  socket.on('input-b-pot', data => {
    console.log(data);
    SLICE_WIDTH = data.value * 100;
    if (SLICE_WIDTH >= 100) { SLICE_WIDTH = 100; }
    if (SLICE_WIDTH <= 1) { SLICE_WIDTH = 1; }
  });


  draw();

};
