import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  SphereGeometry,
  MeshPhysicalMaterial,
  Mesh,
  CanvasTexture,
  RepeatWrapping,
  Vector2,
  Group,
  MeshBasicMaterial,
  Vector3,
  Euler,
  PMREMGenerator,
  TextureLoader,
  EquirectangularReflectionMapping,
  DoubleSide,
  LinearFilter,
  // NearestFilter,
  BackSide,
  SRGBColorSpace,
  Quaternion
} from 'three'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'

export class BallVisualizer {
  constructor(container, options = {}) {
    this.container = container

    // Three.js objects
    this.scene = null
    this.camera = null
    this.renderer = null
    this.ball = null

    // Camera settings
    this.cameraAngle = options.cameraAngle || 0 // 0 = equator, positive = north, negative = south

    // Animation and interaction state
    this.isDragging = false
    this.previousMousePosition = { x: 0, y: 0 }
    this.rotationSpeed = { x: 0, y: 0.0105 }
    this.friction = 0.995
    this.animationFrameId = null
    this.isSpinningFast = false
    this.fastSpinSpeed = 0.25 // Base speed for fast spin
    this.fastSpinDuration = 1000 // Duration in ms

    // Asset paths and mode
    this.arcadeTexturePath = options.arcadeTexturePath
    this.stickerTexturePath = options.stickerTexturePath
    this.imageSource = options.imageSource
    this.fallbackImageSource = options.fallbackImageSource
    this.mode = options.mode || 'metal'

    // Callbacks
    this.onDragStateChange = options.onDragStateChange
    this.onReady = options.onReady
    this.onClick = options.onClick

    // Resize observer
    this.resizeObserver = null

    // Spin on click option
    this.spinOnClick = options.spinOnClick || false
    this._clickStartTime = null
    this._clickStartPos = null
    this._lastClickTime = 0 // Add debounce tracking
    this._clickDebounceTime = 300 // Debounce time in ms

    // Bind methods
    this.animate = this.animate.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  updateCameraPosition(distance) {
    // Convert angle from degrees to radians
    const angleRad = (this.cameraAngle * Math.PI) / 180

    // Calculate camera position using spherical coordinates
    this.camera.position.x = 0
    this.camera.position.y = Math.sin(angleRad) * distance
    this.camera.position.z = Math.cos(angleRad) * distance

    this.camera.lookAt(0, 0, 0)
    this.camera.updateProjectionMatrix()
  }

  init() {
    // Scene setup
    this.scene = new Scene()

    // Renderer setup
    this.renderer = new WebGLRenderer({ alpha: true, antialias: true })
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.setPixelRatio(window.devicePixelRatio)

    // Get initial size from container
    const containerRect = this.container.getBoundingClientRect()
    const size = Math.min(containerRect.width, containerRect.height)
    this.renderer.setSize(size, size)
    this.container.appendChild(this.renderer.domElement)

    // Camera setup
    const ballRadius = size / 3.4375 // Increased by additional 10% (3.125 * 1.1 = 3.4375)
    const cameraDistance = size / 1.0
    this.camera = new PerspectiveCamera(50, 1, 1, cameraDistance * 2)
    this.updateCameraPosition(cameraDistance)

    this.setupBall(ballRadius)
    this.setupEventListeners()
    this.setupResizeObserver()
    this.animate()
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.container) {
          this.onResize()
        }
      }
    })
    this.resizeObserver.observe(this.container)
  }

  onResize() {
    const containerRect = this.container.getBoundingClientRect()
    const size = Math.min(containerRect.width, containerRect.height)

    // Update renderer size
    this.renderer.setSize(size, size)

    // Update camera
    const cameraDistance = size / 1.0
    this.updateCameraPosition(cameraDistance)
    this.camera.far = cameraDistance * 2
    this.camera.updateProjectionMatrix()

    // Update ball size
    const ballRadius = size / 3.4375 // Increased by additional 10% (3.125 * 1.1 = 3.4375)
    if (this.ball) {
      // Remove old ball and decal
      while (this.ball.children.length > 0) {
        const child = this.ball.children[0]
        child.geometry.dispose()
        child.material.dispose()
        this.ball.remove(child)
      }
      this.ball.geometry.dispose()

      // Create new ball geometry
      const ballGeo = new SphereGeometry(ballRadius, 128, 128)
      this.ball.geometry = ballGeo

      // Recreate decal at new size
      this.createDecal(ballRadius)
    }
  }

  setupBall(ballRadius) {
    if (this.mode === 'metal') {
      this.setupMetalBall(ballRadius)
    } else if (this.mode === 'glass-inner-wall') {
      this.setupGlassInnerWallBall(ballRadius)
    } else {
      this.setupGlassBall(ballRadius)
    }
  }

  setupMetalBall(ballRadius) {
    // Flakes texture
    const flakeTexture = new CanvasTexture(new FlakesTexture())
    flakeTexture.wrapS = RepeatWrapping
    flakeTexture.wrapT = RepeatWrapping
    flakeTexture.repeat.set(12, 12)

    // Grid texture
    const gridTexture = this.createGridTexture()

    // Ball geometry and material
    const ballGeo = new SphereGeometry(ballRadius, 128, 128)
    const ballMat = new MeshPhysicalMaterial({
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      metalness: 0.82,
      roughness: 0.225,
      color: 0xfcfcfc,
      normalMap: flakeTexture,
      normalScale: new Vector2(0.375, 0.375),
      clearcoatNormalMap: gridTexture,
      clearcoatNormalScale: new Vector2(1.5, 1.5),
      envMapIntensity: 2.1
    })

    this.ball = new Mesh(ballGeo, ballMat)
    // Start with ball rotated counter-clockwise
    this.ball.rotation.y = (-5 * Math.PI) / 9 // -120 degrees (counter-clockwise)
    this.scene.add(this.ball)

    this.setupEnvironment(ballMat)
    this.createDecal(ballRadius)
  }

  // Shared glass material config for both glass modes
  getGlassMaterial() {
    return new MeshPhysicalMaterial({
      transmission: 0.95,
      roughness: 0.0,
      metalness: 0.005,
      clearcoat: 0.5,
      clearcoatRoughness: 0.0,
      ior: 1.4,
      envMapIntensity: 1.5,
      opacity: 1.0,
      transparent: true,
      color: 0xffffff,
      thickness: 0.5,
      attenuationDistance: 0.5,
      attenuationColor: 0xffffff
    })
  }

  setupGlassBall(ballRadius) {
    // Image sphere (full color)
    const imageRadius = ballRadius * 0.95
    const glassRadius = ballRadius * 0.951 // just slightly larger
    const innerGeo = new SphereGeometry(imageRadius, 128, 128)

    const createBallWithTexture = (texture) => {
      texture.colorSpace = SRGBColorSpace
      // Use linear filtering for better quality
      texture.minFilter = LinearFilter
      texture.magFilter = LinearFilter
      if (this.renderer) {
        // Set anisotropy to max supported by the device
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
      }
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      texture.repeat.set(2, 1)
      // Set proper pixel ratio
      texture.encoding = SRGBColorSpace
      const innerMat = new MeshBasicMaterial({
        map: texture,
        side: DoubleSide
      })
      const innerSphere = new Mesh(innerGeo, innerMat)
      this.scene.add(innerSphere)
      this.ball = innerSphere
      this.onReady?.()
    }

    const createBasicBall = () => {
      // Create ball with just the smiley face color if all textures fail
      const innerMat = new MeshBasicMaterial({
        color: 0xf0f0f0,
        side: DoubleSide
      })
      const innerSphere = new Mesh(innerGeo, innerMat)
      this.scene.add(innerSphere)
      this.ball = innerSphere
      this.onReady?.()
    }

    // Add 10-second timeout to texture loading
    this.loadTextureWithTimeout(this.imageSource, 5000)
      .then(createBallWithTexture)
      .catch(async (error) => {
        console.warn('Failed to load avatar texture, using smiley face fallback:', error)
        try {
          // Try to use smiley face fallback
          const fallbackTexture = await this.createFallbackTexture()
          createBallWithTexture(fallbackTexture)
        } catch (fallbackError) {
          console.warn('Smiley face fallback also failed, creating basic ball:', fallbackError)
          createBasicBall()
        }
      })

    // Glass overlay sphere (arcade reflections, high contrast)
    const glassGeo = new SphereGeometry(glassRadius, 128, 128)
    const glassMat = this.getGlassMaterial()
    const glassSphere = new Mesh(glassGeo, glassMat)
    glassSphere.rotation.y = (-4 * Math.PI) / 9
    this.scene.add(glassSphere)
    // Set up arcade env map for glass
    this.setupEnvironment(glassMat)
  }

  setupGlassInnerWallBall(ballRadius) {
    // Image on the inner wall (full color)
    const imageRadius = ballRadius * 0.98
    const glassRadius = ballRadius * 0.981 // just slightly larger
    const innerGeo = new SphereGeometry(imageRadius, 128, 128)

    const createBallWithTexture = (texture) => {
      texture.colorSpace = SRGBColorSpace
      // Use linear filtering for better quality
      texture.minFilter = LinearFilter
      texture.magFilter = LinearFilter
      if (this.renderer) {
        // Set anisotropy to max supported by the device
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
      }
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      texture.repeat.set(1, 1)
      // Set proper pixel ratio
      texture.encoding = SRGBColorSpace
      const innerMat = new MeshBasicMaterial({
        map: texture,
        side: BackSide
      })
      const innerWall = new Mesh(innerGeo, innerMat)
      this.scene.add(innerWall)
      this.ball = innerWall
      this.onReady?.()
    }

    const createBasicBall = () => {
      // Create ball with just the smiley face color if all textures fail
      const innerMat = new MeshBasicMaterial({
        color: 0xf0f0f0,
        side: BackSide
      })
      const innerWall = new Mesh(innerGeo, innerMat)
      this.scene.add(innerWall)
      this.ball = innerWall
      this.onReady?.()
    }

    // Add 10-second timeout to texture loading
    this.loadTextureWithTimeout(this.imageSource, 5000)
      .then(createBallWithTexture)
      .catch(async (error) => {
        console.warn('Failed to load avatar texture, using smiley face fallback:', error)
        try {
          // Try to use smiley face fallback
          const fallbackTexture = await this.createFallbackTexture()
          createBallWithTexture(fallbackTexture)
        } catch (fallbackError) {
          console.warn('Smiley face fallback also failed, creating basic ball:', fallbackError)
          createBasicBall()
        }
      })

    // Glass overlay sphere (arcade reflections, high contrast)
    const glassGeo = new SphereGeometry(glassRadius, 128, 128)
    const glassMat = this.getGlassMaterial()
    const glassSphere = new Mesh(glassGeo, glassMat)
    glassSphere.rotation.y = (-4 * Math.PI) / 9
    this.scene.add(glassSphere)
    // Set up arcade env map for glass
    this.setupEnvironment(glassMat)
  }

  createGridTexture() {
    const gridSize = 512
    const canvas = document.createElement('canvas')
    canvas.width = gridSize
    canvas.height = gridSize
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'rgb(128, 128, 255)'
    ctx.fillRect(0, 0, gridSize, gridSize)

    ctx.strokeStyle = 'rgb(120, 160, 120)'
    // Calculate line width based on container size
    const containerRect = this.container.getBoundingClientRect()
    const size = Math.min(containerRect.width, containerRect.height)
    // Base line width is 6px at 120px container size
    const baseLineWidth = 6
    const baseSize = 120
    // Use square root scaling to make it 75% as thick at 240px
    const lineWidth = baseLineWidth * Math.sqrt(baseSize / size)
    ctx.lineWidth = lineWidth

    const numLines = 10
    const spacing = gridSize / numLines

    for (let i = 0; i <= numLines; i++) {
      ctx.beginPath()
      ctx.moveTo(i * spacing, 0)
      ctx.lineTo(i * spacing, gridSize)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * spacing)
      ctx.lineTo(gridSize, i * spacing)
      ctx.stroke()
    }

    const gridTexture = new CanvasTexture(canvas)
    gridTexture.wrapS = RepeatWrapping
    gridTexture.wrapT = RepeatWrapping
    gridTexture.repeat.set(3, 2)
    return gridTexture
  }

  loadTextureWithTimeout(url, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const loader = new TextureLoader()
      let isResolved = false

      // Set up timeout
      const timeout = setTimeout(() => {
        if (!isResolved) {
          isResolved = true
          reject(new Error(`Texture loading timed out after ${timeoutMs}ms: ${url}`))
        }
      }, timeoutMs)

      // Load texture
      loader.load(
        url,
        (texture) => {
          if (!isResolved) {
            isResolved = true
            clearTimeout(timeout)
            resolve(texture)
          }
        },
        undefined, // onProgress callback
        (error) => {
          if (!isResolved) {
            isResolved = true
            clearTimeout(timeout)
            reject(error)
          }
        }
      )
    })
  }

  async createFallbackTexture() {
    // Simply load the smiley face image we already have
    if (this.fallbackImageSource) {
      try {
        const texture = await this.loadTextureWithTimeout(this.fallbackImageSource, 5000)
        texture.colorSpace = SRGBColorSpace
        return texture
      } catch (error) {
        console.warn('Failed to load smiley face fallback:', error)
      }
    }

    // If smiley face fails, throw error to indicate complete failure
    throw new Error('No fallback texture available')
  }

  createDecal(ballRadius) {
    if (!this.stickerTexturePath) {
      // If no sticker texture, ball is ready immediately
      this.onReady?.()
      return
    }

    // Add 10-second timeout to decal texture loading
    this.loadTextureWithTimeout(this.stickerTexturePath, 5000)
      .then((texture) => {
        const material = new MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -4
        })

        const decalSize = ballRadius * 1.15
        const position = new Vector3(0, 0, ballRadius * 0.95)
        const orientation = new Euler(0, 0, 0)
        const size = new Vector3(decalSize, decalSize, decalSize)

        const decalGeometry = new DecalGeometry(this.ball, position, orientation, size)
        const decal = new Mesh(decalGeometry, material)
        this.ball.add(decal)

        // Emit ready after decal is added
        this.onReady?.()
      })
      .catch((error) => {
        // On error, still emit ready since the ball itself is usable
        console.warn('Failed to load decal texture:', error)
        this.onReady?.()
      })
  }

  setupEnvironment(ballMat) {
    const envGroup = new Group()
    this.scene.add(envGroup)

    const envGeometry = new SphereGeometry(500, 64, 64)
    envGeometry.scale(-1, 1, 1)
    const envMaterial = new MeshBasicMaterial({
      transparent: true,
      opacity: 0
    })
    const envMesh = new Mesh(envGeometry, envMaterial)
    envGroup.add(envMesh)

    const envmaploader = new PMREMGenerator(this.renderer)
    // Add 10-second timeout to environment texture loading
    this.loadTextureWithTimeout(this.arcadeTexturePath, 5000)
      .then((texture) => {
        texture.mapping = EquirectangularReflectionMapping
        const envmap = envmaploader.fromEquirectangular(texture)
        ballMat.envMap = envmap.texture
        ballMat.envMapIntensity = 1.2
        ballMat.needsUpdate = true
        texture.dispose()
      })
      .catch((error) => {
        console.warn('Failed to load environment texture:', error)
        // Environment texture is optional, so we just log the error
      })
  }

  setupEventListeners() {
    // Initial events on container
    this.container.addEventListener('mousedown', this.onMouseDown)
    this.container.addEventListener('touchstart', this.onTouchStart)
    this.container.addEventListener('touchmove', this.onTouchMove)
    this.container.addEventListener('touchend', this.onTouchEnd)
  }

  onMouseDown(event) {
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    }
    this._clickStartTime = Date.now()
    this._clickStartPos = { x: event.clientX, y: event.clientY }

    // Always stop any rotation immediately
    this.isSpinningFast = false
    this.rotationSpeed = { x: 0, y: 0 }
    this.friction = 0.995

    this.isDragging = true
    this.onDragStateChange?.(true)

    // Add global event listeners when dragging starts
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseMove(event) {
    if (!this.isDragging) return

    const deltaMove = {
      x: event.clientX - this.previousMousePosition.x,
      y: event.clientY - this.previousMousePosition.y
    }

    // Invert rotation for glass-inner-wall mode
    const multiplier = this.mode === 'glass-inner-wall' ? -0.012 : 0.012
    this.rotationSpeed.x = deltaMove.y * multiplier
    this.rotationSpeed.y = deltaMove.x * multiplier

    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    }
  }

  onMouseUp(event) {
    if (this.isDragging) {
      this.isDragging = false
      this.onDragStateChange?.(false)

      // Remove global event listeners when dragging ends
      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mouseup', this.onMouseUp)
    }

    // Click detection logic
    if (this._clickStartTime && this._clickStartPos) {
      const elapsed = Date.now() - this._clickStartTime
      const dx = (event?.clientX ?? 0) - this._clickStartPos.x
      const dy = (event?.clientY ?? 0) - this._clickStartPos.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Add debounce check
      const now = Date.now()
      if (elapsed < 200 && dist < 5 && now - this._lastClickTime > this._clickDebounceTime) {
        this._lastClickTime = now
        this.onClick?.()
        if (this.spinOnClick) {
          this.spinFast()
        }
      }

      this._clickStartTime = null
      this._clickStartPos = null
    }
  }

  onTouchStart(event) {
    if (event.touches.length === 1) {
      this.previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
      this._clickStartTime = Date.now()
      this._clickStartPos = { x: event.touches[0].clientX, y: event.touches[0].clientY }

      // Always stop any rotation immediately
      this.isSpinningFast = false
      this.rotationSpeed = { x: 0, y: 0 }
      this.friction = 0.995

      this.isDragging = true
      this.onDragStateChange?.(true)
    }
  }

  onTouchMove(event) {
    if (!this.isDragging) return

    const deltaMove = {
      x: event.touches[0].clientX - this.previousMousePosition.x,
      y: event.touches[0].clientY - this.previousMousePosition.y
    }

    // Invert rotation for glass-inner-wall mode
    const multiplier = this.mode === 'glass-inner-wall' ? -0.012 : 0.012
    this.rotationSpeed.x = deltaMove.y * multiplier
    this.rotationSpeed.y = deltaMove.x * multiplier

    this.previousMousePosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }

  onTouchEnd(event) {
    this.isDragging = false
    this.onDragStateChange?.(false)

    // Click detection logic
    if (this._clickStartTime && this._clickStartPos) {
      const elapsed = Date.now() - this._clickStartTime
      // Use changedTouches if available, otherwise touches[0] or fallback to previous
      let endX = this._clickStartPos.x,
        endY = this._clickStartPos.y
      if (event && event.changedTouches && event.changedTouches[0]) {
        endX = event.changedTouches[0].clientX
        endY = event.changedTouches[0].clientY
      }
      const dx = endX - this._clickStartPos.x
      const dy = endY - this._clickStartPos.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Add debounce check
      const now = Date.now()
      if (elapsed < 200 && dist < 5 && now - this._lastClickTime > this._clickDebounceTime) {
        this._lastClickTime = now
        this.onClick?.()
        if (this.spinOnClick) {
          this.spinFast()
        }
      }

      this._clickStartTime = null
      this._clickStartPos = null
    }
  }

  spinFast() {
    if (this.isSpinningFast) return

    this.isSpinningFast = true
    const originalSpeed = { ...this.rotationSpeed }
    const originalFriction = this.friction

    // Set high speed and reduce friction
    this.rotationSpeed.y = this.fastSpinSpeed
    this.friction = 0.999

    // Reset after duration
    setTimeout(() => {
      this.isSpinningFast = false
      this.rotationSpeed = originalSpeed
      this.friction = originalFriction
    }, this.fastSpinDuration)
  }

  animate() {
    if (!this.isDragging && !this.isSpinningFast) {
      this.rotationSpeed.x *= this.friction
      this.rotationSpeed.y *= this.friction
    }

    if (this.ball) {
      // this old method gets inverted when the ball is rotated

      // this.ball.rotation.x += this.rotationSpeed.x
      // this.ball.rotation.y += this.rotationSpeed.y

      // this new method is more consistent
      if (this.rotationSpeed.x !== 0 || this.rotationSpeed.y !== 0) {
        // Create quaternions for world X and Y axes
        const qx = new Quaternion()
        const qy = new Quaternion()
        qx.setFromAxisAngle(new Vector3(1, 0, 0), this.rotationSpeed.x)
        qy.setFromAxisAngle(new Vector3(0, 1, 0), this.rotationSpeed.y)
        // Apply Y first, then X (screen-like behavior)
        this.ball.quaternion.premultiply(qy)
        this.ball.quaternion.premultiply(qx)
      }
    }

    this.renderer.render(this.scene, this.camera)
    this.animationFrameId = requestAnimationFrame(this.animate)
  }

  cleanup() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    // Clean up all event listeners
    this.container.removeEventListener('mousedown', this.onMouseDown)
    this.container.removeEventListener('touchstart', this.onTouchStart)
    this.container.removeEventListener('touchmove', this.onTouchMove)
    this.container.removeEventListener('touchend', this.onTouchEnd)

    // Clean up any lingering global listeners
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)

    if (this.ball) {
      this.ball.geometry.dispose()
      this.ball.material.dispose()
      this.scene.remove(this.ball)
    }

    if (this.renderer) {
      this.renderer.dispose()
    }
  }

  pause() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  resume() {
    if (!this.animationFrameId) {
      this.animate()
    }
  }
}
