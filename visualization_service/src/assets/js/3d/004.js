(function($V) {

  var scene, camera, renderer;
  var GAP = 20;

  var three002 = {
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    light: null,
    object: [],
    addParticles: function() {

      var xpos = 0;
      var increment = GAP;
      var num = 128;
      var w = (window.innerWidth - (128 * increment)) / num;

      for (var i = 0; i < num; i ++ ) {
        var texture = $V.getTexture();
        var geometry = new THREE.BoxGeometry(5, window.innerHeight, 5);
        var material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        var mesh = new THREE.Mesh(geometry, material);

        texture.needsUpdate = true;
        texture.repeat.x = 20;
        texture.repeat.y = 20;
        xpos += i === 0 ? xpos : w + increment;
        mesh.position.set(xpos, 1, 10);

        this.object.add( mesh );
      }
    },
    init: function () {
      this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.getElementById('audioCanvas') });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
      this.camera.position.z = 400;

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog( 0x000000, 1, 800 );

      this.object = new THREE.Object3D();

      this.object.position.x -= window.innerWidth / 2;

      // this.object.rotation.x = 30;

      this.scene.add(this.object);

      this.addParticles();

      this.scene.add(new THREE.AmbientLight(0x999999));

      var light = new THREE.DirectionalLight(0x0f0000);
      light.position.set(50, 1, 1);
      this.scene.add(light);

      var light = new THREE.DirectionalLight(0xffffff);
      light.position.set(-50, 1, 1);
      this.scene.add(light);

      this.composer = new THREE.EffectComposer(this.renderer);
      const copyPass = new THREE.ShaderPass(THREE.CopyShader);
      const renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);
      // const fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
      // this.composer.addPass(fxaaPass);
      // const mirrorPass = new THREE.ShaderPass(THREE.MirrorShader);
      // this.composer.addPass(mirrorPass);
      this.composer.addPass(copyPass);
      copyPass.renderToScreen = true;
    },
    play: function () {
      this.init();
      var that = this;

      function animate () {
        that.reqId = requestAnimationFrame(animate);

        var time = Date.now() * 0.00005;
        // that.camera.position.x += that.camera.position.x * 0.05;
        // that.camera.position.y += that.camera.position.y * 0.05;
        // that.camera.lookAt(that.scene.position);
        that.object.children.forEach(function(child, i) {
          child.rotation.y += 0.05;
          // if (child.rotation.x = 0.005) {
          //   child.rotation.x -= (0.001 - ((i - 1) / 8000));
          // } else if (child.rotation.x >= 0.005) {
          //
          // }
          // child.rotation.z += (0.001 - ((i - 1) / 8000));
          child.rotation.x += (0.001 - ((i - 1) / 8000));
        });

        // that.object.rotation.x -= 0.05;
        // that.object.rotation.z -= 0.001;


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
          // this.object.children.forEach(function (child, i) {
          //   var scale = (data.volume / data.frequency[i] + 1) / 8
          //   child.scale.y = scale <= 0.01 ? 0.01 : scale;
          // });
          break;
        default:
      }

    }
  }

  $V.register(three002);

})(window.VIZ);
