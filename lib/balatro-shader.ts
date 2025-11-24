type ColourConfig = { c1: string; c2: string; c3: string }

type BalatroOptions = {
  container?: string | HTMLElement | null
  colours?: ColourConfig
  speed?: number
  contrast?: number
  spinAmount?: number
  pixelSizeFac?: number
  spinEase?: number
  zoom?: number
  offsetX?: number
  offsetY?: number
  enableSpin?: boolean
  autoResize?: boolean
  opacity?: number
  maxFPS?: number
}

const defaultOpts: Required<BalatroOptions> = {
  container: null,
  colours: { c1: "#FF1919", c2: "#FFFFFF", c3: "#000000" },
  speed: 1.0,
  contrast: 1.2,
  spinAmount: 0.5,
  pixelSizeFac: 700.0,
  spinEase: 0.5,
  zoom: 30.0,
  offsetX: -0.12,
  offsetY: 0.0,
  enableSpin: true,
  autoResize: true,
  opacity: 1,
  maxFPS: 60,
}

const vertexSrc = `
attribute vec2 a_position;
void main(){gl_Position=vec4(a_position,0.,1.);}
`

const fragmentSrc = `
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uSpeed;
uniform float uContrast;
uniform float uSpinAmount;
uniform float uPixelSizeFac;
uniform float uSpinEase;
uniform float uZoom;
uniform vec2 uOffset;
uniform bool uSpin;

vec4 effect(vec2 screenSize, vec2 screen_coords) {
    float pixel_size = length(screenSize.xy) / uPixelSizeFac;
    vec2 uv = (floor(screen_coords.xy*(1./pixel_size))*pixel_size - 0.5*screenSize.xy)/length(screenSize.xy) - uOffset;
    float uv_len = length(uv);
    float speed = (-2.0*uSpinEase*0.2);
    if(uSpin){
       speed = iTime * speed;
    }
    speed += 302.2;
    float new_pixel_angle = atan(uv.y, uv.x) + speed - uSpinEase*20.*(1.*uSpinAmount*uv_len + (1. - 1.*uSpinAmount));
    vec2 mid = (screenSize.xy/length(screenSize.xy))/2.;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);
    uv *= uZoom;
    speed = iTime*(7.0*uSpeed);
    vec2 uv2 = vec2(uv.x+uv.y);
    for(int i=0; i < 5; i++) {
        uv2 += sin(max(uv.x, uv.y)) + uv;
        uv  += 0.5*vec2(cos(5.1123314 + 0.353*uv2.y + speed*0.131121),sin(uv2.x - 0.113*speed));
        uv  -= 1.0*cos(uv.x + uv.y) - 1.0*sin(uv.x*0.711 - uv.y);
    }
    float contrast_mod = (0.25*uContrast + 0.5*uSpinAmount + 1.2);
    float paint_res = min(2., max(0.,length(uv)*(0.035)*contrast_mod));
    float c1p = max(0.,1. - contrast_mod*abs(1.-paint_res));
    float c2p = max(0.,1. - contrast_mod*abs(paint_res));
    float c3p = 1. - min(1., c1p + c2p);
    float light = (0.4 - 0.2)*max(c1p*5. - 4., 0.) + 0.4*max(c2p*5. - 4., 0.);
    vec4 colour1 = vec4(uColor1, 1.0);
    vec4 colour2 = vec4(uColor2, 1.0);
    vec4 colour3 = vec4(uColor3, 1.0);
    return (0.3/uContrast)*colour1 + (1. - 0.3/uContrast)*(colour1*c1p + colour2*c2p + vec4(c3p*colour3.rgb, c3p*colour1.a)) + light;
}

void main(){
    vec2 fragCoord = gl_FragCoord.xy;
    vec4 fragColor = effect(iResolution.xy, fragCoord);
    gl_FragColor = fragColor;
}`

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "")
  const bigint = parseInt(normalized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r / 255, g / 255, b / 255]
}

export class BalatroShader {
  private canvas: HTMLCanvasElement
  private gl: WebGLRenderingContext
  private program: WebGLProgram
  private opts: Required<BalatroOptions>
  private frame: number | null = null
  private start = 0
  private lastFrame = 0
  private uniforms: Record<string, WebGLUniformLocation | null> = {}
  private resizeObserver?: ResizeObserver

  constructor(options: BalatroOptions = {}) {
    if (typeof document === "undefined") {
      throw new Error("BalatroShader must be instantiated in a browser environment")
    }
    this.opts = { ...defaultOpts, ...options }
    const container = this.resolveContainer(this.opts.container)
    this.canvas = document.createElement("canvas")
    this.canvas.style.position = "absolute"
    this.canvas.style.inset = "0"
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.style.opacity = `${this.opts.opacity}`
    this.canvas.style.pointerEvents = "none"
    this.gl = this.canvas.getContext("webgl", { antialias: true }) as WebGLRenderingContext
    if (!this.gl) throw new Error("WebGL not supported")
    container.appendChild(this.canvas)
    this.program = this.initProgram()
    this.setUniforms()
    if (this.opts.autoResize) this.observeResize()
    this.frame = requestAnimationFrame((t) => this.draw(t))
  }

  private resolveContainer(target: string | HTMLElement | null): HTMLElement {
    if (typeof document === "undefined") {
      throw new Error("BalatroShader requires document at runtime")
    }
    if (!target) {
      return document.body
    }
    if (typeof target === "string") {
      const el = document.querySelector<HTMLElement>(target)
      if (!el) throw new Error(`Container ${target} not found`)
      el.style.position = el.style.position || "relative"
      return el
    }
    target.style.position = target.style.position || "relative"
    return target
  }

  private compile(type: number, src: string) {
    const shader = this.gl.createShader(type)!
    this.gl.shaderSource(shader, src)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader))
      this.gl.deleteShader(shader)
      throw new Error("Shader compile failed")
    }
    return shader
  }

  private initProgram() {
    const vs = this.compile(this.gl.VERTEX_SHADER, vertexSrc)
    const fs = this.compile(this.gl.FRAGMENT_SHADER, fragmentSrc)
    const program = this.gl.createProgram()!
    this.gl.attachShader(program, vs)
    this.gl.attachShader(program, fs)
    this.gl.linkProgram(program)
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(program))
      throw new Error("Program link failed")
    }
    this.gl.useProgram(program)
    const positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      this.gl.STATIC_DRAW,
    )
    const posLoc = this.gl.getAttribLocation(program, "a_position")
    this.gl.enableVertexAttribArray(posLoc)
    this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0)
    this.uniforms = {
      iResolution: this.gl.getUniformLocation(program, "iResolution"),
      iTime: this.gl.getUniformLocation(program, "iTime"),
      uColor1: this.gl.getUniformLocation(program, "uColor1"),
      uColor2: this.gl.getUniformLocation(program, "uColor2"),
      uColor3: this.gl.getUniformLocation(program, "uColor3"),
      uSpeed: this.gl.getUniformLocation(program, "uSpeed"),
      uContrast: this.gl.getUniformLocation(program, "uContrast"),
      uSpinAmount: this.gl.getUniformLocation(program, "uSpinAmount"),
      uPixelSizeFac: this.gl.getUniformLocation(program, "uPixelSizeFac"),
      uSpinEase: this.gl.getUniformLocation(program, "uSpinEase"),
      uZoom: this.gl.getUniformLocation(program, "uZoom"),
      uOffset: this.gl.getUniformLocation(program, "uOffset"),
      uSpin: this.gl.getUniformLocation(program, "uSpin"),
    }
    return program
  }

  private observeResize() {
    const resize = () => this.resize()
    this.resize()
    this.resizeObserver = new ResizeObserver(resize)
    this.resizeObserver.observe(this.canvas)
  }

  private resize() {
    const dpr = window.devicePixelRatio || 1
    const width = this.canvas.clientWidth * dpr
    const height = this.canvas.clientHeight * dpr
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width
      this.canvas.height = height
    }
    this.gl.viewport(0, 0, width, height)
    if (this.uniforms.iResolution) this.gl.uniform2f(this.uniforms.iResolution, width, height)
  }

  private setUniforms() {
    const { colours, speed, contrast, spinAmount, pixelSizeFac, spinEase, zoom, offsetX, offsetY, enableSpin } = this.opts
    const [c1, c2, c3] = [colours.c1, colours.c2, colours.c3].map(hexToRgb)
    this.gl.useProgram(this.program)
    if (this.uniforms.uColor1) this.gl.uniform3f(this.uniforms.uColor1, c1[0], c1[1], c1[2])
    if (this.uniforms.uColor2) this.gl.uniform3f(this.uniforms.uColor2, c2[0], c2[1], c2[2])
    if (this.uniforms.uColor3) this.gl.uniform3f(this.uniforms.uColor3, c3[0], c3[1], c3[2])
    if (this.uniforms.uSpeed) this.gl.uniform1f(this.uniforms.uSpeed, speed)
    if (this.uniforms.uContrast) this.gl.uniform1f(this.uniforms.uContrast, contrast)
    if (this.uniforms.uSpinAmount) this.gl.uniform1f(this.uniforms.uSpinAmount, spinAmount)
    if (this.uniforms.uPixelSizeFac) this.gl.uniform1f(this.uniforms.uPixelSizeFac, pixelSizeFac)
    if (this.uniforms.uSpinEase) this.gl.uniform1f(this.uniforms.uSpinEase, spinEase)
    if (this.uniforms.uZoom) this.gl.uniform1f(this.uniforms.uZoom, zoom)
    if (this.uniforms.uOffset) this.gl.uniform2f(this.uniforms.uOffset, offsetX, offsetY)
    if (this.uniforms.uSpin) this.gl.uniform1i(this.uniforms.uSpin, enableSpin ? 1 : 0)
  }

  private draw(time: number) {
    if (!this.program) return
    if (this.start === 0) this.start = time
    const elapsed = time - this.lastFrame
    const minDelta = 1000 / (this.opts.maxFPS || 60)
    if (elapsed < minDelta) {
      this.frame = requestAnimationFrame((t) => this.draw(t))
      return
    }
    this.lastFrame = time
    const t = (time - this.start) / 1000
    this.gl.useProgram(this.program)
    if (this.uniforms.iTime) this.gl.uniform1f(this.uniforms.iTime, t)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
    this.frame = requestAnimationFrame((t) => this.draw(t))
  }

  update(options: Partial<BalatroOptions>) {
    this.opts = { ...this.opts, ...options }
    this.setUniforms()
  }

  pause() {
    if (this.frame) cancelAnimationFrame(this.frame)
    this.frame = null
  }

  resume() {
    if (!this.frame) this.frame = requestAnimationFrame((t) => this.draw(t))
  }

  destroy() {
    this.pause()
    this.resizeObserver?.disconnect()
    this.canvas.remove()
  }
}
