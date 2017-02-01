window.onload = () => {

  var camera, scene, renderer, composer;
  var object, light;

  init();
  animate();

  function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    object = new THREE.Object3D();
    scene.add( object );

    var geometry = new THREE.SphereGeometry( 1, 6, 4 );
    var material = new THREE.MeshPhongMaterial( { color: 0x24ffe8, shading: THREE.FlatShading } );

    for ( var i = 0; i < 100; i ++ ) {

      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
      mesh.position.multiplyScalar( Math.random() * 400 );
      mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
      object.add( mesh );

    }

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 90, 90 );
    scene.add( light );

    // postprocessing

    composer = new THREE.EffectComposer(renderer);
    const copyPass = new THREE.ShaderPass(THREE.CopyShader);
    const renderPass = new THREE.RenderPass(scene, camera);
    // const filmPass = new THREE.ShaderPass(THREE.FilmShader);
    const mirrorPass = new THREE.ShaderPass(THREE.MirrorShader);
    // const kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
    // const dotScreenPass = new THREE.ShaderPass(THREE.DotScreenShader);

    mirrorPass.uniforms[ 'side' ].value = 0;
    // filmPass.uniforms['tDiffuse'].value = 5;
    // filmPass.uniforms['sCount'].value = 800;
    // filmPass.uniforms['sIntensity'].value = 0.9;
    // filmPass.uniforms['nIntensity'].value = 0.8;

    // dotScreenPass.uniforms['scale'].value = 2.5;

    composer.addPass(renderPass);
    // composer.addPass(dotScreenPass);
    composer.addPass(mirrorPass);
    // composer.addPass(filmPass);
    // composer.addPass(kaleidoPass);



    composer.addPass(copyPass);
    copyPass.renderToScreen = true;

    window.addEventListener( 'resize', onWindowResize, false );

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );

  }

  function animate() {

    requestAnimationFrame( animate );

    object.rotation.x += 0.005;
    object.rotation.y += 0.01;

    composer.render(0.1);
    // renderer.render(scene, camera);

  }

};
