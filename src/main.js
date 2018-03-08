// Dependencies
import Vue from 'vue'
import VueFire from 'vuefire'
import lodash from 'lodash'

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: { store },
})
