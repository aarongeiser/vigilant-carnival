(function($V) {

  var scene, camera, renderer, object;
  var SLICE_WIDTH = 5;
  var GAP = 1;

  var image = new Image();
  image.onload = function () { texture.needsUpdate = true; };
  image.src = '/assets/stripes.png';

  var texture = new THREE.Texture(image, false, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);


  var three002 = {
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    light: null,
    object: null,
    addBars: function() {
      var geometry = new THREE.BoxGeometry(SLICE_WIDTH, SLICE_WIDTH, 25);
      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        // transparent: true,
        map: texture
      });
      var increment = GAP;
      var HEIGHT = window.innerHeight;
      var xpos = 0;

      for ( var i = 0; i < 128; i ++ ) {
        var mesh = new THREE.Mesh(geometry, material);
        xpos += i === 0 ? xpos : geometry.parameters.width + increment;
        mesh.position.set(xpos, 1, 1);
        // mesh.rotation.y = 5;
        mesh.rotation.x = 10;
        // mesh.castShadow = true;
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

      // this.object.position.set(-window.innerWidth / 2, 0, 0);
      this.scene.add(this.object);

      this.addBars();

      this.scene.add(new THREE.AmbientLight(0x666666));

      this.light = new THREE.DirectionalLight(0xeeeeee);
      this.light.position.set(-20, -10, 1);
      this.scene.add(this.light);

      this.composer = new THREE.EffectComposer(this.renderer);
      const copyPass = new THREE.ShaderPass(THREE.CopyShader);
      const renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);
      const mirrorPass = new THREE.ShaderPass(THREE.MirrorShader);
      this.composer.addPass(mirrorPass);

      // const filmPass = new THREE.ShaderPass(THREE.FilmShader);
      // filmPass.uniforms['tDiffuse'].value = 5;
      // filmPass.uniforms['sCount'].value = 800;
      // filmPass.uniforms['sIntensity'].value = 0.9;
      // filmPass.uniforms['nIntensity'].value = 0.8;
      // this.composer.addPass(filmPass);
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
      this.object.children.forEach(function (child, i) {
        val = data.frequency[i] / 2;
        child.scale.y = val ? val : 0.0001;
        child.opacity = 0.5
      });
    }
  }

  $V.register(three002);

})(window.VIZ);



// window.onload = () => {
//
//   var camera, scene, renderer, composer;
//   var object, light;
//   var mesh1, mesh2, mesh3;
//   var outline1, outline2, outline3;
//
//   init();
//   animate();
//
//   function getBoxMesh(x = 200, y= 200, z = 200) {
//     var geometry = new THREE.BoxBufferGeometry(x, y, z);
//     var material = new THREE.MeshBasicMaterial();
//
//     return new THREE.Mesh( geometry, material );
//   }
//
//   function init() {
//
//     camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
//     camera.position.z = 400;
//     scene = new THREE.Scene();
//
//     mesh1 = getBoxMesh(100, 150, 100);
//     mesh2 = getBoxMesh(200, 500, 200);
//     mesh3 = getBoxMesh(100, 150, 100);
//
//     mesh1.position.set(-200, 0, 0);
//     mesh3.position.set(200, 0, 0);
//     scene.add(mesh1);
//     scene.add(mesh2);
//     scene.add(mesh3);
//
//     var outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffF000, side: THREE.BackSide } );
//     outline1 = new THREE.Mesh( new THREE.BoxBufferGeometry(150, 150, 150), outlineMaterial );
//     outline2 = new THREE.Mesh( new THREE.BoxBufferGeometry(200, 300, 200), outlineMaterial );
//     outline3 = new THREE.Mesh( new THREE.BoxBufferGeometry(150, 150, 150), outlineMaterial );
//
//     outline1.position.set(-200, 0, 0);
//     outline1.scale.multiplyScalar(1.20);
//     outline2.scale.multiplyScalar(1.20);
//     outline3.position.set(200, 0, 0);
//     outline3.scale.multiplyScalar(1.20);
//
//     scene.add( outline1 );
//     scene.add( outline2 );
//     scene.add( outline3 );
//
//     scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
//
//     scene.add( new THREE.AmbientLight( 0xff0000 ) );
//
//     renderer = new THREE.WebGLRenderer();
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);
//
//     window.addEventListener( 'resize', onWindowResize, false );
//
//
//
//     // postprocessing
//
//     composer = new THREE.EffectComposer(renderer);
//     const copyPass = new THREE.ShaderPass(THREE.CopyShader);
//     const renderPass = new THREE.RenderPass(scene, camera);
//     const filmPass = new THREE.ShaderPass(THREE.FilmShader);
//     const mirrorPass = new THREE.ShaderPass(THREE.MirrorShader);
//     const kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
//     const dotScreenPass = new THREE.ShaderPass(THREE.DotScreenShader);
//
//     // mirrorPass.uniforms[ 'side' ].value = 0;
//     filmPass.uniforms['tDiffuse'].value = 10;
//     filmPass.uniforms['sCount'].value = 600;
//     filmPass.uniforms['sIntensity'].value = 1.0;
//     filmPass.uniforms['nIntensity'].value = 1.0;
//
//     // dotScreenPass.uniforms['scale'].value = 1.28;
//
//     composer.addPass(renderPass);
//     // composer.addPass(dotScreenPass);
//     // composer.addPass(mirrorPass);
//     // composer.addPass(filmPass);
//     composer.addPass(kaleidoPass);
//
//
//
//     composer.addPass(copyPass);
//     copyPass.renderToScreen = true;
//
//   }
//
//   function onWindowResize() {
//
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//
//     // renderer.setSize( window.innerWidth, window.innerHeight );
//     composer.setSize( window.innerWidth, window.innerHeight );
//
//   }
//
//   function animate() {
//
//     requestAnimationFrame( animate );
//
//     mesh1.rotation.x += 0.005;
//     mesh1.rotation.y += 0.01;
//
//     outline1.rotation.x -= 0.005;
//     outline1.rotation.y -= 0.01;
//
//     mesh2.rotation.x -= 0.005;
//     mesh2.rotation.y += 0.01;
//
//     outline2.rotation.x += 0.005;
//     outline2.rotation.y -= 0.01;
//
//     mesh3.rotation.x -= 0.005;
//     mesh3.rotation.y -= 0.01;
//
//     outline3.rotation.x += 0.005;
//     outline3.rotation.y += 0.01;
//
//     composer.render(0.1);
//     // renderer.render(scene, camera);
//
//   }
//
// };
