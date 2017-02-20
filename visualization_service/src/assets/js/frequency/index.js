(function($V) {

  var freq = {

    GAP: 10,
    SLICE_WIDTH: 10,
    defaultData: { frequency: new Uint8Array(256) },

    play: function (data) {
      const canvas = document.getElementById('audioCanvas');
      const ctx = canvas.getContext('2d');
      const HEIGHT = canvas.height = window.innerHeight;
      const WIDTH = canvas.width = window.innerWidth;
      const HEIGHT_OFFSET = HEIGHT / 2;

      const { defaultData, SLICE_WIDTH, GAP } = this;

      if (!data) {
        return;
      }

      let x = 0, i = 0;
      let len = Object.keys(data.frequency).length;
      let incrememt = SLICE_WIDTH + GAP;

      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (; x < WIDTH; i++) {
        let bar_height = data.frequency[i] * 5;
        let bar_y = (HEIGHT - bar_height) / 2;

        let opacity = bar_height / HEIGHT_OFFSET;

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(x, bar_y, SLICE_WIDTH, bar_height);

        x += incrememt;
      }
    },

    destroy: function () {
      this.GAP = this.SLICE_WIDTH = 10;
    },

    receive: function (event, data) {
      switch (event) {
        case 'input-a-pot':
          this.GAP = data.value * 100;
          if (this.GAP > 100) { this.GAP = 100; }
          if (this.GAP < 1) { this.GAP = 1; }
          break;
        case 'input-b-pot':
          this.SLICE_WIDTH = data.value * 100;
          if (this.SLICE_WIDTH >= 100) { this.SLICE_WIDTH = 100; }
          if (this.SLICE_WIDTH <= 1) { this.SLICE_WIDTH = 1; }
        default:
          this.play(data);
      }
    }
  };

  $V.register(freq);


})(window.VIZ);
