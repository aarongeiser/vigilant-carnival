(function() {

  var visualizations = [];
  var duration = 60000;
  var position = 0;
  var currentVizualization = null;

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

    advance: function() {
      var that = this;
      var len = visualizations.length;
      if (len < 2) { return; }
      this.timeout = setTimeout(function () {
        clearTimeout(that.timeout);
        currentVizualization.destroy();
        that.resetCanvas();
        position = position + 1 >= len ? 0 : ++position;
        that.play();
      }, duration);
    },

    resetCanvas: function() {
      var id = 'audioCanvas';
      var curr = document.getElementById(id);
      var reset = document.createElement('canvas');
      reset.id = id;
      curr.replaceWith(reset);
    },

    play: function () {
      if (visualizations.length) {
        currentVizualization = visualizations[position];
        currentVizualization.play();
        this.advance();
      }
    },

    connect: function() {
      socket = io('http://localhost:3001/viz');
      socket.on('connect', () => {
        socket.on('audio', function(data) {
          currentVizualization.receive('audio', data);
        });
        socket.on('down', function(data) {
          currentVizualization.receive('down', data);
        });
        console.log('connected');
      });
      socket.on('input', data => {
        currentVizualization.receive('input', data);
      });
    },

    init: function () {
      this.connect();
      return this;
    }

  };

  window.VIZ = VIZ.init();

})();
