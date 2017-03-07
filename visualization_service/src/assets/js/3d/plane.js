(function($V) {

  var camera, scene, texture, plane, renderer;
  var composer, W, H, defaultVertices, hemiLight, planeMaterial;

  var config = {
    variance: {
      x: 0.8,
      y: 0.8,
      z: 8,
    },
    planeSize: 50,
    planeDefinition: 8,
    repeatSize: 20
  };

  function rand (min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + (Math.random() * (max - min + 1));
  }

  var three003 = {

    createCamera: function() {
      camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.setLens(25);
      camera.position.set(0, 0, 50);
    },

    createLights: function() {
      hemiLight = new THREE.HemisphereLight( 0x000000, 0xffffff, 0.8);
      hemiLight.castshadow = true;
      scene.add(hemiLight);

      this.light1 = new THREE.PointLight($V.hslToRgb(.3), 10, 60, 2);
      this.light1.position.set(1, 20, 1);
      scene.add(this.light1);

      this.light2 = new THREE.PointLight($V.hslToRgb(.6), 10, 60  , 2);
      this.light2.position.set(1, -20, 1);
      scene.add(this.light2);
    },

    createPlane: function () {
      var planeGeometry = new THREE.PlaneGeometry(config.planeSize, config.planeSize, config.planeDefinition, config.planeDefinition);
      planeMaterial = new THREE.MeshLambertMaterial({
        map: this.texture,
        side: THREE.DoubleSide
      });
      this.texture.repeat.x = this.texture.repeat.y = config.repeatSize;
      this.texture.needsUpdate = true;

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
      this.texture = $V.getTexture();
      this.createCamera();
      this.createLights();
      this.createPlane();
      this.updatePlane();
      this.resize();

      composer = new THREE.EffectComposer(renderer);
      const copyPass = new THREE.ShaderPass(THREE.CopyShader);
      const renderPass = new THREE.RenderPass(scene, camera);

      composer.addPass(renderPass);
      composer.addPass(copyPass);
      copyPass.renderToScreen = true;
    },

    play: function () {
      this.init();
      var that = this;

      function animate () {
        that.reqId = requestAnimationFrame(animate);

        $V.rotateObject(plane, function() {
          plane.rotation.x -= 0.001;
          plane.rotation.z -= 0.001;
        });

        hemiLight.position.z += 0.01;
        hemiLight.position.x -= 0.01;

        composer.render(0.1);
      }

      this.reqId = requestAnimationFrame(animate);
    },

    destroy: function() {
      if (this.reqId) {
        window.cancelAnimationFrame(this.reqId);
      }
    },

    receive: function(event, data) {
      switch (event) {
        case 'audio':
          const modifier = (data.volume / Object.keys(data.frequency).length);
          plane.geometry.vertices.map(function(v, i) {
            const val = defaultVertices[i].z * modifier;
            v.z = val * 2;
            return v;
          });
          this.render();
          break;
        case 'input':
          this.handleInput(data);
          return this.render();
        default:
      }
    },

    handleInput: function(data) {
      var input = data.source + '-' + data.name;
      if (data.source === 'rotation') {
        return $V.handleRotation(data);
      }
      switch (input) {
        case 'texture-button1':
          if (data.value === 1) {
            this.texture = $V.getTexture();
            this.texture.repeat.x = this.texture.repeat.y = config.repeatSize;
            this.texture.needsUpdate;
            plane.material.map = this.texture;
            plane.material.map.needsUpdate = true;
            plane.material.needsUpdate = true;
            plane.needsUpdate = true;
          }
          break;
        case 'texture-pot1':
          var num = parseFloat(data.value, 10);
          var perc = (config.repeatSize * num);
          if (perc < 1) {
            perc = 1;
          }
          plane.material.map.repeat.x = perc;
          plane.material.map.repeat.y = perc;
          plane.needsUpdate = true;
          break;
        case 'lighting-pot1':
          $V.setLightColor(this.light1, parseFloat(data.value, 10));
          break;
        case 'lighting-pot2':
          $V.setLightColor(this.light2, parseFloat(data.value, 10));
          break;
        case 'geometry-button1':
          if (data.value === 0) {
            scene.remove(plane);
            this.createPlane();
            this.updatePlane();
            this.render();
          }
          break;
      }
    }
  };

  $V.register(three003);


})(window.VIZ);
