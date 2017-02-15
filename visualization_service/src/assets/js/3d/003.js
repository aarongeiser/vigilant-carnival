
function init() {

  const config = {
    variance: {
      x: 0.4,
      y: 0.4,
      z: 4,
    },
    speed: 8,
    planeSize: 60,
    planeDefinition: 14
  };

  var camera, scene, ambientLight, light, light2, plane, renderer, W, H, defaultVertices;

  W = window.innerWidth;
  H = window.innerHeight;
  scene = new THREE.Scene();

  const rand = (min, max) => {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + (Math.random() * (max - min + 1));
  }

  const createCamera = () => {
    camera = new THREE.PerspectiveCamera(50, W / H, 1, 1000);
    camera.setLens(25);
    camera.position.set(0, 0, 40);
  }

  const createLights = () => {
    ambientLight = new THREE.AmbientLight(0xfffffff);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xff0000, 1, 0, 2);
    light.position.set(1, 200, 100);
    scene.add(light);

    light2 = new THREE.PointLight(0x0000ff, 1, 0, 2);
    light2.position.set(100, 1, 500);
    scene.add(light2);
  }

  const createPlane = () => {
    var image = new Image();
    image.onload = function () { texture.needsUpdate = true; };
    image.src = '/assets/stripes.png';

    var texture = new THREE.Texture(image, false, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);

    texture.repeat.x = 40;
    texture.repeat.y = 40;

    var planeGeometry = new THREE.PlaneGeometry(80, 80, config.planeDefinition, config.planeDefinition);
    var planeMaterial = new THREE.MeshLambertMaterial({
      map: texture
    });

    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    defaultVertices = plane.geometry.clone().vertices;

    // plane.rotation.set(0,0,0);
    scene.add(plane);
  }

  const resize = () => {
    W = window.innerWidth; // * App.config.resizeRatio,
    H = window.innerHeight; // * App.config.resizeRatio;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  };

  const render = () => {
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    plane.geometry.verticesNeedUpdate = true;
    plane.geometry.normalsNeedUpdate = true;
    plane.geometry.computeFaceNormals();
  }

  const updatePlane = () => {
    //    plane.geometry.vertices = randomVertices(plane.geometry,vertexHeight);
    for (var i = 0; i < plane.geometry.vertices.length; i++) {
      plane.geometry.vertices[i].x = defaultVertices[i].x + (rand(-config.variance.x, config.variance.x));
      plane.geometry.vertices[i].y = defaultVertices[i].y + (rand(-config.variance.y, config.variance.y));
      plane.geometry.vertices[i].z = rand(-config.variance.z, -config.variance.z);
    }
    plane.geometry.verticesNeedUpdate = true;
    plane.geometry.computeFaceNormals();
  }

  const randomTween = (i, speed) => {
    speed = speed || config.speed;
    var tween = TweenLite.to(plane.geometry.vertices[i], speed * rand(0.7, 1), {
      x: rand(-config.variance.x, config.variance.x) + defaultVertices[i].x,
      y: rand(-config.variance.y, config.variance.y) + defaultVertices[i].y,
      z: rand(-config.variance.z, config.variance.z), //rand(-config.vertexHeight,config.vertexHeight),
      onComplete: randomTween,
      onCompleteParams: [i]
    });

    return tween;
  }

  const randomTweens = () => {
    var tweens = [];
    for (var i = 0; i < plane.geometry.vertices.length; i++) {
      tweens.push(randomTween(i), 0);
    }
    return tweens;
  }

  renderer = new THREE.WebGLRenderer({
    antialias: true
  })

  createCamera();
  createLights();
  createPlane();
  resize();
  updatePlane();

  renderer.setClearColor(0xeeeeee);
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);
  TweenLite.ticker.addEventListener('tick', render);
  randomTweens();

}

init();
