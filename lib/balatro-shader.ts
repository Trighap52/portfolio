type BalatroColours = {
  c1: string
  c2: string
  c3: string
}

export type BalatroShaderOptions = {
  container: HTMLElement
  colours?: BalatroColours
  speed?: number
  spinAmount?: number
  contrast?: number
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

export type BalatroShaderUpdate = Partial<Omit<BalatroShaderOptions, "container">>

type InternalOptions = {
  container: HTMLElement
  colours: BalatroColours
  speed: number
  spinAmount: number
  contrast: number
  pixelSizeFac: number
  spinEase: number
  zoom: number
  offsetX: number
  offsetY: number
  enableSpin: boolean
  autoResize: boolean
  opacity: number
  maxFPS: number
}

type UniformLocations = {
  time: WebGLUniformLocation | null
  spinTime: WebGLUniformLocation | null
  contrast: WebGLUniformLocation | null
  spinAmount: WebGLUniformLocation | null
  pixelFac: WebGLUniformLocation | null
  spinEase: WebGLUniformLocation | null
  zoom: WebGLUniformLocation | null
  offset: WebGLUniformLocation | null
  resolution: WebGLUniformLocation | null
  c1: WebGLUniformLocation | null
  c2: WebGLUniformLocation | null
  c3: WebGLUniformLocation | null
}

const DEFAULTS: Omit<InternalOptions, "container"> = {
  colours: {
    c1: "#FF1919",
    c2: "#FFFFFF",
    c3: "#000000",
  },
  speed: 1.0,
  spinAmount: 0.5,
  contrast: 1.2,
  pixelSizeFac: 1000.0,
  spinEase: 0.5,
  zoom: 30.0,
  offsetX: -0.12,
  offsetY: 0.0,
  enableSpin: true,
  autoResize: true,
  opacity: 1.0,
  maxFPS: 30,
}

const VERT_SRC = `
  attribute vec4 a_position;
  void main() { gl_Position = a_position; }
`

const FRAG_SRC = `
  precision highp float;

  uniform float time;
  uniform float spin_time;
  uniform float contrast;
  uniform float spin_amount;
  uniform float pixel_fac;
  uniform float spin_ease;
  uniform float zoom;
  uniform vec2 offset;
  uniform vec2 resolution;
  uniform vec4 colour_1;
  uniform vec4 colour_2;
  uniform vec4 colour_3;

  void main() {
    vec2 screen_coords = gl_FragCoord.xy;
    float pixel_size = length(resolution.xy) / pixel_fac;

    vec2 uv = (floor(screen_coords.xy / pixel_size) * pixel_size - 0.5 * resolution.xy) / length(resolution.xy) - offset;
    float uv_len = length(uv);

    float speed = (spin_time * spin_ease * 0.2) + 302.2;
    float angle = atan(uv.y, uv.x) + (spin_amount > 0.0 ? speed - spin_ease * 20.0 * (spin_amount * uv_len + (1.0 - spin_amount)) : 0.0);

    vec2 mid = (resolution.xy / length(resolution.xy)) / 2.0;
    uv = vec2(uv_len * cos(angle) + mid.x, uv_len * sin(angle) + mid.y) - mid;

    uv *= zoom;
    speed = time * 2.0;

    vec2 uv2 = vec2(uv.x + uv.y);

    for (int i = 0; i < 5; i++) {
      uv2 += sin(max(uv.x, uv.y)) + uv;
      uv += 0.5 * vec2(
        cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
        sin(uv2.x - 0.113 * speed)
      );
      uv -= 1.0 * cos(uv.x + uv.y) - 1.0 * sin(uv.x * 0.711 - uv.y);
    }

    float cmod = (0.25 * contrast + 0.5 * spin_amount + 1.2);
    float paint = min(2.0, max(0.0, length(uv) * 0.035 * cmod));
    float c1p = max(0.0, 1.0 - cmod * abs(1.0 - paint));
    float c2p = max(0.0, 1.0 - cmod * abs(paint));
    float c3p = 1.0 - min(1.0, c1p + c2p);

    vec4 ret = (0.3 / contrast) * colour_1
              + (1.0 - 0.3 / contrast) * (colour_1 * c1p + colour_2 * c2p + vec4(c3p * colour_3.rgb, c3p * colour_1.a));
    gl_FragColor = ret;
  }
`

export class BalatroShader {
  private readonly canvas: HTMLCanvasElement
  private readonly gl: WebGLRenderingContext | null
  private opts: InternalOptions
  private program: WebGLProgram | null = null
  private uniforms: UniformLocations | null = null
  private rafId: number | null = null
  private lastFrameTime = 0
  private paused = false

  constructor(options: BalatroShaderOptions) {
    this.opts = {
      ...DEFAULTS,
      ...options,
      colours: {
        ...DEFAULTS.colours,
        ...options.colours,
      },
    }

    this.canvas = document.createElement("canvas")
    this.canvas.style.position = "absolute"
    this.canvas.style.top = "0"
    this.canvas.style.left = "0"
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.style.pointerEvents = "none"
    this.canvas.style.opacity = String(this.opts.opacity)

    this.opts.container.appendChild(this.canvas)
    this.gl = this.canvas.getContext("webgl", { premultipliedAlpha: false })

    if (!this.gl) {
      return
    }

    this.initProgram()
    this.resize()

    if (this.opts.autoResize) {
      window.addEventListener("resize", this.resize)
    }

    this.resume()
  }

  update(update: BalatroShaderUpdate): void {
    this.opts = {
      ...this.opts,
      ...update,
      colours: {
        ...this.opts.colours,
        ...update.colours,
      },
    }
    this.canvas.style.opacity = String(this.opts.opacity)
  }

  pause(): void {
    this.paused = true
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  resume(): void {
    if (!this.gl || !this.program || !this.uniforms) {
      return
    }

    if (this.paused) {
      this.paused = false
    }

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.render)
    }
  }

  destroy(): void {
    this.pause()
    window.removeEventListener("resize", this.resize)
    this.gl?.deleteProgram(this.program)
    this.program = null
    this.uniforms = null

    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas)
    }
  }

  private readonly render = (timestamp: number): void => {
    if (this.paused) {
      return
    }

    const gl = this.gl
    const uniforms = this.uniforms
    if (!gl || !this.program || !uniforms) {
      return
    }

    const frameDuration = this.opts.maxFPS > 0 ? 1000 / this.opts.maxFPS : 0
    const delta = timestamp - this.lastFrameTime

    if (frameDuration > 0 && delta < frameDuration) {
      this.rafId = requestAnimationFrame(this.render)
      return
    }
    this.lastFrameTime = timestamp

    const time = timestamp * 0.001 * this.opts.speed

    gl.useProgram(this.program)
    gl.uniform1f(uniforms.time, time)
    gl.uniform1f(uniforms.spinTime, time)
    gl.uniform1f(uniforms.contrast, this.opts.contrast)
    gl.uniform1f(uniforms.spinAmount, this.opts.enableSpin ? this.opts.spinAmount : 0.0)
    gl.uniform1f(uniforms.pixelFac, this.opts.pixelSizeFac)
    gl.uniform1f(uniforms.spinEase, this.opts.spinEase)
    gl.uniform1f(uniforms.zoom, this.opts.zoom)
    gl.uniform2f(uniforms.offset, this.opts.offsetX, this.opts.offsetY)
    gl.uniform2f(uniforms.resolution, this.canvas.width, this.canvas.height)

    const [r1, g1, b1] = this.hexToRgb(this.opts.colours.c1)
    const [r2, g2, b2] = this.hexToRgb(this.opts.colours.c2)
    const [r3, g3, b3] = this.hexToRgb(this.opts.colours.c3)

    gl.uniform4f(uniforms.c1, r1, g1, b1, 1)
    gl.uniform4f(uniforms.c2, r2, g2, b2, 1)
    gl.uniform4f(uniforms.c3, r3, g3, b3, 1)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    this.rafId = requestAnimationFrame(this.render)
  }

  private readonly resize = (): void => {
    if (!this.gl) {
      return
    }

    const width = Math.max(1, this.opts.container.clientWidth)
    const height = Math.max(1, this.opts.container.clientHeight)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    this.canvas.width = Math.floor(width * dpr)
    this.canvas.height = Math.floor(height * dpr)
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  private initProgram(): void {
    if (!this.gl) {
      return
    }

    const gl = this.gl
    const vert = this.compile(gl.VERTEX_SHADER, VERT_SRC)
    const frag = this.compile(gl.FRAGMENT_SHADER, FRAG_SRC)
    if (!vert || !frag) {
      return
    }

    const program = gl.createProgram()
    if (!program) {
      return
    }

    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      return
    }

    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    const pos = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    this.program = program
    this.uniforms = {
      time: gl.getUniformLocation(program, "time"),
      spinTime: gl.getUniformLocation(program, "spin_time"),
      contrast: gl.getUniformLocation(program, "contrast"),
      spinAmount: gl.getUniformLocation(program, "spin_amount"),
      pixelFac: gl.getUniformLocation(program, "pixel_fac"),
      spinEase: gl.getUniformLocation(program, "spin_ease"),
      zoom: gl.getUniformLocation(program, "zoom"),
      offset: gl.getUniformLocation(program, "offset"),
      resolution: gl.getUniformLocation(program, "resolution"),
      c1: gl.getUniformLocation(program, "colour_1"),
      c2: gl.getUniformLocation(program, "colour_2"),
      c3: gl.getUniformLocation(program, "colour_3"),
    }

    gl.deleteShader(vert)
    gl.deleteShader(frag)
  }

  private compile(type: number, source: string): WebGLShader | null {
    if (!this.gl) {
      return null
    }

    const shader = this.gl.createShader(type)
    if (!shader) {
      return null
    }

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(shader)
      return null
    }

    return shader
  }

  private hexToRgb(hex: string): [number, number, number] {
    const normalized = hex.replace("#", "")
    const padded =
      normalized.length === 3
        ? normalized
            .split("")
            .map((char) => char + char)
            .join("")
        : normalized

    const value = Number.parseInt(padded, 16)
    if (Number.isNaN(value)) {
      return [1, 1, 1]
    }

    return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
  }
}
