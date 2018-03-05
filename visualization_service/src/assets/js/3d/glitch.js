//Bad TV Effect Demo

;(function($V) {
  var camera, scene, renderer
  var video, videoTexture, videoMaterial
  var composer
  var shaderTime = 0
  var badTVParams, badTVPass
  var staticParams, staticPass
  var rgbParams, rgbPass
  var filmParams, filmPass
  var renderPass, copyPass
  var pnoise, globalParams

  var badTVParams = {
    mute: true,
    show: true,
    distortion: 1.0,
    distortion2: 1.0,
    speed: 0.15,
    rollSpeed: 0.0
  }

  var staticParams = {
    show: true,
    amount: 0.0,
    size2: 1
  }

  var rgbParams = {
    show: true,
    amount: 1, // 1 > -1
    angle: 0.2
  }

  var filmParams = {
    show: true,
    count: 800,
    sIntensity: 0.9,
    nIntensity: 0.4
  }

  var glitchyTV = {
    play: function() {
      console.log('playing glitch')
      init()
      animate()
    },
    destroy: function() {},
    receive: function(message, data) {
      const top = 1
      const bottom = 0.0
      const distance = bottom - top
      const position = bottom + data.volume / 100 * distance

      console.log(Math.abs(position), data)

      rgbParams.amount = Math.abs(position)
      staticParams.amount = Math.abs(position)
      onParamsChange()
    }
  }

  function init() {
    camera = new THREE.PerspectiveCamera(55, 1080 / 720, 20, 3000)
    camera.position.z = 1000
    scene = new THREE.Scene()

    //Load Video
    video = document.createElement('video')
    video.loop = true
    video.src = 'assets/video/cheetah.mp4'
    video.play()

    //Use webcam
    // video = document.createElement('video');
    // video.width = 320;
    // video.height = 240;
    // video.autoplay = true;
    // video.loop = true;
    // //Webcam video
    // window.URL = window.URL || window.webkitURL;
    // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    // //get webcam
    // navigator.getUserMedia({
    // 	video: true
    // }, function(stream) {
    // 	//on webcam enabled
    // 	video.src = window.URL.createObjectURL(stream);
    // }, function(error) {
    // 	prompt.innerHTML = 'Unable to capture WebCam. Please reload the page.';
    // });

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

    //add stats
    // stats = new Stats()
    // stats.domElement.style.position = 'absolute'
    // stats.domElement.style.top = '0px'
    // container.appendChild(stats.domElement)

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
    staticPass = new THREE.ShaderPass(THREE.StaticShader)
    copyPass = new THREE.ShaderPass(THREE.CopyShader)

    //set shader uniforms
    filmPass.uniforms['grayscale'].value = 0

    //Init DAT GUI control panel

    onToggleShaders()
    onToggleMute()
    onParamsChange()

    window.addEventListener('resize', onResize, false)
    renderer.domElement.addEventListener('click', randomizeParams, false)
    onResize()
    // randomizeParams()
  }

  function onParamsChange() {
    //copy gui params into shader uniforms
    badTVPass.uniforms['distortion'].value = badTVParams.distortion
    badTVPass.uniforms['distortion2'].value = badTVParams.distortion2
    badTVPass.uniforms['speed'].value = badTVParams.speed
    badTVPass.uniforms['rollSpeed'].value = badTVParams.rollSpeed

    staticPass.uniforms['amount'].value = staticParams.amount
    staticPass.uniforms['size'].value = staticParams.size2

    rgbPass.uniforms['angle'].value = rgbParams.angle * Math.PI
    rgbPass.uniforms['amount'].value = rgbParams.amount

    filmPass.uniforms['sCount'].value = filmParams.count
    filmPass.uniforms['sIntensity'].value = filmParams.sIntensity
    filmPass.uniforms['nIntensity'].value = filmParams.nIntensity
  }

  function randomizeParams() {
    if (Math.random() < 0.2) {
      //you fixed it!
      badTVParams.distortion = 0.1
      badTVParams.distortion2 = 0.1
      badTVParams.speed = 0
      badTVParams.rollSpeed = 0
      rgbParams.angle = 0
      rgbParams.amount = 0
      staticParams.amount = 0
    } else {
      badTVParams.distortion = Math.random() * 10 + 0.1
      badTVParams.distortion2 = Math.random() * 10 + 0.1
      badTVParams.speed = Math.random() * 0.4
      badTVParams.rollSpeed = Math.random() * 0.2
      rgbParams.angle = Math.random() * 2
      rgbParams.amount = Math.random() * 0.03
      staticParams.amount = Math.random() * 0.2
    }

    onParamsChange()
  }

  function onToggleMute() {
    video.volume = badTVParams.mute ? 0 : 1
  }

  function onToggleShaders() {
    //Add Shader Passes to Composer
    //order is important
    composer = new THREE.EffectComposer(renderer)
    composer.addPass(renderPass)

    if (filmParams.show) {
      composer.addPass(filmPass)
    }

    if (badTVParams.show) {
      composer.addPass(badTVPass)
    }

    if (rgbParams.show) {
      composer.addPass(rgbPass)
    }

    if (staticParams.show) {
      composer.addPass(staticPass)
    }

    composer.addPass(copyPass)
    copyPass.renderToScreen = true
  }

  function animate() {
    shaderTime += 0.1
    badTVPass.uniforms['time'].value = shaderTime
    filmPass.uniforms['time'].value = shaderTime
    staticPass.uniforms['time'].value = shaderTime

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
