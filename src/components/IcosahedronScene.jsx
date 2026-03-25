// src/components/IcosahedronScene.jsx
// Three.js icosahedron — lazy-loaded, brand colors, mouse parallax
import { useEffect, useRef } from 'react'

const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

export default function IcosahedronScene({ className = '', style = {} }) {
  const canvasRef  = useRef(null)
  const cleanupRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let animId   = null
    const mobile = isMobile()

    // ── mouse state (window-level for smooth parallax) ──────────────
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── lazy-load Three.js ───────────────────────────────────────────
    import('three').then((THREE) => {
      if (disposed) return

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !mobile,
        alpha: true,
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      const w = canvas.clientWidth  || 400
      const h = canvas.clientHeight || 400
      renderer.setSize(w, h, false)

      // Scene + Camera
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
      camera.position.z = 3.5

      // Parent group — mouse parallax tilts this
      const group = new THREE.Group()
      scene.add(group)

      // Geometry — detail 1: nice crystal facets, light vertex count
      const geo = new THREE.IcosahedronGeometry(1, 1)

      // Vertex colors: purple (#7C3AED) at bottom → orange (#F97316) at top
      const pos    = geo.attributes.position
      const colors = []
      const cA     = new THREE.Color('#7C3AED')
      const cB     = new THREE.Color('#F97316')
      for (let i = 0; i < pos.count; i++) {
        const t = (pos.getY(i) + 1) / 2        // 0 = bottom, 1 = top
        colors.push(...cA.clone().lerp(cB, t).toArray())
      }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

      // Main mesh — flat shading shows individual crystal faces
      const mat = new THREE.MeshPhongMaterial({
        vertexColors: true,
        flatShading:  true,
        shininess:    90,
        specular:     new THREE.Color('#ffffff'),
      })
      const mesh = new THREE.Mesh(geo, mat)
      group.add(mesh)

      // Wireframe overlay — subtle purple grid
      const wireMat  = new THREE.MeshBasicMaterial({
        color:       '#9b5cf6',
        wireframe:   true,
        transparent: true,
        opacity:     0.14,
      })
      const wireMesh = new THREE.Mesh(geo, wireMat)
      group.add(wireMesh)

      // Lights — purple top-right, orange bottom-left
      scene.add(new THREE.AmbientLight(0xffffff, 0.15))
      const l1 = new THREE.PointLight(new THREE.Color('#7C3AED'), 5, 12)
      l1.position.set(2, 3, 2)
      scene.add(l1)
      const l2 = new THREE.PointLight(new THREE.Color('#F97316'), 3.5, 12)
      l2.position.set(-2, -2, 2)
      scene.add(l2)

      // IntersectionObserver — pause render when offscreen
      let visible = true
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
      io.observe(canvas)

      // ResizeObserver — keep canvas in sync with container
      const ro = new ResizeObserver(() => {
        const cw = canvas.clientWidth
        const ch = canvas.clientHeight
        if (!cw || !ch) return
        camera.aspect = cw / ch
        camera.updateProjectionMatrix()
        renderer.setSize(cw, ch, false)
      })
      ro.observe(canvas)

      // Animation loop
      let time = 0
      function animate() {
        animId = requestAnimationFrame(animate)
        if (!visible || disposed) return

        time += 0.005

        // Auto-rotate the mesh
        mesh.rotation.y = time * 0.7
        mesh.rotation.x = Math.sin(time * 0.4) * 0.18
        wireMesh.rotation.copy(mesh.rotation)

        // Smooth mouse parallax on parent group
        group.rotation.x += (mouseY * 0.32 - group.rotation.x) * 0.04
        group.rotation.y += (mouseX * 0.32 - group.rotation.y) * 0.04

        renderer.render(scene, camera)
      }
      animate()

      // Store cleanup for when React unmounts
      cleanupRef.current = () => {
        io.disconnect()
        ro.disconnect()
        cancelAnimationFrame(animId)
        geo.dispose()
        mat.dispose()
        wireMat.dispose()
        renderer.dispose()
      }
    })

    return () => {
      disposed = true
      window.removeEventListener('mousemove', onMouseMove)
      if (animId) cancelAnimationFrame(animId)
      cleanupRef.current?.()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', ...style }}
    />
  )
}
