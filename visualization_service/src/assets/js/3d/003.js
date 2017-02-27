(function($V) {

  var camera, scene, texture, plane, renderer, W, H, defaultVertices, planeMaterial;
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


  // window.expandTexture = function(size) {
  //   var texture = $V.getTexture();
  //
  //   console.log(texture);
  //   plane.material.map = texture;
  //   plane.material.map.needsUpdate = true;
  //   plane.material.needsUpdate = true;
  //   plane.needsUpdate = true;
  //   // planeMaterial.map = texture;
  //   // if (size) {
  //   //   texture.repeat.x = texture.repeat.y = size;
  //   // }
  //
  // }


  var three003 = {

    createCamera: function() {
      camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.setLens(25);
      camera.position.set(0, 0, 50);
    },

    createLights: function() {
      this.hemiLight = new THREE.HemisphereLight( 0x000000, 0xffffff, 0.7);
      this.hemiLight.castshadow = true;
      scene.add( this.hemiLight );

      this.light1 = new THREE.PointLight($V.hslToRgb(1), 10, 100, 2);
      this.light1.position.set(1, 20, 1);
      scene.add(this.light1);

      this.light2 = new THREE.PointLight($V.hslToRgb(.6), 10, 100, 2);
      this.light2.position.set(1, -20, 1);
      scene.add(this.light2);
    },

    createPlane: function () {
      var texture = $V.getTexture();
      var planeGeometry = new THREE.PlaneGeometry(80, 80, config.planeDefinition, config.planeDefinition);
      planeMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      texture.repeat.x = 20;
      texture.repeat.y = 20;
      texture.needsUpdate = true;

      plane = new THREE.Mesh(planeGeometry, planeMaterial);
      defaultVertices = plane.geometry.clone().vertices;

      defaultVertices.forEach(function(def) {
        def.z = rand(-config.variance.z, config.variance.z);
      });

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
      renderer.render(scene, camera);
    },

    destroy: function() {
      camera =
      scene =
      plane =
      renderer =
      W =
      H =
      defaultVertices = null;
    },

    receive: function(event, data) {
      plane.rotation.x -= 0.01;
      plane.rotation.z += 0.01;
      this.hemiLight.position.z += 0.01;
      // this.hemiLight.position.y += 0.01;
      this.hemiLight.position.x -= 0.01;
      // plane.rotation.y -= 0.01;

      switch (event) {
        case 'audio':
          plane.geometry.vertices.map(function(v, i) {
            const val = defaultVertices[i].z * (data.volume / Object.keys(data.frequency).length);
            v.z = val * 2;
            return v;
          });
          break;
        default:
      }

      this.render();
    }
  };

  $V.register(three003);


})(window.VIZ);
