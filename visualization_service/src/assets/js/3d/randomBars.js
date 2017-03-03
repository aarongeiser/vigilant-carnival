(function($V) {

  var config = {
    repeatSize: 1
  };

  var currentGeometry = 0;
  var geoms = [
    new THREE.BoxGeometry( 500, 10, 10 ),
    new THREE.ConeGeometry( 50, 250, 6),
    new THREE.CylinderGeometry(10, 10, 300, 3, false)
  ];

  var three001 = {
    camera: null,
    scene: null,
    renderer: null,
    composer: null,
    object: null,
    light: null,
    addBars: function() {
      this.object = new THREE.Object3D();

      this.texture.repeat.x = this.texture.repeat.y = config.repeatSize;
      this.texture.needsUpdate = true;

      var geometry = geoms[currentGeometry];
      var material = new THREE.MeshPhongMaterial( {
        map: this.texture
      });

      for ( var i = 0; i < 50; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( Math.random() - 0.2, Math.random() - 0.2, Math.random() - 0.2 ).normalize();
        mesh.position.multiplyScalar( Math.random() * 400 );
        mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
        this.object.add( mesh );
      }

      this.scene.add( this.object );
    },
    init: function () {

      this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('audioCanvas') });
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( window.innerWidth, window.innerHeight );

      this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
      this.camera.position.z = 500;

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

      this.texture = $V.getTexture();
      this.addBars();
      
      this.scene.add(new THREE.AmbientLight(0x999999));

      this.light1 = new THREE.DirectionalLight($V.hslToRgb(.01));
      this.light1.position.set(1, 20, 1);
      this.scene.add(this.light1);

      this.light2 = new THREE.DirectionalLight($V.hslToRgb(.6));
      this.light2.position.set(1, -20, 1);
      this.scene.add(this.light2);

      // postprocessing

      this.composer = new THREE.EffectComposer(this.renderer);
      const copyPass = new THREE.ShaderPass(THREE.CopyShader);
      const renderPass = new THREE.RenderPass(this.scene, this.camera);
      const mirrorPass = new THREE.ShaderPass(THREE.MirrorShader);

      mirrorPass.uniforms[ 'side' ].value = 0;

      this.composer.addPass(renderPass);
      this.composer.addPass(mirrorPass);
      this.composer.addPass(copyPass);
      copyPass.renderToScreen = true;
    },

    play: function () {
      this.init();
      var that = this;

      function animate () {
        that.reqId = requestAnimationFrame(animate);

        $V.rotateObject(that.object, function() {
          that.object.rotation.x += 0.01;
          // that.object.rotation.y -= 0.01;
          that.object.children.forEach(function(child, i) {
            child.rotation.x += 0.01;
            child.rotation.y -= 0.01;
            child.rotation.z += 0.01;
          });
        });
        that.composer.render(0.1);

      }

      this.reqId = requestAnimationFrame(animate);
    },

    destroy: function() {
      if (this.reqId) {
        window.cancelAnimationFrame(this.reqId);
      }
    },

    receive: function (event, data) {
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
      if (data.source === 'rotation') {
        return $V.handleRotation(data);
      }
      switch (input) {
        case 'texture-button1':
          if (data.value === 1) {
            this.texture = $V.getTexture();
            this.texture.repeat.x = this.texture.repeat.y = config.repeatSize;
            this.texture.needsUpdate;
            this.object.children.forEach(function(child, i) {
              child.material.map = this.texture;
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


  };

  $V.register(three001);

})(window.VIZ);
