const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
}

// vue.config.js 常⽤配置
module.exports = {
    chainWebpack: config => {
        config.resolve.alias
            //设置“src”目录别名为“@”
            .set("@", resolve("src"))
						.set('assets', resolve('src/assets'))
						.set('common', resolve('src/common'))
						.set('components', resolve('src/components'))
            .set("views", resolve("src/views"))
						.set("network", resolve("src/network"))
    }
}
