<template>
  <div class="model-edit">
    <div class="header">
      <img :src="bigLogo" alt="博物馆logo">
      <div class="action-tabs">
        <el-button type="success" @click="saveConfig">保存</el-button>
        <el-button type="primary" @click="exitEdit">退出</el-button>
      </div>
    </div>
    <div
      class="setting-panel"
      :style="{
        height: panelHeight + 'px'
      }"
    >
      <ul class="edit-menu">
        <li
          v-for="(item, index) in items"
          :key="index"
          :class="{
            'active':tabName===item.tabName
          }"
          @click="tabName = item.tabName"
        >
          <i style="font-size:26px" class="iconfont" :class="item.iconClass" />
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <div v-if="tabName === 'basic'" class="tab-content">
        <div class="title">基础设置</div>
        <div class="sub-title">
          <i class="iconfont icon-brg-icon-005-xiankuang" />
          线框标识
        </div>
        <div class="action">
          <label>
            <input
              v-model="modelConfig.showPlane"
              class="action-checkbox"
              type="checkbox"
              name="grid"
            >
            显示网格
          </label>
          <label>
            <input
              v-model="modelConfig.showPosition"
              class="action-checkbox"
              type="checkbox"
              name="position"
            >
            观看位置
          </label>
          <!-- <br>
          <label>
            <input
              v-model="modelConfig.showTranslate"
              class="action-checkbox"
              type="checkbox"
              name="position"
            >
            平移控制
          </label>
          <label>
            <input
              v-model="modelConfig.showRotate"
              class="action-checkbox"
              type="checkbox"
              name="position"
            >
            旋转控制
          </label>-->
        </div>
        <div class="sub-title">
          <i class="iconfont icon-brg-icon-005-xiankuang" />
          旋转设置
        </div>
        <div class="action">
          <div class="rotate-grid">
            <div>
              <button style="color:#F80717" class="rotate-button" size="mini" @click="hanldeModelRotate('X', Math.PI*0.1)">&lsaquo;</button>
              <button style="color:#F80717" class="rotate-button" size="mini" @click="hanldeModelRotate('X')">X</button>
              <button style="color:#F80717" class="rotate-button" size="mini" @click="hanldeModelRotate('X',-Math.PI*0.1)">&rsaquo;</button>
            </div>

            <div>
              <button style="color:#42FD2B" class="rotate-button" size="mini" @click="hanldeModelRotate('Y', Math.PI*0.1)">&lsaquo;</button>
              <button style="color:#42FD2B" class="rotate-button" size="mini" @click="hanldeModelRotate('Y')">Y</button>
              <button style="color:#42FD2B" class="rotate-button" size="mini" @click="hanldeModelRotate('Y', -Math.PI*0.1)">&rsaquo;</button>
            </div>

            <div>
              <button style="color:#2200FA" class="rotate-button" size="mini" @click="hanldeModelRotate('Z', Math.PI*0.1)">&lsaquo;</button>
              <button style="color:#2200FA" class="rotate-button" size="mini" @click="hanldeModelRotate('Z')">Z</button>
              <button style="color:#2200FA" class="rotate-button" size="mini" @click="hanldeModelRotate('Z', -Math.PI*0.1)">&rsaquo;</button>
            </div>

          </div>
          <label>
            <input
              v-model="modelConfig.showRotate"
              class="action-checkbox"
              type="checkbox"
              name="position"
            >
            旋转微调
          </label>
        </div>
        <div class="sub-title">
          <i class="iconfont icon-brg-icon-005-xiankuang" />
          视点设置
        </div>
        <div class="action">
          <label>
            <input
              v-model="modelConfig.showViewCenter"
              class="action-checkbox"
              type="checkbox"
              name="position"
            >
            显示视点中心
          </label>
        </div>
      </div>
      <div v-if="tabName === 'light'" class="tab-content">
        <div class="title">灯光背景</div>
        <div class="sub-title">
          <i class="iconfont icon-dengpao" />
          灯光设置
        </div>
        <div class="action">
          <el-select size="small" class="cover-select-list" value="添加光源" @change="handleNewLight">
            <i slot="prefix" style="line-height:32px" class="iconfont icon-guangzhao" />
            <el-option
              v-for="item in lightTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.type"
            />
          </el-select>
          <div v-for="(light, index) in lightList" :key="index" class="single-light">
            <div class="light-title">
              <span>{{ light.name }}</span>
              <el-button size="mini" type="danger" @click="deleteLight(light)">删除</el-button>
              <!-- 关灯效果暂时取消 -->
              <!-- <el-button size="mini" type="primary" @click="toggleLight(light)">关灯</el-button> -->
            </div>
            <div class="light-info">
              <el-color-picker v-model="light.color" size="mini" />
              <div class="intensity">
                <span class="intensity-title">强度:</span>
                <el-slider v-model="light.intensity" class="intensity-slider" :step="0.1" :max="4" />
                <span class="intensity-value">{{ light.intensity }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sub-title">
          <i class="iconfont icon-beijing" />
          背景设置
        </div>
        <div class="action">
          <el-select size="small" class="cover-select-list" value="选择背景图" @change="handleNewBg">
            <i slot="prefix" style="line-height:32px" class="iconfont icon-tupian-copy" />
            <el-option v-for="(bg, index) in bgList" :key="index" class="bg-option" :value="bg.url">
              <img :src="bg.url" alt srcset>
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-if="tabName === 'measure'" class="tab-content">
        <div class="title">标注测量</div>
        <div class="sub-title">
          <i class="iconfont icon-celiang" />
          测量尺寸
        </div>
        <div class="action">
          <el-button type="info" size="mini" @click="handleBenchmark">尺寸采样</el-button>
          <el-button v-if="!startMeasure" type="success" size="mini" @click="handleMeasure">添加尺寸</el-button>
          <el-button v-else type="primary" size="mini" @click="startMeasure=false">取消添加</el-button>
          <div v-if="benchmark" class="model-benchmark">
            <span>尺寸采样基准：{{ parseFloat(benchmark).toFixed(2) }}</span>
            <el-select v-model="benchmarkUnit" placeholder="请选择" size="mini">
              <el-option v-for="unit in benchmarkUnitList" :key="unit" :label="unit" :value="unit" />
            </el-select>
          </div>
        </div>
        <div class="sub-title">
          <i class="iconfont icon-qizhibiaojibiaozhu" />
          信息标注（双击模型添加）
        </div>
        <div v-if="pointList" class="action">
          <div v-for="(item,index) in pointList" :key="index" class="single-comment">
            <div class="comment-index">
              <span style="margin-right:auto">{{ index+1 }}</span>
              <el-button size="mini" type="primary" @click="deletePoint(index)">删除</el-button>
              <el-button v-if="!item.active" size="mini" type="warning" @click="item.active=true">编辑</el-button>
              <el-button v-else size="mini" type="warning" @click="savePoint(index,item)">保存</el-button>
            </div>
            <div class="comment-content">
              <div v-if="!item.active">
                <div>{{ item.title }}</div>
                <div>{{ item.content }}</div>
              </div>
              <div v-else>
                <input v-model="item.title">
                <input v-model="item.content">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tabName === 'cover'" class="tab-content">
        <div class="title">封面</div>
        <div class="sub-title">
          <i class="iconfont icon-tupian-copy" />
          封面图片
        </div>
        <div class="action">
          <el-button type="danger" size="mini" @click="getModelCover">
            <i style="font-size:14px" class="iconfont icon-celiang-jiequdangqiantuxiang" />
            获取封面
          </el-button>
          <div class="model-cover">
            <img class="model-image" :src="modelCover" alt="图片">
          </div>
        </div>
      </div>
    </div>
    <div
      id="container"
      ref="container"
      class="model-container"
      :style="{
        height: panelHeight + 'px'
      }"
    />
  </div>
</template>

<script>
import api from '@/api'
import * as THREE from 'three'
// 可以删除dragControl
// import { DragControls } from '@/vendor/three/controllers/DragControls'
import { OrbitControlsFunction } from '@/vendor/three/orbitControls'
const OrbitControls = OrbitControlsFunction(THREE)
import { makeTextSprite } from './modelConfig.js'
import { MTLLoader } from '@/vendor/three/MTLLoader.js'
import { OBJLoader2 } from '@/vendor/three/OBJLoader2.js'
import { MtlObjBridge } from '@/vendor/three/MtlObjBridge.js'
import { TransformControls } from '@/vendor/three/transformcontrolls'

import modelBg from '@/assets/images/thumb_default.jpg'
import bg01 from '@/assets/images/bg01.jpg'
import bg02 from '@/assets/images/bg02.jpg'
import bg03 from '@/assets/images/bg03.jpg'
import bg04 from '@/assets/images/bg04.jpg'
import bg05 from '@/assets/images/bg05.jpg'
import bigLogo from '@/assets/images/big_logo.png'

import {
  defaultLightList,
  lightTypeList
} from '@/views/digitalResources/modelEditConfig/colorConfig'
import { getLightName } from '@/views/digitalResources/modelEditConfig/util'
// 待保存上传的参数
let uploadCurrentfileObj = null

/**
 * three group
 */
let rootGroup, basicGroup, lightControlGroup, measureGroup

// 尺寸采样时需要的点线在此设定 无需动态监听
// 尺寸采样打点索引
var dotClicks = 0
// 尺寸采样点集合
var points = [new THREE.Vector3(), new THREE.Vector3()]
// 点Mesh
var markerA = new THREE.Mesh(
  new THREE.SphereGeometry(5, 10, 20),
  new THREE.MeshBasicMaterial({
    color: 0xff5555
  })
)
var markerB = markerA.clone()
var markers = [markerA, markerB]
// 尺寸采样线Mesh
var lineGeometry = new THREE.Geometry()
lineGeometry.vertices.push(new THREE.Vector3())
lineGeometry.vertices.push(new THREE.Vector3())
var lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff5555
})
var line = new THREE.Line(lineGeometry, lineMaterial)

export default {
  name: 'ModelEdit',
  data() {
    const modelMetaConfig = {
      metaData: {},
      lights: [],
      measure: {},
      bgImg: null
    }
    const items = [
      {
        name: '基础设置',
        tabName: 'basic',
        iconClass: 'icon-shezhi'
      },
      {
        name: '灯光背景',
        tabName: 'light',
        iconClass: 'icon-dian'
      },
      {
        name: '标注测量',
        tabName: 'measure',
        iconClass: 'icon-biaozhu'
      },
      {
        name: '封面',
        tabName: 'cover',
        iconClass: 'icon-tupian-copy'
      }
    ]
    Object.freeze(modelMetaConfig)
    Object.freeze(items)
    return {
      modelMetaConfig,
      items,
      tabName: 'basic',
      bigLogo: null,
      container: null,
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      orbitControl: null,
      orbit: null,
      publicPath: process.env.BASE_URL,
      modelConfig: {
        // 显示网格
        showPlane: false,
        // 显示观看位置
        showPosition: false,
        // 平移控制
        showTranslate: false,
        // 旋转控制
        showRotate: false,
        // 显示视点中心
        showViewCenter: false
      },
      // 模型尺寸
      boxSize: null,
      // 开启尺寸采样
      startBenchmark: false,
      // 开始测量
      startMeasure: false,
      // 尺寸采样数据
      benchmark: null,
      // 尺寸采样单位
      benchmarkUnit: 'cm',
      benchmarkUnitList: ['mm', 'cm', 'm'],
      // 标注信息列表
      pointList: null,
      // 测量线点集合
      point2LineList: null,
      // 光源列表
      lightList: null,
      modelCover: null,
      bgTexture: null,
      // 当前模型背景图片url
      bgTextureUrl: null,
      // 当前模型对象
      currentfileObj: null
      // lightTypeList: []
    }
  },
  computed: {
    modelId() {
      return this.$route.params.id
    },
    lightTypeList() {
      return lightTypeList
    },
    panelHeight() {
      return window.innerHeight - 70
    },
    modelBg() {
      return modelBg
    },
    bg01() {
      return bg01
    },
    bg02() {
      return bg02
    },
    bg03() {
      return bg03
    },
    bg04() {
      return bg04
    },
    bg05() {
      return bg05
    },
    bgList() {
      var bgList = [
        { url: this.modelBg },
        { url: this.bg01 },
        { url: this.bg02 },
        { url: this.bg03 },
        { url: this.bg04 },
        { url: this.bg05 }
      ]
      return bgList
    }
  },
  watch: {
    modelConfig: {
      deep: true,
      handler: function() {
        // this.updatePlane()
        this.updateConfig()
      }
    },
    lightList: {
      deep: true,
      handler: function() {
        this.initLight()
      }
    },
    // pointList: {
    //   deep: true,
    //   handler: function() {
    //     console.log('pointList', this.pointList)
    //     this.updatePointRemark()
    //   }
    // },
    tabName() {
      this.updateConfig()
    }
  },
  created() {
    const loginUser = this.$store.state.user.uinfo
    this.bigLogo =
      loginUser.museum && loginUser.museum.consoleHeaderLogo
        ? loginUser.museum.consoleHeaderLogo
        : bigLogo
  },
  mounted() {
    this.loadCurrentModelObj()
  },
  methods: {
    /**
     * -----------------------
     * @description 准备start：获取当前模型信息
     * -----------------------
     */
    loadCurrentModelObj() {
      api.DigitalRes.get(this.modelId)
        .then(result => {
          console.log('DigitalRes.get', result)
          this.currentFileObj = result.info
          uploadCurrentfileObj = result.info
          this.modelCover = result.info.cover
          const previewConfig = result.info.config
            ? result.info.config.jsonSettings
            : null
          if (!previewConfig) {
            this.lightList = defaultLightList
          } else {
            const modelMetaConfig = JSON.parse(previewConfig)
            console.log('modelMetaConfig', modelMetaConfig)
            this.lightList = modelMetaConfig.lightList || defaultLightList
            this.bgTextureUrl = modelMetaConfig.bgImg
            if (modelMetaConfig.measure) {
              this.pointList = modelMetaConfig.measure.pointList || []
              this.point2LineList =
                (modelMetaConfig.measure.lineList &&
                  modelMetaConfig.measure.lineList.point2LineList) ||
                []
              this.benchmark =
                modelMetaConfig.measure.lineList &&
                modelMetaConfig.measure.lineList.benchmark
              this.benchmarkUnit =
                modelMetaConfig.measure.lineList &&
                modelMetaConfig.measure.lineList.benchmarkUnit
            } else {
              this.pointList = []
              this.point2LineList = []
            }
            this.modelMetaConfig = modelMetaConfig
          }
          this.init()
        })
        .catch(err => {
          throw err
        })
    },
    /**
     * -----------------------
     * @description  初始加载模型
     * 顺序: renderer > scene > model -> camera > light > texture > renderer
     * -----------------------
     */
    init() {
      console.log('fn init')
      this.container = this.$refs.container
      const model = this.currentFileObj.extInfo.threeModel
      this.initScene()
      this.initRenderer()
      this.loadModel(model)
      this.container.appendChild(this.renderer.domElement)
      // controls
      window.addEventListener('resize', this.onWindowResize, false)
      // enter 按键重置视窗
      document.addEventListener('keydown', this.onKeyDown, false)
    },
    // 场景初始化
    initScene() {
      this.scene = new THREE.Scene()
    },
    // 模型加载
    loadModel(model) {
      console.log('fn loadModel')
      const _this = this
      _this.progressShow = true
      // 设置图片跨域
      THREE.ImageUtils.crossOrigin = 'anonymous'
      const mtlLoader = new MTLLoader()
      mtlLoader.load(model.mtl, mtlParseResult => {
        const objLoader = new OBJLoader2()
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult)
        //   materials.Material.side = THREE.DoubleSide;
        objLoader.addMaterials(materials)
        objLoader.load(
          model.obj,
          _this.loadSuccess,
          _this.loadProgress,
          _this.onError
        )
      })
    },
    // 模型加载成功回调
    loadSuccess(root) {
      rootGroup = new THREE.Group()
      rootGroup.name = 'rootGroup'
      // 取消模型加载进度条
      this.progressShow = false
      const _this = this
      // 模型item添加阴影
      root.traverse(function(item) {
        if (item instanceof THREE.Mesh) {
          item.castShadow = true
          item.receiveShadow = true
        }
      })
      root.name = 'activeModel'
      const metaData = this.modelMetaConfig.metaData
      if (metaData && metaData.rotate) {
        const rotateObj = JSON.parse(metaData.rotate)
        console.log('rotateObj11', rotateObj)
        root.rotateX(rotateObj._x)
        root.rotateY(rotateObj._y)
        root.rotateZ(rotateObj._z)
      }

      rootGroup.add(root)
      _this.scene.add(rootGroup)
      _this.activeModel = root
      // 复制一个不影响材质的ObjectCopy
      // const rootCopy = root.clone(true)
      // 根据模型的尺寸设置相机位置
      const box = new THREE.Box3().setFromObject(root)
      const boxSize = box.getSize(new THREE.Vector3()).length()
      // 将模型尺寸大小缓存起来 供以后用
      _this.boxSize = boxSize
      const boxCenter = box.getCenter(new THREE.Vector3())
      console.log('boxCenter', boxCenter)
      // 加载背景
      this.initBgCover()
      // 初始化相机
      this.initCamera(root)
      // 初始化光源
      this.initLight()
      // 初始化控制器
      _this.initControls()
    },
    // 模型加载进度条
    loadProgress(xhr) {
      // if (xhr.lengthComputable) {
      // }
    },
    // 报错反馈
    onError() {
      alert('出错!')
    },
    // 根据模型大小初始化相机位置
    initCamera(root) {
      // 获取模型的尺寸
      const box = new THREE.Box3().setFromObject(root)
      const boxSize = box.getSize(new THREE.Vector3()).length()
      const boxCenter = box.getCenter(new THREE.Vector3())
      console.log('box111', box)
      console.log('boxSize111', boxSize)
      console.log('boxCenter111', boxCenter)
      const camera = new THREE.PerspectiveCamera(
        45,
        this.container.offsetWidth / this.container.offsetHeight,
        0.1,
        1000
      )
      const metaData = this.modelMetaConfig.metaData
      if (metaData && metaData.cameraPosition) {
        console.log('metaData.cameraPosition', metaData.cameraPosition)
        const cameraPosition = JSON.parse(metaData.cameraPosition)
        camera.position.copy(
          new THREE.Vector3(
            cameraPosition.x,
            cameraPosition.y,
            cameraPosition.z
          )
        )
        camera.near = boxSize / 100
        camera.far = boxSize * 100
        camera.updateProjectionMatrix()
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera = camera
        // this.initPosition()
        return
      }
      camera.position.set(0, 10, 20)

      this.frameArea(boxSize * 1.2, boxSize, boxCenter, camera)
      this.camera = camera
    },
    // 根据模型尺寸为相机设置合适的位置
    frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
      const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5
      const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5)
      const distance = halfSizeToFitOnScreen / Math.tan(halfFovY)
      // compute a unit vector that points in the direction the camera is now
      // in the xz plane from the center of the box
      const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize()

      // move the camera to a position distance units way from the center
      // in whatever direction the camera was from the center already
      camera.position.copy(direction.multiplyScalar(distance).add(boxCenter))

      // pick some near and far values for the frustum that
      // will contain the box.
      camera.near = boxSize / 100
      camera.far = boxSize * 100

      camera.updateProjectionMatrix()

      // point the camera to look at the center of the box
      camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z)
    },

    // 渲染器初始化
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        anitialias: true,
        alpha: true,
        // 设置渲染器可以进行缓存
        preserveDrawingBuffer: true
      })
      // 兼容视网膜屏
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(
        this.container.offsetWidth,
        this.container.offsetHeight
      )
    },
    // 加载背景图
    initBgCover() {
      const textureLoader = new THREE.TextureLoader()
      textureLoader.setCrossOrigin('')
      const bgTexture = textureLoader.load(this.bgTextureUrl)
      this.bgTexture = bgTexture
      this.scene.background = bgTexture
      // // 尝试兼容ie等浏览器
      // this.container.style.background = `url(${imgUrl})`
    },
    // ThreeJS渲染函数
    render() {
      const canvas = this.renderer.domElement
      const bgTexture = this.bgTexture
      if (this.resizeRendererToDisplaySize()) {
        const canvas = this.renderer.domElement
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight
        this.camera.updateProjectionMatrix()
      }
      // 设置背景图不拉伸
      const canvasAspect = canvas.clientWidth / canvas.clientHeight
      const imageAspect = bgTexture.image
        ? bgTexture.image.width / bgTexture.image.height
        : 1
      const aspect = imageAspect / canvasAspect

      bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0
      bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1

      bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2
      bgTexture.repeat.y = aspect > 1 ? 1 : aspect

      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
    },
    /**
     * 初始化光源
     * 移动时改变光源信息
     * 将光源id作为name
     */
    initLight() {
      // 处理获取lightList时scene还未渲染的情况
      if (!this.scene) {
        return
      }
      this.lightList.forEach(light => {
        const color = light.color
        const boxSize = this.boxSize
        // 判断是否已经存在该光源
        if (this.scene.getObjectByName(light.id)) {
          var lightObj = this.scene.getObjectByName(light.id)
          lightObj.color = new THREE.Color(color)
          lightObj.intensity = light.intensity
          return
        }
        switch (light.type) {
          // 环境光
          case 'AmbientLight':
            var ambientLight = new THREE.AmbientLight(color)
            ambientLight.name = light.id
            this.scene.add(ambientLight)
            break
          // 聚光灯
          case 'SpotLight':
            var spotLight = new THREE.SpotLight(color)
            spotLight.name = light.id
            spotLight.position.set(
              light.position.x || -boxSize * 1.5,
              light.position.y || boxSize * 1.5,
              light.position.z || -boxSize * 1.5
            )
            spotLight.castShadow = true
            // spotLight.distance = light.distance
            spotLight.angle = light.angle || 45
            spotLight.target.position.set(0, 0, 0)
            this.scene.add(spotLight)

            break
          // 方向灯
          case 'DirectionalLight':
            var directionalLight = new THREE.DirectionalLight(color)
            directionalLight.name = light.id
            directionalLight.position.set(
              light.position.x || -boxSize * 1.5,
              light.position.y || boxSize * 1.5,
              light.position.z || -boxSize * 1.5
            )
            directionalLight.target.position.set(0, 0, 0)
            this.scene.add(directionalLight)

            break
          // 点光源
          case 'PointLight':
            var pointLight = new THREE.PointLight(color)
            console.log('pointLight', pointLight)
            pointLight.name = light.id
            pointLight.distance = light.distance || 1000
            pointLight.position.set(
              light.position.x || -boxSize * 1.5,
              light.position.y || boxSize * 1.5,
              light.position.z || -boxSize * 1.5
            )
            this.scene.add(pointLight)

            break
          default:
            break
        }
      })
      if (this.tabName === 'light') {
        this.addAllControlAndHelper()
      }
      console.log('this.scene', this.scene)
    },
    // 控制器初始化
    initControls() {
      const root = this.activeModel
      // 获取模型的尺寸
      const box = new THREE.Box3().setFromObject(root)
      const boxSize = box.getSize(new THREE.Vector3()).length()
      const boxCenter = box.getCenter(new THREE.Vector3())
      console.log('helper 添加成功', boxSize, this.camera, this.renderer.domElement)
      const orbitControl = new OrbitControls(
        this.camera,
        this.renderer.domElement
      )
      console.log('orbitControl1122', orbitControl)
      orbitControl.enablePan = true
      // orbitControl.enableDamping = true
      // orbitControl.dampingFactor = 0.07
      // orbitControl.addEventListener('change', () => {
      //   this.removePointInfo()
      // })
      // 设置控制器最远距离与目标
      orbitControl.maxDistance = boxSize * 100
      orbitControl.target.copy(boxCenter)
      orbitControl.update()

      // 控制器中心
      this.orbitControl = orbitControl
      // 用于更新轨道控制器
      this.clock = new THREE.Clock()
      this.render()
    },
    // 删除标注信息
    removePointInfo() {
      const nodes = document.getElementsByClassName('node-sprite')
      if (nodes.length) {
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index]
          element.parentElement.removeChild(element)
        }
      }
    },

    /**
     * -----------------------
     * @description 菜单栏切换动态显示的操作
     * -----------------------
     */
    updateConfig() {
      const tabName = this.tabName
      switch (tabName) {
        case 'basic':
          this.updateBasic()
          break
        case 'light':
          this.updateLight()
          break
        case 'measure':
          this.updateMeasure()
          break
        case 'cover':
          this.updateCover()

          break
        default:
          break
      }
    },
    /**
     * -----------------------
     * @description tab为’基础设置‘时，更新页面
     * 移动位置帮助器显示网格，以及观看位置
     * threeJS group : basicGroup
     * -----------------------
     */
    updateBasic() {
      this.hideGroup('measureGroup')
      this.hideGroup('lightControlGroup')
      document.removeEventListener('dblclick', this.onModelDoubleClick, false)
      if (!this.showGroup('basicGroup')) {
        basicGroup = new THREE.Group()
        basicGroup.name = 'basicGroup'
        this.scene.add(basicGroup)
      }
      this.updatePlane()
      basicGroup.updateMatrixWorld()
      // this.removeAllControlAndHelper()
    },

    // 更新平面模型
    // 添加坐标格辅助对象
    updatePlane() {
      // // 平移轨道控制器
      // if (this.modelConfig.showTranslate) {
      //   if (!basicGroup.getObjectByName('translateControl')) {
      //     const modelControl = new TransformControls(
      //       this.camera,
      //       this.renderer.domElement
      //     )
      //     modelControl.attach(rootGroup)
      //     modelControl.addEventListener('dragging-changed', function(event) {
      //       this.orbitControl.enabled = !event.value
      //     })
      //     modelControl.name = 'translateControl'
      //     basicGroup.add(modelControl)
      //   }
      // } else {
      //   if (basicGroup.getObjectByName('translateControl')) {
      //     basicGroup.remove(basicGroup.getObjectByName('translateControl'))
      //   }
      // }
      // 显示视角中心
      if (this.modelConfig.showViewCenter) {
        if (!this.scene.getObjectByName('axesHelper')) {
          const axesHelper = new THREE.AxesHelper(50)
          axesHelper.name = 'axesHelper'
          basicGroup.add(axesHelper)
        }
      } else {
        if (basicGroup.getObjectByName('axesHelper')) {
          basicGroup.remove(basicGroup.getObjectByName('axesHelper'))
        }
      }
      // 旋转轨道控制器
      if (this.modelConfig.showRotate) {
        if (!this.scene.getObjectByName('rotateControl')) {
          const modelControl = new TransformControls(
            this.camera,
            this.renderer.domElement
          )
          modelControl.attach(this.activeModel)
          modelControl.addEventListener('dragging-changed', function(event) {
            this.orbitControl.enabled = !event.value
          })
          modelControl.name = 'rotateControl'
          modelControl.setMode('rotate')
          basicGroup.add(modelControl)
        }
      } else {
        if (basicGroup.getObjectByName('rotateControl')) {
          console.log('yesyes')
          basicGroup.remove(basicGroup.getObjectByName('rotateControl'))
        }
      }

      // 模型的轨道控制器
      if (this.modelConfig.showPosition) {
        if (!basicGroup.getObjectByName('cameraHelper')) {
          var cameraHelper = new THREE.CameraHelper(this.camera)
          cameraHelper.name = 'cameraHelper'
          basicGroup.add(cameraHelper)
        }
      } else {
        if (basicGroup.getObjectByName('cameraHelper')) {
          basicGroup.remove(basicGroup.getObjectByName('cameraHelper'))
        }
      }

      // 显示平面网格
      if (this.modelConfig.showPlane) {
        // show GridHelper in the screen
        if (!basicGroup.getObjectByName('gridHelper')) {
          var size = this.boxSize * 2
          var divisions = 20
          const colorCenterLine = 0x0000ff
          var gridHelper = new THREE.GridHelper(
            size,
            divisions,
            colorCenterLine
          )
          gridHelper.name = 'gridHelper'
          basicGroup.add(gridHelper)
        }
      } else {
        if (basicGroup.getObjectByName('gridHelper')) {
          basicGroup.remove(basicGroup.getObjectByName('gridHelper'))
        }
      }
    },
    /**
     * -----------------------
     * @description tab为’灯光背景‘时，更新页面
     * 添加种类灯、设置模型查看背景
     * -----------------------
     */
    updateLight() {
      this.hideGroup('measureGroup')
      this.hideGroup('basicGroup')
      document.removeEventListener('dblclick', this.onModelDoubleClick, false)
      if (!this.showGroup('lightControlGroup')) {
        lightControlGroup = new THREE.Group()
        lightControlGroup.name = 'lightControlGroup'
        this.scene.add(lightControlGroup)
      }
      this.addAllControlAndHelper()
    },
    /**
     * -----------------------
     * @description tab为’标注测量‘时，更新页面
     * 尺寸采样、位置测量、位置信息打点
     * -----------------------
     */
    updateMeasure() {
      this.hideGroup('basicGroup')
      this.hideGroup('lightControlGroup')
      if (!this.showGroup('measureGroup')) {
        measureGroup = new THREE.Group()
        measureGroup.name = 'measureGroup'
        rootGroup.add(measureGroup)
      }
      document.addEventListener('dblclick', this.onModelDoubleClick, false)
      document.addEventListener('mousemove', this.onModelMouseHover, false)
      this.updatePointRemark()
      this.updatePoint2Line()
    },
    // 鼠标移动hover重现标注信息
    onModelMouseHover(event) {
      const lineGroup = measureGroup.getObjectByName('lineGroup')
      const intersects = this.getRaycaster(event, lineGroup)
      if (intersects.length) {
        intersects.forEach(intersect => {
          const item = intersect.object
          if (item instanceof THREE.Sprite) {
            document.body.style.cursor = 'pointer'
            window.addEventListener('click', this.deleteLine, false)
          } else {
            document.body.style.cursor = 'default'
            window.removeEventListener('click', this.deleteLine, false)
          }
        })
      } else {
        document.body.style.cursor = 'default'
        window.removeEventListener('click', this.deleteLine, false)
      }
    },
    deleteLine(event) {
      console.log('fn deleteLine')
      window.removeEventListener('click', this.deleteLine, false)
      this.$confirm('确定删除当前测量?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const lineGroup = measureGroup.getObjectByName('lineGroup')
          const intersects = this.getRaycaster(event, lineGroup)
          if (intersects.length) {
            intersects.forEach(intersect => {
              const item = intersect.object
              if (item instanceof THREE.Sprite) {
                this.point2LineList.splice(item.name, 2)
                this.updatePoint2Line()
              }
            })
          }
          window.addEventListener('click', this.deleteLine, false)
        })
        .catch(() => {
          window.addEventListener('click', this.deleteLine, false)
        })
    },
    // 更新打点列表
    updatePointRemark() {
      if (measureGroup.getObjectByName('pointGroup')) {
        measureGroup.remove(measureGroup.getObjectByName('pointGroup'))
      }
      const pointGroup = new THREE.Group()
      pointGroup.name = 'pointGroup'
      const pointList = this.pointList
      console.log('pointList', pointList)
      if (!pointList || !pointList.length) {
        return
      }
      pointList.forEach((point, idx) => {
        const position = JSON.parse(point.position)
        const title = point.title
        const content = point.content
        const positionVector = new THREE.Vector3(
          position.x,
          position.y,
          position.z
        )
        // canvas标记
        const ctx = document.createElement('canvas').getContext('2d')
        ctx.canvas.width = 50
        ctx.canvas.height = 50
        ctx.beginPath()
        ctx.moveTo(50, 25)
        ctx.fillStyle = '#fff'
        ctx.arc(25, 25, 25, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(47, 25)
        ctx.fillStyle = '#000'
        ctx.arc(25, 25, 22, 0, Math.PI * 2)
        ctx.fill()
        ctx.font = '36px serif'
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.fillText(idx + 1, 25, 40)
        ctx.stroke()
        var texture = new THREE.Texture(ctx.canvas)
        texture.needsUpdate = true
        const textrture = new THREE.SpriteMaterial({
          map: texture
        })
        const sprite = new THREE.Sprite(textrture)
        // 精灵文字层级设为99
        // sprite.renderOrder = 99
        sprite.material.depthTest = false
        console.log('position', position.x, position.y, position.z)
        sprite.position.copy(positionVector)
        console.log('this.boxSize111', this.boxSize)
        const boxSize = this.boxSize
        sprite.scale.set(boxSize / 25, boxSize / 25, 0)
        pointGroup.add(sprite)
        // 如果point active为true 显示节点信息
        if (point.active) {
          const vec2 = positionVector.project(this.camera)
          const halfWidth = this.renderer.domElement.clientWidth / 2
          const halfHeight = this.renderer.domElement.clientHeight / 2
          const node = document.createElement('div')
          const nodeTitle = document.createElement('div')
          const titleText = document.createTextNode(`${title}`)
          const contentText = document.createTextNode(`${content}`)
          const nodeContent = document.createElement('div')
          node.setAttribute('class', 'node-sprite')
          nodeTitle.setAttribute('class', 'node-title')
          nodeContent.setAttribute('class', 'node-content')
          nodeTitle.appendChild(titleText)
          nodeContent.appendChild(contentText)
          node.appendChild(nodeTitle)
          node.appendChild(nodeContent)
          var nodeLeft = vec2.x * halfWidth + halfWidth
          var nodeTop = -vec2.y * halfHeight + halfHeight
          node.style.left = nodeLeft + 'px'
          node.style.top = nodeTop + 'px'
          console.log('vec2', vec2)
          this.container.appendChild(node)
          point.active = false
        }
      })

      measureGroup.add(pointGroup)
      setTimeout(() => {
        this.removePointInfo()
      }, 3000)
    },
    // 测量点线
    updatePoint2Line() {
      if (measureGroup.getObjectByName('lineGroup')) {
        measureGroup.remove(measureGroup.getObjectByName('lineGroup'))
      }
      const lineGroup = new THREE.Group()
      lineGroup.name = 'lineGroup'
      measureGroup.add(lineGroup)

      const point2LineList = this.point2LineList
      console.log('point2LineList', point2LineList)
      if (!point2LineList) {
        return
      }
      for (let i = 0; i < point2LineList.length; i += 2) {
        const point1 = JSON.parse(point2LineList[i])
        let pointB
        if (point2LineList[i + 1]) {
          const point2 = JSON.parse(point2LineList[i + 1])
          pointB = new THREE.Vector3(point2.x, point2.y, point2.z)
          var meshPoint2 = new THREE.Mesh(
            new THREE.SphereGeometry(5),
            new THREE.MeshBasicMaterial({
              color: 0xff0000
            })
          )
          meshPoint2.position.copy(pointB)
          lineGroup.add(meshPoint2)
        }

        const pointA = new THREE.Vector3(point1.x, point1.y, point1.z)

        // 打点
        var meshPoint = new THREE.Mesh(
          new THREE.SphereGeometry(5),
          new THREE.MeshBasicMaterial({
            color: 0xff0000
          })
        )

        meshPoint.position.copy(pointA)
        lineGroup.add(meshPoint)

        // 连线
        if (pointB) {
          // 若有两个点则连线并且打精灵图
          this.setLine(pointA, pointB)
          var distance = pointA.distanceTo(pointB)
          console.log('distance1', distance)
          this.drawSprite(pointA, pointB, lineGroup, i)
        }
      }
    },
    // 绘制精灵文字
    drawSprite(pointA, pointB, parentGroup, index) {
      const benchmark = this.benchmark
      const benchmarkUnit = this.benchmarkUnit
      const vector = new THREE.Vector3()
      vector.addScaledVector(pointA, 1 / 2)
      vector.addScaledVector(pointB, 1 / 2)
      console.log('vector', vector)
      const diatance = pointA.distanceTo(pointB)
      var spriteX = makeTextSprite(
        `${parseFloat(diatance * benchmark).toFixed(2)}${benchmarkUnit}`,
        {
          fontsize: 80,
          // fontColor: {},
          borderColor: { r: 0, g: 0, b: 0, a: 0.4 } /* 边框黑色 */,
          backgroundColor: { r: 0, g: 0, b: 0, a: 0.9 } /* 背景颜色 */
        }
      )
      // spriteX.center = new THREE.Vector2(0, 0);
      spriteX.name = index
      spriteX.position.copy(vector)
      const boxSize = this.boxSize
      console.log('boxSize11', boxSize)
      spriteX.scale.set(40, 20, 0)
      parentGroup.add(spriteX)
    },

    // 双击屏幕打点及连线
    onModelDoubleClick(event) {
      if (!this.startBenchmark && !this.startMeasure) {
        // 信息标注
        this.newPointRemark(event)
        return
      }
      // const _this = this
      // 测量
      if (this.startMeasure) {
        var intersects = this.getRaycaster(event)
        const point2LineList = this.point2LineList || []
        point2LineList.push(JSON.stringify(intersects[0].point))
        this.point2LineList = point2LineList
        this.updatePoint2Line()
      }
      // 判断尺寸采样
      if (this.startBenchmark) {
        this.scene.add(markerA)
        const intersects = this.getRaycaster(event)
        console.log('intersects', intersects)
        if (intersects.length > 0) {
          points[dotClicks].copy(intersects[0].point)
          markers[dotClicks].position.copy(intersects[0].point)
          // this.setLine(intersects[0].point, intersects[0].point, line)
          dotClicks++
          if (dotClicks > 1) {
            this.scene.add(markerB)
            this.scene.add(line)
            var distance = points[0].distanceTo(points[1])
            console.log('线长', distance)
            this.setLine(points[0], points[1], line)
            this.$prompt('请输入采样数值', '尺寸采样', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^[0-9]*$/,
              inputErrorMessage: '请输入数字'
            })
              .then(res => {
                console.log('value', res.value)
                this.benchmark = res.value / distance
                console.log('this.benchmark', this.benchmark)
                this.scene.remove(markerA)
                this.scene.remove(markerB)
                this.scene.remove(line)
                this.startBenchmark = false
                this.$message({
                  type: 'success',
                  message: '尺寸采样成功'
                })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消采样'
                })
              })
            dotClicks = 0
          }
        }
      }
    },
    // 新建打点备注
    newPointRemark(event) {
      const pointList = this.pointList || []
      var intersectedObjects = this.getRaycaster(event)
      if (!intersectedObjects.length) {
        return
      }
      console.log('intersectedObjects', intersectedObjects)
      const position = JSON.stringify(intersectedObjects[0].point)
      console.log('position string', position)
      const title = '默认标题'
      const content = '默认描述'
      const defaultComment = {
        position,
        title,
        content,
        // 显示div框
        active: true
      }
      pointList.push(defaultComment)
      this.pointList = pointList
      this.updatePointRemark()
    },
    setLine(vectorA, vectorB, line) {
      if (!line) {
        // 线Mesh
        var lineGeometry = new THREE.Geometry()
        lineGeometry.vertices.push(vectorA)
        lineGeometry.vertices.push(vectorB)
        var lineMaterial = new THREE.LineBasicMaterial({
          color: 0xff5555
        })
        var newLine = new THREE.Line(lineGeometry, lineMaterial)
        const lineGroup = measureGroup.getObjectByName('lineGroup')
        if (lineGroup) {
          lineGroup.add(newLine)
        }
      } else {
        line.geometry.vertices[0].copy(vectorA)
        line.geometry.vertices[1].copy(vectorB)
        line.geometry.verticesNeedUpdate = true
      }
    },
    // 获取映射对象数组
    getRaycaster(event, target) {
      if (!target) {
        target = this.activeModel
      }
      var raycaster = new THREE.Raycaster()
      var mouse = new THREE.Vector2()
      // 转换为WebGL坐标系统
      const rect = this.container.getBoundingClientRect()
      mouse.x =
        ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1
      mouse.y =
        -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1
      raycaster.setFromCamera(mouse, this.camera)
      var intersects = raycaster.intersectObject(target, true)
      return intersects
    },
    savePoint(index, item) {
      // this.pointList[index] = item
      this.updatePointRemark()
    },
    deletePoint(index) {
      console.log('index', index)
      this.pointList.splice(index, 1)
      this.updatePointRemark()
    },
    /**
     * -----------------------
     * @description tab为’封面‘时，更新页面
     * 设置封面
     * -----------------------
     */
    updateCover() {
      this.hideGroup('basicGroup')
      this.hideGroup('lightControlGroup')
      this.hideGroup('measureGroup')
      // this.removeAllControlAndHelper()
      document.removeEventListener('dblclick', this.onModelDoubleClick, false)
    },

    // 重置尺寸
    resizeRendererToDisplaySize() {
      const canvas = this.renderer.domElement
      const width = this.container.clientWidth
      const height = this.container.clientHeight
      const needResize = canvas.width !== width || canvas.height !== height
      if (needResize) {
        this.renderer.setSize(width, height, false)
      }
      return needResize
    },

    // 添加单个光源的控制器与帮助器
    addControlAndHelper(envLight, type) {
      console.log('fn addControlAndHelper', envLight)
      if (this.tabName !== 'light') {
        return
      }
      if (lightControlGroup.getObjectByName(envLight.name + 'control')) {
        return
      }
      // 添加控制器
      var control = new TransformControls(this.camera, this.renderer.domElement)
      control.name = envLight.name + 'control'
      control.attach(envLight)
      control.enabled = true
      control.addEventListener('objectChange', this.handleLightMove)
      lightControlGroup.add(control)
      // 添加帮助器
      var helper = new THREE[type](envLight)
      helper.name = envLight.name + 'helper'
      lightControlGroup.add(helper)
    },
    /**
     * @description 增加所有控制和帮助器 可以优化写成一个
     */
    addAllControlAndHelper() {
      console.log('fn addAllControlAndHelper')
      this.lightList.forEach(light => {
        switch (light.type) {
          case 'SpotLight':
            var spotLight = this.scene.getObjectByName(light.id)
            this.addControlAndHelper(spotLight, 'SpotLightHelper')
            break
          case 'DirectionalLight':
            var directionalLight = this.scene.getObjectByName(light.id)
            this.addControlAndHelper(directionalLight, 'DirectionalLightHelper')
            break
          case 'PointLight':
            var pointLight = this.scene.getObjectByName(light.id)
            this.addControlAndHelper(pointLight, 'PointLightHelper')
            break
          default:
            break
        }
      })
    },
    // 添加光源
    handleNewLight(val) {
      console.log('val', val)
      const color = '#fff'
      const lightName = getLightName(val)
      const nowTime = new Date().getTime()
      let curLight = null
      switch (val) {
        // 环境光
        case 'AmbientLight':
          curLight = {
            id: nowTime,
            name: lightName,
            type: val,
            color: color,
            intensity: 1
          }
          break
        // 聚光灯
        case 'SpotLight':
          curLight = {
            id: nowTime,
            name: lightName,
            type: val,
            color: color,
            intensity: 1,
            position: {
              x: (this.boxSize * -1.5) / 2,
              y: this.boxSize / 2,
              z: (this.boxSize * -1) / 2
            },
            angle: 30
          }
          break
        // 方向灯
        case 'DirectionalLight':
          curLight = {
            id: nowTime,
            name: lightName,
            type: val,
            color: color,
            intensity: 1,
            position: {
              x: (this.boxSize * -1) / 2,
              y: this.boxSize / 2,
              z: (this.boxSize * -1) / 2
            }
          }
          break
        // 点光源
        case 'PointLight':
          curLight = {
            id: nowTime,
            name: lightName,
            type: val,
            color: color,
            intensity: 1,
            distance: (this.boxSize * 1.5) / 2,
            position: {
              x: (this.boxSize * -1.5) / 2,
              y: this.boxSize / 2,
              z: (this.boxSize * -1) / 2
            }
          }
          break
        default:
          break
      }
      this.lightList.push(curLight)
    },

    // 删除光源
    deleteLight(light) {
      console.log('light', light)
      this.lightList.forEach((item, index) => {
        if (item.id === light.id) {
          this.lightList.splice(index, 1)
        }
      })
      this.scene.remove(this.scene.getObjectByName(light.id))
      lightControlGroup.remove(
        lightControlGroup.getObjectByName(light.id + 'control')
      )
      lightControlGroup.remove(
        lightControlGroup.getObjectByName(light.id + 'helper')
      )
    },
    /**
     * 模型测量功能
     * 首先进行尺寸采样
     * 然后通过设置的对应尺寸信息开始实际测量
     */
    handleBenchmark() {
      this.$alert('请在模型上双击确定两点距离', '尺寸采样', {
        confirmButtonText: '确定',
        callback: action => {
          //  移除之前的采样标记
          // this.scene.remove(markerA)
          // this.scene.remove(markerB)
          // this.scene.remove(line)
          dotClicks = 0
          points = [new THREE.Vector3(), new THREE.Vector3()]
          this.startBenchmark = true
          // this.$message({
          //   type: 'info',
          //   message: `action: ${action}`
          // })
        }
      })
    },
    handleMeasure() {
      if (!this.benchmark) {
        this.$message({
          type: 'warning',
          message: '请首先进行尺寸采样再进行模型测量'
        })
        return
      }
      this.$message({
        type: 'success',
        message: '请双击确定两点距离进行模型测量'
      })
      this.startMeasure = true
    },
    // 切换背景
    handleNewBg(url) {
      console.log('url', url)
      this.bgTextureUrl = url
      this.initBgCover()
    },
    // 截屏
    getModelCover() {
      var img = new Image()
      img.src = this.renderer.domElement.toDataURL()
      this.modelCover = img.src
      api.Global.baseToImage(img.src)
        .then(result => {
          this.currentFileObj['cover'] = result.info.key
          api.DigitalRes.edit(this.currentFileObj)
            .then(result => {
              this.$message({
                type: 'success',
                message: '设置封面成功'
              })
            })
            .catch(err => {
              this.modelCover = null
              throw err
            })
        })
        .catch(err => {
          this.modelCover = null
          throw err
        })
      // document.body.appendChild(img)
    },
    // 窗口尺寸变化
    onWindowResize() {
      const nowX = this.container.offsetWidth
      const nowY = this.container.offsetHeight
      this.camera.aspect = nowX / nowY
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(nowX, nowY)
    },

    // 光源移动
    handleLightMove() {
      var targetObj = arguments
      console.log('targetObj', targetObj)
      // 更新lightList中的光源位置距离等信息
      const curLight = targetObj[0].target
      const lightId = Number(curLight.name.replace('control', ''))
      this.lightList.forEach(light => {
        // 字符串与number
        // eslint-disable-next-line eqeqeq
        if (light.id === lightId) {
          console.log('light yes!!', light, curLight)
          if (light.position) {
            light.position = curLight.position || {}
          }
          if (light.distance) {
            light.distance = curLight.distance || null
          }
        }
      })
      // 控制器更新
      var curname = targetObj[0].target.name.replace('control', 'helper')
      this.scene.getObjectByName(curname).update()
    },
    // 键盘监听重置
    onKeyDown(event) {
      switch (event.keyCode) {
        case 13:
          break
      }
    },
    // 隐藏模型组
    hideGroup(name) {
      if (this.scene.getObjectByName(name)) {
        this.scene.getObjectByName(name).visible = false
        return true
      } else {
        return false
      }
    },
    // 显示模型组
    showGroup(name) {
      if (this.scene.getObjectByName(name)) {
        this.scene.getObjectByName(name).visible = true
        return true
      } else {
        return false
      }
    },
    // 模型旋转控制
    hanldeModelRotate(type = 'X', deg = Math.PI * 0.5) {
      const root = this.activeModel
      console.log('root.rotation', root.rotation.x)
      switch (type) {
        case 'X':
          root.rotateZ(deg)
          break
        case 'Y':
          root.rotateY(deg)
          break
        case 'Z':
          root.rotateX(deg)
          break
        default:
          break
      }
    },
    // 退出编辑
    exitEdit() {
      console.log('this.scene', this.scene)
      const activeModel = this.activeModel
      console.log('activeModel', JSON.stringify(activeModel.rotation))
      this.$confirm('即将关闭当前窗口, 请确认是否已保存配置?', '提示', {
        confirmButtonText: '关闭窗口',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.close()
        })
        .catch(() => {})
    },
    // 上传配置
    saveConfig() {
      console.log('this.scene', this.scene)
      console.log('this.lightList', this.lightList)
      const currentfileObj = uploadCurrentfileObj
      console.log('uploadCurrentfileObj ', uploadCurrentfileObj)
      const activeModel = this.activeModel
      const metaModelConfig = {
        metaData: {
          position: JSON.stringify(rootGroup.position),
          rotate: JSON.stringify(activeModel.rotation),
          cameraPosition: JSON.stringify(this.camera.position),
          rotation: JSON.stringify(rootGroup.rotation)
        },
        measure: {
          lineList: {
            benchmark: this.benchmark,
            benchmarkUnit: this.benchmarkUnit,
            point2LineList: this.point2LineList
          },
          pointList: this.pointList
        },
        lightList: this.lightList,
        bgImg: this.bgTextureUrl
      }
      const data = {
        jsonSettings: JSON.stringify(metaModelConfig)
      }
      currentfileObj['config'] = data
      api.DigitalRes.edit(currentfileObj, 'config')
        .then(result => {
          console.log('DigitalRes.edit', result)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
        .catch(err => {
          throw err
        })
    }
  }
}
</script>

<style lang="scss">
.model-edit {
  width: 100%;
  height: 100%;
  * {
    box-sizing: border-box;
  }
  .header {
    width: 100%;
    height: 70px;
    font-size: 20px;
    padding: 12px 30px;
    color: #cccccc;
    background: #333333;
    border-bottom: 1px solid black;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .setting-panel {
    width: 400px;
    float: left;
    border-bottom: 1px solid black;
    background: rgb(51, 51, 51);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    .edit-menu {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      li {
        list-style: none;
        width: 80px;
        height: 70px;
        color: #fff;
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: rgb(0, 0, 0);
          background-color: #fff;
        }
        &.active {
          color: rgb(0, 0, 0);
          background-color: #fff;
        }
      }
    }

    .tab-content {
      width: calc(100% - 80px);
      height: 100%;
      background: rgb(89, 89, 89);
      .title {
        font-size: 16px;
        color: white;
        padding: 20px;
      }
      .sub-title {
        font-size: 14px;
        color: white;
        padding: 20px;
        background-color: #333333;
      }
      .action {
        font-size: 16px;
        color: white;
        padding: 20px;
        .rotate-grid{
          display:flex;
          flex-direction: row;
          justify-content:space-between;
          margin-bottom:12px;
        }
        .rotate-button{
          cursor:pointer;
        }
        .model-benchmark {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          .el-select {
            width: 70px;
          }
        }
        .action-checkbox {
          cursor: pointer;
        }
        .single-light {
          color: rgb(0, 0, 0);
          margin-top: 10px;
          font-size: 14px;
          .light-title {
            background: rgb(204, 204, 204);
            padding: 5px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            span {
              margin-right: auto;
            }
          }
          .light-info {
            background: white;
            padding: 10px;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .intensity {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              width: 100%;
              padding-left: 12px;
              .intensity-title {
                width: 60px;
              }
              .intensity-slider {
                width: 100%;
              }
              .intensity-value {
                width: 40px;
                text-align: right;
              }
            }
          }
        }
        .single-comment {
          color: black;
          margin-bottom: 10px;
          .comment-index {
            background: rgb(204, 204, 204);
            padding: 5px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
          }
          .comment-content {
            background: rgb(255, 255, 255);
            padding: 10px;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
        .model-cover {
          width: 100%;
          height: 220px;
          margin-top: 12px;
          .model-image {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        .cover-select-list {
          .el-input__inner {
            padding-right: 0;
            color: #333;
          }
          .el-input__prefix {
            color: #333;
          }
        }
      }
    }
  }
  .model-container {
    float: left;
    width: calc(100% - 400px);
    background-size: 100% 100%;
    background-color: #333;
    position: relative;
    .node-sprite {
      position: absolute;
      width: 140px;

      padding: 6px 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-size: 14px;
      line-height: 24px;
      border-radius: 5px;
      .node-title {
      }
      .node-content {
      }
    }
  }
}
.el-select-dropdown {
  .bg-option {
    width: 200px;
    height: 80px;
    img {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
