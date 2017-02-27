(function($V) {

  var three001 = {
    camera: null,
    scene: null,
    renderer: null,
    composer: null,
    object: null,
    light: null,
    init: function () {

      this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('audioCanvas') });
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( window.innerWidth, window.innerHeight );

      this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
      this.camera.position.z = 500;

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

      this.object = new THREE.Object3D();
      this.scene.add( this.object );

      var texture = $V.getTexture();

      texture.repeat.x = 2;
      texture.repeat.y = .5;

      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;

      var geometry = new THREE.BoxGeometry( 15, 500, 15 );
      var material = new THREE.MeshPhongMaterial( {
        map: texture
      });

      for ( var i = 0; i < 50; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( Math.random() - 0.2, Math.random() - 0.2, Math.random() - 0.2 ).normalize();
        mesh.position.multiplyScalar( Math.random() * 400 );
        mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
        this.object.add( mesh );

      }

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
      // const kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
      // const dotScreenPass = new THREE.ShaderPass(THREE.DotScreenShader);

      mirrorPass.uniforms[ 'side' ].value = 0;
      // filmPass.uniforms['tDiffuse'].value = 5;
      // filmPass.uniforms['sCount'].value = 800;
      // filmPass.uniforms['sIntensity'].value = 0.9;
      // filmPass.uniforms['nIntensity'].value = 0.8;

      // dotScreenPass.uniforms['scale'].value = 3;

      this.composer.addPass(renderPass);
      this.composer.addPass(mirrorPass);

      // this.composer.addPass(dotScreenPass);
      // this.composer.addPass(kaleidoPass);


      this.composer.addPass(copyPass);
      copyPass.renderToScreen = true;
    },

    play: function () {
      this.init();
      var that = this;

      function animate () {
        that.reqId = requestAnimationFrame(animate);
        that.object.rotation.x += 0.01;
        // that.object.rotation.y -= 0.01;
        that.object.children.forEach(function(child, i) {
          child.rotation.x += 0.01;
          child.rotation.y -= 0.01;
          child.rotation.z += 0.01;
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
        default:
      }
    }
  };

  $V.register(three001);

})(window.VIZ);
