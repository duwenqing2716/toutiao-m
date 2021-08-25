import { createApp } from 'vue'

import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用处理相对时间的插件
// const app = createApp(app)

// app.config.globalProperties.$filters = {
//     valueOfNull(value) {
//         if (value == "") {
//             return "暂无信息"
//         } else {
//             return value
//         }
//     }
// }
dayjs.extend(relativeTime)
// 配置使用中文语言包
dayjs.locale('zh-cn')
