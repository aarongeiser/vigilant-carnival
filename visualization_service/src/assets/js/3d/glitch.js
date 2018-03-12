//Bad TV Effect Demo

;(function($V) {
  var camera, scene, renderer
  var video, videoTexture, videoMaterial
  var composer
  var shaderTime = 0
  var badTVParams, badTVPass
  var rgbParams, rgbPass
  var filmParams, filmPass
  var renderPass, copyPass, inversionPass

  var badTVParams = {
    mute: true,
    show: true,
    distortion: 1.0,
    distortion2: 0.0,
    speed: 0.008,
    rollSpeed: 0.0
  }

  var rgbParams = {
    show: true,
    amount: 1, // 1 > -1
    angle: 0.25
  }

  var filmParams = {
    show: true,
    count: 600,
    sIntensity: 0.3,
    nIntensity: 0.8
  }

  var videoCollection = [
    'assets/video/ants.mp4',
    'assets/video/cheetah_slowmo.mp4',
    'assets/video/monkey.mp4',
    'assets/video/cheetah_detail.mp4',
    'assets/video/arial_foggy.mp4',
    'assets/video/snake_flying.mp4',
    'assets/video/snake_tree.mp4',
    'assets/video/bird_air.mp4',
    'assets/video/cheetah_approach.mp4',
    'assets/video/elk_walk.mp4',
    'assets/video/arial_mountain.mp4',
    'assets/video/frog.mp4',
    'assets/video/hummingbird_water.mp4',
    'assets/video/bird_waterfall.mp4',
    'assets/video/arial_trees.mp4',
    'assets/video/cheetah_close_up.mp4',
    'assets/video/bird_swoop.mp4',
    'assets/video/flying_lizard.mp4',
    'assets/video/jesus_lizard_1.mp4',
    'assets/video/cheetah_run.mp4',
    'assets/video/jesus_lizard_3.mp4',
    'assets/video/insect_caccoon.mp4',
    'assets/video/chameleon_eating.mp4',
    'assets/video/jesus_lizard_2.mp4',
    'assets/video/arial_greenpond.mp4',
    'assets/video/hummingbird_flower.mp4',
    'assets/video/arial_waterfall.mp4',
    'assets/video/mash-up.mp4'
  ]

  var selectedVideoIndex = -1

  var glitchyTV = {
    interval: null,
    play() {
      init()
      animate()
      setDuration()
      window.addEventListener('resize', onResize, false)
    },
    destroy() {},
    receive(message, data) {
      // console.log(Math.abs(position), data)
      rgbParams.amount = Math.abs(interpolate(0.05, 0.0, data.volume))
      const freq = Object.keys(data.frequency).map(key => {
        return data.frequency[key]
      })

      if (rgbParams.angle > 360) {
        rgbParams.angle = 0
      } else {
        rgbParams.angle += 0.005
      }

      const section = freq.length / 3
      const range = freq.slice(0, section).reduce(function(a, b) {
        return a + b
      }, 0)

      const distort = interpolate(1.5, 0.0, range / section)
      // filmParams.count = range / 8
      badTVParams.distortion = distort
      onParamsChange()
    }
  }

  const setDuration = () => {
    let duration = getRandomNumberBetween(1, 10)
    clearInterval(glitchyTV.interval)
    glitchyTV.interval = setInterval(() => {
      setVideoSource()
      setDuration()
    }, duration * 1000)
  }

  const getRandomNumberBetween = (low = 0, high = 1) => {
    return Math.floor(Math.random() * high) + low
  }

  const interpolate = (top = 1.0, bottom = 0.0, value) => {
    const distance = bottom - top
    const modifiedValue = bottom + value / 100
    return modifiedValue * distance
  }

  function getSelectedVideoIndex() {
    selectedVideoIndex++
    if (selectedVideoIndex > videoCollection.length - 1) {
      selectedVideoIndex = 0
    }
    return selectedVideoIndex
  }

  function setVideoSource() {
    if (!video) {
      video = document.createElement('video')
      video.loop = true
      video.volume = 0
    }
    video.src = videoCollection[getSelectedVideoIndex()]
    video.play()
  }

  function init() {
    camera = new THREE.PerspectiveCamera(55, 1080 / 720, 20, 3000)
    camera.position.z = 1000
    scene = new THREE.Scene()

    //Load Video
    setVideoSource()

    //init video texture
    videoTexture = new THREE.Texture(video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter

    videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture
    })

    //Add video plane
    var planeGeometry = new THREE.PlaneGeometry(1080, 720, 1, 1)
    var plane = new THREE.Mesh(planeGeometry, videoMaterial)
    scene.add(plane)
    plane.z = 0
    plane.scale.x = plane.scale.y = 1.45

    //init renderer
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(800, 600)
    document.body.appendChild(renderer.domElement)

    //POST PROCESSING
    //Create Shader Passes
    renderPass = new THREE.RenderPass(scene, camera)
    badTVPass = new THREE.ShaderPass(THREE.BadTVShader)
    rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader)
    filmPass = new THREE.ShaderPass(THREE.FilmShader)
    inversionPass = new THREE.ShaderPass(THREE.InversionShader)

    copyPass = new THREE.ShaderPass(THREE.CopyShader)

    //set shader uniforms
    filmPass.uniforms['grayscale'].value = 0

    composer = new THREE.EffectComposer(renderer)

    composer.addPass(renderPass)
    composer.addPass(inversionPass)
    composer.addPass(filmPass)
    composer.addPass(badTVPass)
    composer.addPass(rgbPass)
    composer.addPass(copyPass)
    copyPass.renderToScreen = true

    onParamsChange()
    onResize()
  }

  function onParamsChange() {
    //copy gui params into shader uniforms
    badTVPass.uniforms['distortion'].value = badTVParams.distortion
    badTVPass.uniforms['distortion2'].value = badTVParams.distortion2
    badTVPass.uniforms['speed'].value = badTVParams.speed
    badTVPass.uniforms['rollSpeed'].value = badTVParams.rollSpeed

    rgbPass.uniforms['angle'].value = rgbParams.angle * Math.PI
    rgbPass.uniforms['amount'].value = rgbParams.amount

    filmPass.uniforms['sCount'].value = filmParams.count
    filmPass.uniforms['sIntensity'].value = filmParams.sIntensity
    filmPass.uniforms['nIntensity'].value = filmParams.nIntensity
  }

  function animate() {
    shaderTime += 0.1
    badTVPass.uniforms['time'].value = shaderTime
    filmPass.uniforms['time'].value = shaderTime

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      if (videoTexture) videoTexture.needsUpdate = true
    }

    requestAnimationFrame(animate)
    composer.render(0.1)
  }

  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }

  $V.register(glitchyTV)
})(window.VIZ)
