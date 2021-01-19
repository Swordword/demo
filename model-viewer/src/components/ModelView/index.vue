<template>
  <div id="c" style="width:100vw;height:100vh"></div>
</template>

<script>
import ModelViewer from '../../utils/modelViewer.js'
export default {
  mounted() {
    const propModelInfo = {
      obj: 'https://coll-files.kunlunwenbao.com/data/attachment/0/20200426/4563972bfcbd4adeb85086daca2ad272/1903_0104_00766_00/Model/1903_0104_00766_00_Low/1903_0104_00766_00_Low.obj',
      mtl: 'https://coll-files.kunlunwenbao.com/data/attachment/0/20200426/4563972bfcbd4adeb85086daca2ad272/1903_0104_00766_00/Model/1903_0104_00766_00_Low/1903_0104_00766_00_Low.mtl',
    }

    const modelInfo = {
      dom: document.getElementById('c'),
      model: propModelInfo,
    }
    console.log('modelInfo22zz', modelInfo)
    const modelView = new ModelViewer()
    modelView.init(modelInfo)
  },
}
</script>

<style></style>
