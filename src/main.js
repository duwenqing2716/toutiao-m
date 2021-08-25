import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import mitt from 'mitt';//引入mitt

const emitter = mitt();  

const app = createApp(App);
app.provide('emitter', emitter);   

import './common/dayjs.js'

import Vant from 'vant';

import 'vant/lib/index.css';

import './assets/css/index.less' //后者覆盖前者,因此最好将全局放在第三方后面

app.use(store).use(router).use(Vant).mount('#app')
