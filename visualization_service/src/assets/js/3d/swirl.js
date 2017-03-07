(function($V) {

  var scene, camera, renderer;
  var GAP = 20;
  var config = {
    repeatSize: 1
  };

  var currentGeometry = 0;
  var geoms = [
    new THREE.BoxGeometry(10, 1024, 10),
    new THREE.ConeGeometry(16, 512, 8),
    new THREE.CylinderGeometry(10, 10, 512, 6)
  ];

  var three002 = {
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    light: null,
    object: [],
    addBars: function() {

      var xpos = -(window.innerWidth / 4);
      var increment = GAP;
      var num = 128;
      var w = (window.innerWidth - (128 * increment)) / num;

      this.object = new THREE.Object3D();

      for (var i = 0; i < num; i ++ ) {
        var geometry = geoms[currentGeometry];
        var material = new THREE.MeshPhongMaterial({ map: this.texture, color: 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);

        this.texture.repeat.y = 8;
        this.texture.repeat.x = 1;
        this.texture.needsUpdate = true;

        xpos += i === 0 ? xpos : w + increment;
        mesh.position.set(xpos, 1, 10);

        this.object.add( mesh );
      }

      this.scene.add(this.object);
    },
    init: function () {
      this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.getElementById('audioCanvas') });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
      this.camera.position.z = 400;

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog( 0x000000, 1, 800 );

      this.texture = $V.getTexture();
      this.addBars();

      this.scene.add(new THREE.AmbientLight(0x999999));

      this.light1 = new THREE.DirectionalLight($V.hslToRgb(.2));
      this.light1.position.set(20, 1, 1);
      this.scene.add(this.light1);

      this.light2 = new THREE.DirectionalLight($V.hslToRgb(.8));
      this.light2.position.set(-20, 1, 1);
      this.scene.add(this.light2);

      this.composer = new THREE.EffectComposer(this.renderer);
      const copyPass = new THREE.ShaderPass(THREE.CopyShader);
      const renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);
      this.composer.addPass(copyPass);
      copyPass.renderToScreen = true;
    },
    play: function () {
      this.init();
      var that = this;

      function animate () {
        that.reqId = requestAnimationFrame(animate);

        $V.rotateObject(that.object, function() {
          that.object.children.forEach(function(child, i) {
            child.rotation.y += 0.05;
            child.rotation.x += (0.001 - ((i - 1) / 8000));
          });
          that.object.rotation.y -= 0.001;
          that.object.rotation.x += 0.001;
          that.object.rotation.z -= 0.001;
        });

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
          this.object.scale.set(1, 1, 1);
          const newScale = data.volume / Object.keys(data.frequency).length + 1;
          this.object.scale.set(newScale, newScale, newScale);
          break;
        case 'input':
          return this.handleInput(data);
        default:
      }
    },
    handleInput: function(data) {
      var input = data.source + '-' + data.name;
      var that = this;
      if (data.source === 'rotation') {
        return $V.handleRotation(data);
      }
      switch (input) {
        case 'texture-button1':
          if (data.value === 1) {
            this.texture = $V.getTexture();
            this.texture.repeat.y = 8;
            this.texture.repeat.x = 1;
            this.texture.needsUpdate = true;
            this.object.children.forEach(function(child, i) {
              child.material.map = that.texture;
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
        case 'geometry-button1':
          this.cycleGeometry(data);
          break;
      }
    },

    cycleGeometry: function(data) {
      if (data.value === 0) {
        currentGeometry++;
        if (currentGeometry >= geoms.length) {
          currentGeometry = 0;
        }
        this.scene.remove(this.object);
        this.addBars();
      }

    }
  }

  $V.register(three002);

})(window.VIZ);
