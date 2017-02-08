window.onload = () => {

  var camera, scene, renderer, composer;
  var object, light, mesh;

  init();
  animate();

  function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;
    scene = new THREE.Scene();

    var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial();

    mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    scene.add( new THREE.AmbientLight( 0x000000 ) );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener( 'resize', onWindowResize, false );



    // postprocessing

    composer = new THREE.EffectComposer(renderer);
    const copyPass = new THREE.ShaderPass(THREE.CopyShader);
    const renderPass = new THREE.RenderPass(scene, camera);
    const filmPass = new THREE.ShaderPass(THREE.FilmShader);
    // const mirrorPass = new THREE.ShaderPass(THREE.MirrorShader);
    // const kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
    // const dotScreenPass = new THREE.ShaderPass(THREE.DotScreenShader);

    // mirrorPass.uniforms[ 'side' ].value = 0;
    filmPass.uniforms['tDiffuse'].value = 10;
    filmPass.uniforms['sCount'].value = 600;
    filmPass.uniforms['sIntensity'].value = 1.0;
    filmPass.uniforms['nIntensity'].value = 1.0;

    // dotScreenPass.uniforms['scale'].value = 2.5;

    composer.addPass(renderPass);
    // composer.addPass(dotScreenPass);
    // composer.addPass(mirrorPass);
    composer.addPass(filmPass);
    // composer.addPass(kaleidoPass);



    composer.addPass(copyPass);
    copyPass.renderToScreen = true;

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );

  }

  function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;

    composer.render(0.1);
    // renderer.render(scene, camera);

  }

};
