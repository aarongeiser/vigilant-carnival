THREE.InversionShader = {
  uniforms: {
    tDiffuse: { value: 5 }
  },
  vertexShader: [
    'varying vec2 vUv;',

    'void main() {',

    'vUv = uv;',
    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'
  ].join('\n'),
  fragmentShader: [
    'uniform sampler2D tDiffuse;',
    'varying vec2 vUv;',

    'void main() {',
    'vec4 color = texture2D(tDiffuse, vUv);',

    // 'color.rgb = 0.5 - color.rgb;',
    'gl_FragColor = vec4(0.6 - color.r, 0.6 - color.g, 0.6 - color.b, color.a);',

    '}'
  ].join('\n')
}
