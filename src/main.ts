import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import '../src/style/base.less'
import VueWangeditor from 'vue-wangeditor-simple'
import VueHighlightJS from 'vue-highlightjs'

Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(VueWangeditor)
Vue.use(VueHighlightJS)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuthAdmin)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    // true is Admin
    const isAdmin =
      (window.localStorage.getItem('role') as any).indexOf('USER') === -1
    if (!isAdmin) {
      next(false)
    } else {
      next()
    }
    next()
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
