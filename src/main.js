// Dependencies
import Vue from 'vue'
import VueFire from 'vuefire'
import lodash from 'lodash'
import tools from './tools'

// App
import App from './App'
import router from './router'

// Store
import VueStash from 'vue-stash'
import store from './store'

Vue.config.productionTip = false

// Vue + Firebase
Vue.use(VueFire);

// Vue + Stash
Vue.use(VueStash)

// Lodash
Object.defineProperty(Vue.prototype, '$lodash', { value: lodash })

// Tools
console.log(lodash, tools)
Object.defineProperty(Vue.prototype, '$tools', { value: tools })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: { store },
})
