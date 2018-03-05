;(function($V) {
  var three003 = {
    initialized: false,
    camera: null,
    scene: null,
    texture: null,
    plane: null,
    renderer: null,
    W: null,
    H: null,
    light1: null,
    light2: null,
    defaultVertices: null,
    planeMaterial: null,
    config: {
      variance: {
        x: 0.8,
        y: 0.8,
        z: 8
      },
      planeSize: 70,
      planeDefinition: 10,
      repeatSize: 20
    },

    rand: function(min, max) {
      if (max == null) {
        max = min
        min = 0
      }
      return min + Math.random() * (max - min + 1)
    },

    createCamera: function() {
      this.camera = new THREE.PerspectiveCamera(50, this.W / this.H, 0.1, 100)
      this.camera.position.set(0, 0, 50)
    },

    createLights: function() {
      var ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
      ambientLight.castshadow = true
      this.scene.add(ambientLight)

      this.light1 = new THREE.PointLight($V.hslToRgb(0.3), 10, 60, 2)
      this.light1.position.set(1, 20, 1)
      this.scene.add(this.light1)

      this.light2 = new THREE.PointLight($V.hslToRgb(0.6), 10, 60, 2)
      this.light2.position.set(1, -20, 1)
      this.scene.add(this.light2)
    },

    createPlane: function() {
      var that = this
      var planeGeometry = new THREE.PlaneGeometry(
        this.config.planeSize,
        this.config.planeSize,
        this.config.planeDefinition,
        this.config.planeDefinition
      )
      this.planeMaterial = new THREE.MeshLambertMaterial({
        map: this.texture,
        side: THREE.DoubleSide
      })
      this.texture.repeat.x = this.texture.repeat.y = this.config.repeatSize
      this.texture.needsUpdate = true

      this.plane = new THREE.Mesh(planeGeometry, this.planeMaterial)
      this.defaultVertices = this.plane.geometry.clone().vertices

      this.defaultVertices.forEach(function(def) {
        def.z = that.rand(-that.config.variance.z, that.config.variance.z)
      })

      this.scene.add(this.plane)
    },

    render: function() {
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)
      this.renderer.clearDepth()
      this.plane.geometry.verticesNeedUpdate = true
      this.plane.geometry.normalsNeedUpdate = true
      this.plane.geometry.computeFaceNormals()
    },

    updatePlane: function() {
      var that = this
      this.plane.geometry.vertices.forEach(function(vert, i) {
        var defaultVert = that.defaultVertices[i]
        vert.x =
          defaultVert.x +
          that.rand(-that.config.variance.x, that.config.variance.x)
        vert.y =
          defaultVert.y +
          that.rand(-that.config.variance.y, that.config.variance.x)
        vert.z = that.rand(-that.config.variance.z, that.config.variance.z)
      })

      this.plane.geometry.verticesNeedUpdate = true
      this.plane.geometry.computeFaceNormals()
    },

    resize: function() {
      this.W = window.innerWidth
      this.H = window.innerHeight
      this.renderer.setSize(this.W, this.H)
      this.camera.aspect = this.W / this.H
      this.camera.updateProjectionMatrix()
    },

    init: function() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById('audioCanvas')
      })
      this.scene = new THREE.Scene()
      this.W = window.innerWidth
      this.H = window.innerHeight
      this.texture = $V.getTexture()
      this.createCamera()
      this.createLights()
      this.createPlane()
      this.updatePlane()
      this.resize()
    },

    play: function() {
      this.init()

      var that = this

      function animate() {
        that.reqId = requestAnimationFrame(animate)

        $V.rotateObject(that.plane, function() {
          that.plane.rotation.x += 0.001
          that.plane.rotation.z -= 0.001
        })

        that.renderer.render(that.scene, that.camera)
      }

      this.reqId = requestAnimationFrame(animate)
    },

    destroy: function() {
      if (this.reqId) {
        window.cancelAnimationFrame(this.reqId)
      }
    },

    receive: function(event, data) {
      var that = this
      switch (event) {
        case 'audio':
          const modifier = data.volume / Object.keys(data.frequency).length
          this.plane.geometry.vertices.map(function(v, i) {
            const val = that.defaultVertices[i].z * modifier
            v.z = val * 1.5
            return v
          })
          this.render()
          break
        case 'input':
          this.handleInput(data)
          return this.render()
        default:
      }
    },

    handleInput: function(data) {
      var input = data.source + '-' + data.name
      if (data.source === 'rotation') {
        return $V.handleRotation(data)
      }
      switch (input) {
        case 'texture-button1':
          if (data.value === 1) {
            this.texture = $V.getTexture()
            this.texture.repeat.x = this.texture.repeat.y = this.config.repeatSize
            this.texture.needsUpdate
            this.plane.material.map = this.texture
            this.plane.material.map.needsUpdate = true
            this.plane.material.needsUpdate = true
            this.plane.needsUpdate = true
          }
          break
        case 'texture-pot1':
          var num = parseFloat(data.value, 10)
          var perc = this.config.repeatSize * num
          if (perc < 1) {
            perc = 1
          }
          this.plane.material.map.repeat.x = perc
          this.plane.material.map.repeat.y = perc
          this.plane.needsUpdate = true
          break
        case 'lighting-pot1':
          $V.setLightColor(this.light1, parseFloat(data.value, 10))
          break
        case 'lighting-pot2':
          $V.setLightColor(this.light2, parseFloat(data.value, 10))
          break
        case 'geometry-button1':
          if (data.value === 0) {
            this.scene.remove(this.plane)
            this.createPlane()
            this.updatePlane()
            this.render()
          }
          break
      }
    }
  }

  $V.register(three003)
})(window.VIZ)
