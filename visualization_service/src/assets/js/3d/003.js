// function mapToRange (inVal = 0.5, inMin = 0.0, inMax = 1.0, outMin = -45.0, outMax = 45.0) {
//   const within = (inVal => inMin && inVal <= inMax);
//   let val = inVal;
//   if (!within) return val;
//   if (outMin < 0) {
//     val = ((Math.abs(outMin) + Math.abs(outMax)) * (val / inMax)) + outMin;
//   } else {
//     val = (outMax - outMin) * (val / inMax);
//   }
//
//   console.log({ val });
//
//   return val;
//
// }

(function($V) {

  var camera, scene, texture, plane, renderer, W, H, defaultVertices;
  var config = {
    variance: {
      x: 0.8,
      y: 0.8,
      z: 8,
    },
    speed: 10,
    planeSize: 80,
    planeDefinition: 8
  };

  function rand (min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + (Math.random() * (max - min + 1));
  }

  var image = new Image();
  image.onload = function () { texture.needsUpdate = true; };
  image.src = '/assets/stripes.png';

  var texture = new THREE.Texture(image, false, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);

  texture.repeat.x = 40;
  texture.repeat.y = 40;

  var three003 = {

    createCamera: function() {
      camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.setLens(25);
      camera.position.set(0, 0, 50);
    },

    createLights: function() {
      var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x484848, 0.8);
      hemiLight.castshadow = true;
      scene.add( hemiLight );

      var light = new THREE.PointLight(0xff0000, 2, 100);
      light.castshadow = true;
      scene.add(light);

      var light2 = new THREE.PointLight(0x00ffff, 2, 100);
      light2.castshadow = true;
      scene.add(light2);
    },

    createPlane: function () {
      var planeGeometry = new THREE.PlaneGeometry(80, 80, config.planeDefinition, config.planeDefinition);
      var planeMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide
      });

      plane = new THREE.Mesh(planeGeometry, planeMaterial);
      defaultVertices = plane.geometry.clone().vertices;

      defaultVertices.forEach(function(def) {
        def.z = rand(-config.variance.z, config.variance.z);
      });

      // plane.rotation.set(0,0,0);
      scene.add(plane);
    },

    render: function () {
      renderer.clear();
      renderer.render(scene, camera);
      renderer.clearDepth();
      plane.geometry.verticesNeedUpdate = true;
      plane.geometry.normalsNeedUpdate = true;
      plane.geometry.computeFaceNormals();
    },

    updatePlane: function () {
      for (var i = 0; i < plane.geometry.vertices.length; i++) {
        var vert = plane.geometry.vertices[i];
        var defaultVert = defaultVertices[i];
        vert.x = defaultVert.x + (rand(-config.variance.x, config.variance.x));
        vert.y = defaultVert.y + (rand(-config.variance.y, config.variance.y));
        vert.z = rand(-config.variance.z, config.variance.z);
      }
      plane.geometry.verticesNeedUpdate = true;
      plane.geometry.computeFaceNormals();
    },

    randomTween: function(i, speed) {
      speed = speed || config.speed;
      var defaultVert = defaultVertices[i];
      var tween = TweenLite.to(plane.geometry.vertices[i], speed, {
        x: rand(-config.variance.x, config.variance.x) + defaultVert.x,
        y: rand(-config.variance.y, config.variance.y) + defaultVert.y,
        z: rand(-config.variance.z, config.variance.z), //rand(-config.vertexHeight,config.vertexHeight),
      });

      return tween;
    },

    randomTweens: function () {
      var tweens = [];
      for (var i = 0; i < plane.geometry.vertices.length; i++) {
        tweens.push(this.randomTween(i), 0);
      }
      return tweens;
    },

    resize: function() {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    },

    init: function() {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('audioCanvas')
      });
      scene = new THREE.Scene();
      W = window.innerWidth;
      H = window.innerHeight;

      this.createCamera();
      this.createLights();
      this.createPlane();
      this.resize();
      this.updatePlane();
    },

    play: function () {
      this.init();
      // renderer.setClearColor(0xeeeeee);
      renderer.render(scene, camera);
      // TweenLite.ticker.addEventListener('tick', this.render);
      // this.randomTweens();
    },

    destroy: function() {
      // TweenLite.ticker.removeEventListener('tick', this.render);
      camera =
      scene =
      plane =
      renderer =
      W =
      H =
      defaultVertices = null;
    },

    receive: function(event, data) {

      // const val = data.volume / 4;

      plane.geometry.vertices.map(function(v, i) {

        const val = defaultVertices[i].z * (data.volume / Object.keys(data.frequency).length);

        v.z = val * 2;
        return v;
      });

      // plane.rotation.y += 0.005;
      plane.rotation.x -= 0.005;
      plane.rotation.z += 0.005;

      this.render();
    }
  };

  $V.register(three003);


})(window.VIZ);
