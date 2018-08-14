/**
 * test loader
 */
import Vue from 'vue'
import './index.less'
import App from './app.vue'
const a = 1
console.log(a)
new Vue({
    el: '#app',
    render: h => h(App)
})