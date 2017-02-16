function mapToRange (inVal = 0.5, inMin = 0.0, inMax = 1.0, outMin = -45.0, outMax = 45.0) {
  const within = (inVal => inMin && inVal <= inMax);
  let val = inVal;
  if (!within) return val;
  if (outMin < 0) {
    val = ((Math.abs(outMin) + Math.abs(outMax)) * (val / inMax)) + outMin;
  } else {
    val = (outMax - outMin) * (val / inMax);
  }

  console.log({ val });

  return val;

}

function init() {

  var camera, scene, ambientLight, light, light2, plane, renderer, W, H, defaultVertices;

  const config = {
    variance: {
      x: 0.8,
      y: 0.8,
      z: 8,
    },
    speed: 10,
    planeSize: 80,
    planeDefinition: 14
  };

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
    camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.setLens(25);
    camera.position.set(0, 0, 50);
  }

  const createLights = () => {
    // ambientLight = new THREE.AmbientLight(0xfffffff);
    // scene.add(ambientLight);

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x484848, 0.5);
    hemiLight.castshadow = true;
		scene.add( hemiLight );

    light = new THREE.PointLight(0xff0000, 2, 100);
    // light.position.set(0, 2, 0);
    light.castshadow = true;
    scene.add(light);

    light2 = new THREE.PointLight(0x00ffff, 2, 100);
    // light2.position.set(0, 2, 0);
    light2.castshadow = true;
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

  // renderer.setClearColor(0xeeeeee);
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);
  TweenLite.ticker.addEventListener('tick', render);
  randomTweens();

}


init();

socket = io('http://localhost:3001/viz');
socket.on('connect', () => {
  // socket.on('audio', draw);
  // socket.on('down', draw);
  console.log('connected');
});
socket.on('input-a-pot', data => {
  // console.log(data);
  // GAP = data.value * 100;
  // if (GAP > 100) { GAP = 100; }
  // if (GAP < 1) { GAP = 1; }
});
socket.on('input-b-pot', data => {
  // console.log(data);
  // SLICE_WIDTH = data.value * 100;
  // if (SLICE_WIDTH >= 100) { SLICE_WIDTH = 100; }
  // if (SLICE_WIDTH <= 1) { SLICE_WIDTH = 1; }
});
