window.onload = () => {

  var camera, scene, renderer, composer;
  var object, light;
  var mesh1, mesh2, mesh3;
  var outline1, outline2, outline3;

  init();
  animate();

  function getBoxMesh(x = 200, y= 200, z = 200) {
    var geometry = new THREE.BoxBufferGeometry(x, y, z);
    var material = new THREE.MeshBasicMaterial();

    return new THREE.Mesh( geometry, material );
  }

  function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;
    scene = new THREE.Scene();

    mesh1 = getBoxMesh(150, 150, 150);
    mesh2 = getBoxMesh(200, 300, 200);
    mesh3 = getBoxMesh(150, 150, 150);

    mesh1.position.set(-200, 0, 0);
    mesh3.position.set(200, 0, 0);
    scene.add(mesh1);
    scene.add(mesh2);
    scene.add(mesh3);

    var outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x24ffe8, side: THREE.BackSide } );
    outline1 = new THREE.Mesh( new THREE.BoxBufferGeometry(150, 150, 150), outlineMaterial );
    outline2 = new THREE.Mesh( new THREE.BoxBufferGeometry(200, 300, 200), outlineMaterial );
    outline3 = new THREE.Mesh( new THREE.BoxBufferGeometry(150, 150, 150), outlineMaterial );

    outline1.position.set(-200, 0, 0);
    outline1.scale.multiplyScalar(1.05);
    outline2.scale.multiplyScalar(1.05);
    outline3.position.set(200, 0, 0);
    outline3.scale.multiplyScalar(1.05);

    scene.add( outline1 );
    scene.add( outline2 );
    scene.add( outline3 );

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
    const mirrorPass = new THREE.ShaderPass(THREE.MirrorShader);
    // const kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
    // const dotScreenPass = new THREE.ShaderPass(THREE.DotScreenShader);

    mirrorPass.uniforms[ 'side' ].value = 0;
    filmPass.uniforms['tDiffuse'].value = 10;
    filmPass.uniforms['sCount'].value = 600;
    filmPass.uniforms['sIntensity'].value = 1.0;
    filmPass.uniforms['nIntensity'].value = 1.0;

    // dotScreenPass.uniforms['scale'].value = 1.28;

    composer.addPass(renderPass);
    // composer.addPass(dotScreenPass);
    composer.addPass(mirrorPass);
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

    mesh1.rotation.x += 0.005;
    mesh1.rotation.y += 0.01;

    outline1.rotation.x += 0.005;
    outline1.rotation.y += 0.01;

    mesh2.rotation.x -= 0.005;
    mesh2.rotation.y += 0.01;

    outline2.rotation.x -= 0.005;
    outline2.rotation.y += 0.01;

    mesh3.rotation.x -= 0.005;
    mesh3.rotation.y -= 0.01;

    outline3.rotation.x -= 0.005;
    outline3.rotation.y -= 0.01;

    composer.render(0.1);
    // renderer.render(scene, camera);

  }

};
