(function($V) {

  var scene, camera, renderer, object;
  var SLICE_WIDTH = 5;
  var GAP = 1;

  var config = {
    repeatSize: 1//range 1 - 0;
  };

  var three002 = {
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    light: null,
    object: null,
    addBars: function() {
      var geometry = new THREE.BoxGeometry(SLICE_WIDTH, SLICE_WIDTH, 25);
      var texture = $V.getTexture();
      texture.repeat.x = 1; //range .2 - 2
      texture.repeat.y = 1; //range .2 - 2
      texture.needsUpdate = true;
      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: texture
      });
      var increment = GAP;
      var xpos = 0;

      for ( var i = 0; i < 128; i ++ ) {
        var mesh = new THREE.Mesh(geometry, material);
        xpos += i === 0 ? xpos : geometry.parameters.width + increment;
        mesh.position.set(xpos, 1, 1);
        mesh.rotation.x = 10;
        this.object.add(mesh);
      }

    },
    init: function () {
      this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.getElementById('audioCanvas') });
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( window.innerWidth, window.innerHeight );

      this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
      this.camera.position.z = 400;

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog( 0x000000, 1, 800 );

      this.object = new THREE.Object3D();

      this.scene.add(this.object);

      this.addBars();

      this.scene.add(new THREE.AmbientLight(0x999999));

      this.light1 = new THREE.DirectionalLight($V.hslToRgb(.2));
      this.light1.position.set(1, 20, 1);
      this.scene.add(this.light1);

      this.light2 = new THREE.DirectionalLight($V.hslToRgb(.8));
      this.light2.position.set(1, -20, 1);
      this.scene.add(this.light2);

      this.composer = new THREE.EffectComposer(this.renderer);
      const copyPass = new THREE.ShaderPass(THREE.CopyShader);
      const renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);
      const mirrorPass = new THREE.ShaderPass(THREE.MirrorShader);
      this.composer.addPass(mirrorPass);
      this.composer.addPass(copyPass);
      copyPass.renderToScreen = true;
    },
    play: function () {
      this.init();
      var that = this;

      function animate () {
        that.reqId = requestAnimationFrame(animate);
        that.object.children.forEach(function(child, i) {
          if (i === 0) {
            child.rotation.x -= 0.001;
          } else {
            child.rotation.x -= (0.001 - (i / 2000));
          }

        });
        that.object.rotation.x += 0.01;

        that.composer.render(0.1);
      }

      this.reqId = requestAnimationFrame(animate);

    },
    destroy: function () {
      if (this.reqId) {
        window.cancelAnimationFrame(this.reqId);
      }
    },
    receive: function(event, data) {
      switch (event) {
        case 'audio':
          this.object.children.forEach(function (child, i) {
            var val = data.frequency[i] / 2;
            child.scale.y = val ? val : 0.0001;
          });
          break;
        case 'input':
          return this.handleInput(data);
        default:
      }
    },

    handleInput: function(data) {
      var input = data.source + '-' + data.name;
      switch (input) {
        case 'texture-button1':
          if (data.value === 1) {
            var texture = $V.getTexture();
            texture.repeat.x = texture.repeat.y = config.repeatSize;
            texture.needsUpdate;
            this.object.children.forEach(function(child, i) {
              child.material.map = texture;
              child.material.map.needsUpdate = true;
              child.material.needsUpdate = true;
              child.needsUpdate = true;
            });
          }
          break;
        case 'texture-pot1':
          var num = parseFloat(data.value, 10);
          this.object.children.forEach(function(child, i) {
            child.material.map.repeat.x = num;
            child.material.map.repeat.x = num;
            child.material.map.needsUpdate = true;
            child.material.needsUpdate = true;
            child.needsUpdate = true;
          });
          break;
        case 'lighting-pot1':
          $V.setLightColor(this.light1, parseFloat(data.value, 10));
          break;
        case 'lighting-pot2':
          $V.setLightColor(this.light2, parseFloat(data.value, 10));
          break;
      }
    }
  }

  $V.register(three002);

})(window.VIZ);
