import * as THREE from 'three'
import { OrbitControlsFunction } from './orbitControls.js'
import arid2_ft from './arid2_ft.jpg'
import arid2_bk from './arid2_bk.jpg'
import arid2_up from './arid2_up.jpg'
import arid2_dn from './arid2_dn.jpg'
import arid2_rt from './arid2_rt.jpg'
import arid2_lf from './arid2_lf.jpg'
const OrbitControls = OrbitControlsFunction(THREE)
let scene, camera, renderer
function init() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    45,
    30000
  )
  camera.position.set(-900, -200, -900)
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  let controls = new OrbitControls(camera)
  controls.addEventListener('change', animate)
  controls.minDistance = 500
  controls.maxDistance = 1500

  let materialArray = []
  let texture_ft = new THREE.TextureLoader().load(arid2_ft)
  let texture_bk = new THREE.TextureLoader().load(arid2_bk)
  let texture_up = new THREE.TextureLoader().load(arid2_up)
  let texture_dn = new THREE.TextureLoader().load(arid2_dn)
  let texture_rt = new THREE.TextureLoader().load(arid2_rt)
  let texture_lf = new THREE.TextureLoader().load(arid2_lf)

  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }))
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }))

  for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide
  let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000)
  let skybox = new THREE.Mesh(skyboxGeo, materialArray)
  scene.add(skybox)
  animate()
}
function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
init()
