<template>
  <div id="app">
    <ModelViewer />
  </div>
</template>

<script>
import { ModelViewer } from './components'
export default {
  name: 'App',
  components: {
    ModelViewer,
  },
  data() {
    return {
      modelInfo:{

      },
      modelConfig:{

      }
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
