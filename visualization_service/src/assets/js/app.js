(function() {

  var visualizations = [];
  var duration = 60000;
  var position = 0;
  var currentVizualization = null;
  var currentTexture = 0;

  var textures = [
    '/assets/textures/patterns-01.png',
    '/assets/textures/patterns-02.png',
    // '/assets/textures/patterns-03.png',
    // '/assets/textures/patterns-04.png'
    '/assets/textures/patterns-05.png',
    '/assets/textures/patterns-06.png',
    '/assets/textures/patterns-07.png',
    '/assets/textures/patterns-08.png',
    '/assets/textures/patterns-09.png'
  ];

  /**
   * Visualizations will require " destroy, play, and receive" methods
   *
   *  destroy: removes all aspects of the current visualization
   *  play: will trigger an animation loop
   *  receive: a means for getting real-time data to the visualization
   *
   */

  var VIZ = {
    register: function(visualization) {
      visualizations.push(visualization);
    },

    resetCanvas: function() {
      var id = 'audioCanvas';
      var curr = document.getElementById(id);
      var reset = document.createElement('canvas');
      reset.id = id;
      curr.replaceWith(reset);
    },

    hslToRgb: function(h, s = 1, l = 0.5) {
      let r, g, b, hex;

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      r = hue2rgb(p, q, h + 1 / 3) * 255;
      g = hue2rgb(p, q, h) * 255;
      b = hue2rgb(p, q, h - 1 / 3) * 255;

      hex = [r, g, b].map(color => {
        return ('0' + Math.round(color).toString(16)).slice(-2);
      }).join('');

      return '#' + hex;

    },

    loadTextures: function(cb) {
      var loadedTextures = 0;
      var that = this;
      textures = textures.map((t, i) => {
        var image = new Image();
        image.src = t;
        var texture = new THREE.Texture(image, false, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);
        texture.needsUpdate = true;
        image.onload = function() {
          loadedTextures++;
          console.log(loadedTextures.length);
          if (loadedTextures == textures.length) {
            cb.call(that);
          }
        }
        return texture;
      });
    },

    getTexture: function () {
      currentTexture++;
      if (currentTexture >= textures.length) {
        currentTexture = 0;
      }
      return textures[currentTexture];
    },

    play: function () {
      if (visualizations.length) {
        currentVizualization = visualizations[position];
        currentVizualization.play();
      }
    },

    advance: function() {
      var len = visualizations.length;
      if (currentVizualization) {
        currentVizualization.destroy();
      }
      position = position + 1 >= len ? 0 : ++position;
      this.play();
    },

    connect: function() {
      var that = this;
      socket = io('http://tx-viz-dist:3001/viz');
      socket.on('connect', () => {
        console.log('connected');
        socket.on('audio', function(data) {
          console.log({currentVizualization});
          if (currentVizualization) {
            currentVizualization.receive('audio', data);
          }
        });
        socket.on('down', function(data) {
          currentVizualization.receive('down', data);
        });
        socket.on('switch', function(data) {
          that.advance();
        });
      });

      socket.on('input', data => {
        currentVizualization.receive('input', data);
      });

    },

    setLightColor: function (light, hue) {
      light.color.setHex('0x' + this.hslToRgb(hue).split('#')[1]);
    },

    rotation: {
      values: {
        up: 1,
        down: 1,
        left: 1,
        right: 1,
      },
      isSet: false
    },

    handleRotation: function(data) {
      this.rotation.values[data.name] = data.value;
      this.rotation.isSet = Object.keys(this.rotation.values).find(val => this.rotation.values[val] === 0);
      return this.rotation;
    },

    rotateObject: function(obj, defaultRotation) {
      if (this.rotation.isSet) {
        if (this.rotation.values.up === 0) {
          obj.rotation.x += 0.025;
        }
        if (this.rotation.values.down === 0) {
          obj.rotation.x -= 0.025;
        }
        if (this.rotation.values.left === 0) {
          obj.rotation.y -= 0.025;
        }
        if (this.rotation.values.right === 0) {
          obj.rotation.y += 0.025;
        }
      } else {
        defaultRotation();
      }
    },

    init: function () {
      this.connect();
      var that = this;
      window.addEventListener('keyup', function(e) {
        if (e.keyCode === 32) { //space-bar
          that.advance();
        }
      }, false);
      return this;
    }

  };

  window.VIZ = VIZ.init();

})();
